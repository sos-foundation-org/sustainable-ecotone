import Link from "next/link";
import type { CSSProperties } from "react";
import type { ForumEvent } from "@/content/events";
import { catalogNo, speakerById } from "@/content/speakers";
import { FIELD_NOTES } from "@/content/fieldnotes";
import { ORGS } from "@/content/site";
import { pad2, roman, seedFrom } from "@/lib/engrave";
import { localePath, type Lang } from "@/lib/i18n";
import { Portrait } from "./Specimen";
import Swatch from "./Swatch";
import FieldHyphae from "./FieldHyphae";
import { ROMAN } from "./Trio";

const T = {
  zh: {
    held: "已舉辦",
    stamp: "收錄",
    talk: "講題",
    ids: (n: number) => `${n} 種身份`,
    sheet: "完整台紙",
    open: "翻開這一冊",
    notes: "現場紀錄",
    counts: (s: number, i: number, f: number) => `${s} 位講者 · ${i} 種身份 · ${f} 個學科`,
  },
  en: {
    held: "Held",
    stamp: "Accessioned",
    talk: "Talk",
    ids: (n: number) => `${n} identities`,
    sheet: "Full sheet",
    open: "Open the volume",
    notes: "Field notes",
    counts: (s: number, i: number, f: number) => `${s} speakers · ${i} identities · ${f} fields`,
  },
} satisfies Record<Lang, unknown>;

const MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
/** 2026-11-17 → 17.XI.2026, the way the plates write dates */
const plateDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}.${MONTHS[m - 1]}.${y}`;
};
const TILTS = [-0.6, 0.5, -0.3, 0.7, -0.45, 0.35];

/**
 * One held volume on the Past Speakers page, as a drawer of the cabinet: a label for the
 * drawer (volume, dates, venues, an accession stamp) and, inside, one index card per speaker
 * who gave a talk (`presenters`), a portion of their sheet: portrait, catalogue number, name,
 * talk, identities (titles only), discipline linetypes and a link to the full sheet on the
 * event page. A mycelium (FieldHyphae) runs under the cards and joins them.
 */
export default function PastVolume({ e, lang }: { e: ForumEvent; lang: Lang }) {
  const t = T[lang];
  const zh = lang === "zh";
  const href = (p: string) => localePath(lang, p);
  const people = (e.presenters ?? e.speakers).map(speakerById).filter((s) => s !== undefined);
  const dates = (e.sessions ?? []).map((s) => s.isoDate).filter((d): d is string => Boolean(d)).sort();
  const span = dates.length ? (dates.length > 1 ? `${plateDate(dates[0]).split(".")[0]}–${plateDate(dates[dates.length - 1])}` : plateDate(dates[0])) : e.dateShort;
  const fields = new Set(people.flatMap((s) => s.disciplines));
  const identities = people.reduce((n, s) => n + s.identities.length, 0);
  const hasNotes = Boolean(FIELD_NOTES[e.slug]);

  return (
    <div className="cab">
      <header className="cab-front reveal">
        <div className="cab-holder">
          <p className="mono cab-vol">
            <span>Vol. {pad2(e.vol)}</span> <span className="cab-held">· {t.held}</span>
          </p>
          <p className="cab-title">
            <span lang={zh ? "en" : undefined}>{e.title}</span>
            <i>{e.subtitle[lang]}</i>
          </p>
          <ul className="cab-sessions">
            {(e.sessions ?? []).map((s) => (
              <li key={s.id}>
                <span className="mono">{s.date[lang]}</span> {s.venue[lang]}
              </li>
            ))}
          </ul>
          <p className="mono cab-count">{t.counts(people.length, identities, fields.size)}</p>
        </div>
        <svg className="cab-stamp" viewBox="0 0 132 132" aria-hidden="true" focusable="false">
          <defs>
            <path id={`cab-ring-${e.vol}`} d="M66 66m-48 0a48 48 0 1 1 96 0a48 48 0 1 1 -96 0" />
          </defs>
          <circle cx="66" cy="66" r="60" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="66" cy="66" r="55" fill="none" stroke="currentColor" strokeWidth=".6" />
          <circle cx="66" cy="66" r="36" fill="none" stroke="currentColor" strokeWidth=".6" />
          <text className="svg-mono svg-mono--xs" fill="currentColor" letterSpacing="2.4">
            <textPath href={`#cab-ring-${e.vol}`}>ECOTONE · ACCESSIO · {span} ·</textPath>
          </text>
          <text x="66" y="62" textAnchor="middle" className="cab-stamp-no" fill="currentColor">
            {roman(e.vol)}
          </text>
          <text x="66" y="80" textAnchor="middle" className="svg-mono svg-mono--xs" fill="currentColor">
            {t.stamp}
          </text>
        </svg>
        <div className="cab-links">
          <Link className="txtlink" href={href(`/events/${e.slug}`)}>
            {t.open} <span aria-hidden="true">☞</span>
          </Link>
          {hasNotes && (
            <Link className="txtlink" href={href(`/events/${e.slug}#field-notes`)}>
              {t.notes} <span aria-hidden="true">☞</span>
            </Link>
          )}
        </div>
      </header>

      <div className="cab-bed">
        <FieldHyphae seed={seedFrom(`cab-${e.slug}`)} species={["mycena", "amanita", "coprinus", "cantharellus"]} grid=".cab-grid" item=".cab-card .mounted" rail=".cab-none" />
        <ol className="cab-grid">
          {people.map((s, i) => (
            <li key={s.id} className="cab-card reveal" id={s.id} style={{ "--tilt": `${TILTS[i % TILTS.length]}deg`, transitionDelay: `${i * 90}ms` } as CSSProperties}>
              <article aria-labelledby={`cab-${s.id}`}>
                <Portrait s={s} lang={lang} />
                <p className="mono cab-no">
                  <span>{catalogNo(s)}</span>
                  <span className="muted">{t.ids(s.identities.length)}</span>
                </p>
                <h3 id={`cab-${s.id}`}>{s.name[lang]}</h3>
                <p className="cab-en">{zh ? s.nameEn !== s.name.zh && <i lang="en">{s.nameEn}</i> : <i>{s.short}</i>}</p>
                {s.members && s.members.length > 0 && (
                  <p className="cab-members">
                    {s.members.map((m, k) => (
                      <span key={m.nameEn}>
                        <span className="mono cin">{ROMAN[k] ?? k + 1}.</span> {m.name[lang]}
                      </span>
                    ))}
                  </p>
                )}
                {s.talk && (
                  <p className="cab-talk">
                    <span className="mono cin">{t.talk}</span> {s.talk[lang]}
                  </p>
                )}
                <ol className="cab-ids">
                  {s.identities.map((id, k) => (
                    <li key={id.title.zh}>
                      <span className="mono">{roman(k + 1)}</span> {id.title[lang]}
                    </li>
                  ))}
                </ol>
                <div className="cab-foot">
                  <div className="sheet-disc">
                    {s.disciplines.map((k) => (
                      <Swatch key={k} k={k} lang={lang} tip />
                    ))}
                  </div>
                  <p className="cab-orgs muted">{s.orgs.map((o) => ORGS[o].name[lang]).join(" · ")}</p>
                  <Link className="txtlink cab-more" href={href(`/events/${e.slug}#${s.id}`)}>
                    {t.sheet} <span aria-hidden="true">☞</span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
