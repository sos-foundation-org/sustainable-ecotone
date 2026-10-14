/* eslint-disable @next/next/no-img-element -- speaker photos are plain static files */
import { catalogNo, LABEL_KINDS, type Speaker } from "@/content/speakers";
import { ORGS, SHOW_DRAFTS } from "@/content/site";
import { fmtCoord, mulberry32, seedFrom } from "@/lib/engrave";
import type { Lang } from "@/lib/i18n";
import Logo from "./Logo";
import OrgLink from "./OrgLink";
import Rich from "./Rich";
import Swatch from "./Swatch";
import { Genet } from "./Fungi";

// The sheets borrow the look of a herbarium mount, but the copy never calls a speaker a specimen.
const T = {
  zh: {
    portrait: (n: string) => `${n} 肖像`,
    placeholder: "講者肖像 4:5 · 待補",
    labels: (n: string, k: number) => `${n} 的 ${k} 種身份`,
    top: "Ecotone · 講者",
    disc: "學科線型",
    talk: "Talk · 講題",
    talkTbc: "講題確認中",
    affils: "所屬機構",
    flag: "暫代",
  },
  en: {
    portrait: (n: string) => `Portrait of ${n}`,
    placeholder: "Portrait 4:5 · to come",
    labels: (n: string, k: number) => `${n}: ${k} identities`,
    top: "Ecotone · Speaker",
    disc: "Discipline linetypes",
    talk: "Talk",
    talkTbc: "Title to be confirmed",
    affils: "Affiliations",
    flag: "Placeholder",
  },
} satisfies Record<Lang, unknown>;

/** Herbarium-style barcode generated from the catalogue number. */
export function Barcode({ code }: { code: string }) {
  const rnd = mulberry32(seedFrom(code));
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 104) {
    const w = 0.8 + Math.floor(rnd() * 3) * 0.8;
    if (rnd() > 0.35) bars.push({ x, w });
    x += w + 0.9 + rnd() * 1.2;
  }
  return (
    <svg className="barcode" viewBox="0 0 110 28" aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x.toFixed(2)} y="0" width={b.w.toFixed(2)} height="19" fill="#1C1A17" />
      ))}
      <text x="0" y="27" className="svg-mono svg-mono--xs" fill="#5E5141">
        {code}
      </text>
    </svg>
  );
}

/**
 * Mounted portrait. With `photo` it shows the image in an ink/sepia duotone;
 * without, an engraved placeholder card clearly marked for the client.
 */
export function Portrait({ s, size = "md", lang = "zh" }: { s: Speaker; size?: "sm" | "md"; lang?: Lang }) {
  const t = T[lang];
  return (
    <div className={`mounted mounted--${size}${s.photo ? " has-photo" : ""}`}>
      <span className="tape a" aria-hidden="true" />
      <span className="tape b" aria-hidden="true" />
      <span className="tape c" aria-hidden="true" />
      <span className="tape d" aria-hidden="true" />
      {s.photo ? (
        <img src={s.photo} alt={t.portrait(s.name[lang])} />
      ) : (
        <div className="ph" aria-hidden="true">
          <span className="initial">{s.initial[lang]}</span>
          {size === "md" && (
            <span className="ph-flag">
              PHOTO PLACEHOLDER
              <br />
              {t.placeholder}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** The stack of herbarium labels — one per identity. */
export function LabelStack({ s, lang = "zh" }: { s: Speaker; lang?: Lang }) {
  return (
    <ol className="labels" aria-label={T[lang].labels(s.name[lang], s.identities.length)}>
      {s.identities.map((id, i) => {
        const kind = LABEL_KINDS[Math.min(i, LABEL_KINDS.length - 1)];
        return (
          <li className="label" key={id.title.zh}>
            <div className="k">
              <span>
                {kind.abbr} <span className="k-zh">{kind.label[lang]}</span>
              </span>
              <span>
                {i + 1} / {s.identities.length}
              </span>
            </div>
            <b>{id.title[lang]}</b>
            <p>{id.detail[lang]}</p>
          </li>
        );
      })}
    </ol>
  );
}

/** One speaker as a living herbarium sheet. `full` adds bio, talk, affiliations and notes. */
export default function SpecimenSheet({
  s,
  vol = "Vol. 01 · Cross-Pollination",
  full = false,
  headingLevel = 3,
  lang = "zh",
}: {
  s: Speaker;
  vol?: string;
  full?: boolean;
  headingLevel?: 2 | 3;
  lang?: Lang;
}) {
  const t = T[lang];
  const no = catalogNo(s);
  const H = headingLevel === 2 ? "h2" : "h3";
  // a single-identity sheet flows its bio and linetypes into the label column
  const solo = s.identities.length === 1;
  const disc = (
    <div className="sheet-disc" aria-label={t.disc}>
      {s.disciplines.map((k) => (
        <Swatch key={k} k={k} lang={lang} />
      ))}
    </div>
  );
  return (
    <article className={`sheet${full ? " sheet--full" : ""}`} id={full ? s.id : undefined} aria-labelledby={`sheet-${s.id}`}>
      <div className="sheet-top mono">
        <span>
          <span className="seg">{t.top}</span>
          <span className="seg">{vol}</span>
        </span>
        <Barcode code={`ECO-001-${no.slice(4)}`} />
      </div>
      <div className="sheet-body">
        <Portrait s={s} lang={lang} />
        {solo ? (
          <div>
            <LabelStack s={s} lang={lang} />
            <div className="sheet-solo">
              {full && <Rich as="p" className="bio" html={s.bio[lang]} />}
              {disc}
            </div>
          </div>
        ) : (
          <LabelStack s={s} lang={lang} />
        )}
      </div>
      <div className="sheet-name">
        <H id={`sheet-${s.id}`}>{s.name[lang]}</H>
        <i>{lang === "zh" ? s.nameEn : s.short}</i>
        <span className="mono sheet-loc">
          {no} · Loc. {s.places.map((p) => `${p.name}${p.approx ? "" : ` ${fmtCoord(p.lat, p.lng)}`}`).join(" ⇄ ")}
        </span>
      </div>
      <Genet seed={s.id} count={s.identities.length} names={s.identities.map((i) => i.title[lang])} lang={lang} />
      {!solo && disc}
      {full && (
        <div className="sheet-more">
          {!solo && <Rich as="p" className="bio" html={s.bio[lang]} />}
          <dl className="talk">
            <dt className="mono">{t.talk}</dt>
            <dd>{s.talk?.[lang] ?? t.talkTbc}</dd>
          </dl>
          {s.orgs.length > 0 && (
            <ul className="affils" aria-label={t.affils}>
              {s.orgs.map((k) => (
                <li key={k}>
                  <OrgLink org={k} className="affil" lang={lang}>
                    {ORGS[k].logo && <Logo src={ORGS[k].logo} />}
                    {ORGS[k].name[lang]}
                    {SHOW_DRAFTS && ORGS[k].placeholder && <span className="flag">{t.flag}</span>}
                  </OrgLink>
                </li>
              ))}
            </ul>
          )}
          {s.draftNote && <p className="draft-note">† {s.draftNote[lang]}</p>}
        </div>
      )}
    </article>
  );
}
