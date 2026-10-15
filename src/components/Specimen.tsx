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
    lab: "實驗室網頁",
    personal: "個人網頁",
    highlights: "亮點",
    pubs: "重要著作",
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
    lab: "Lab website",
    personal: "Personal website",
    highlights: "Highlights",
    pubs: "Selected works",
    flag: "Placeholder",
  },
} satisfies Record<Lang, unknown>;

/**
 * Engraved line glyphs for a speaker's own pages, drawn in the site's ink-and-cinnabar hand:
 * a lab flask with a sprouting seedling, and a cameo portrait framed by a leaf sprig.
 */
function LinkGlyph({ kind }: { kind: "lab" | "personal" }) {
  return (
    <svg className="link-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="#1C1A17" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        {kind === "lab" ? (
          <>
            <path d="M9.6 6.2h4.8M10.5 6.2v4.4L5.4 18.6a1.7 1.7 0 0 0 1.5 2.6h10.2a1.7 1.7 0 0 0 1.5-2.6l-5.1-8V6.2" />
            <path d="M7.3 15.6h9.4" />
            <path d="M8.2 18.9l2.4-2.4M10.9 20.4l3.6-3.6M14.4 20.6l2-2" strokeWidth=".6" />
            <path d="M12 6.2V2.8" />
            <path d="M12 4.3c-1.6.2-2.6-.6-2.9-1.9 1.5-.1 2.6.5 2.9 1.9Z" fill="#A8321F" stroke="#A8321F" strokeWidth=".6" />
            <path d="M12 3.5c1.2-.9 2.4-.9 3.3-.1-1.1.9-2.3.9-3.3.1Z" />
          </>
        ) : (
          <>
            <ellipse cx="12" cy="11.4" rx="6.4" ry="8" />
            <ellipse cx="12" cy="11.4" rx="5.3" ry="6.9" strokeWidth=".5" />
            <circle cx="12" cy="9.6" r="2.2" />
            <path d="M8.3 16.4c.7-2 2.1-3 3.7-3s3 1 3.7 3" />
            <path d="M4.2 21.4c2.6.1 4.6-.8 5.7-2.5" />
            <path d="M6.1 20.9c-.1-1 .4-1.8 1.3-2.2.2 1-.3 1.8-1.3 2.2Z" fill="#A8321F" stroke="#A8321F" strokeWidth=".6" />
            <path d="M8.2 19.9c.1-1 .7-1.6 1.7-1.8 0 1-.6 1.7-1.7 1.8Z" />
          </>
        )}
      </g>
    </svg>
  );
}

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
 * Mounted portrait. With `photo` it shows the image in full colour (never greyscale);
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
        <img src={s.photo} alt={t.portrait(s.name[lang])} style={s.photoPos ? { objectPosition: s.photoPos } : undefined} />
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
  vol = "Vol. 01 · Sustainable Urbanization? Rewilding?",
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
  const disc = (
    <div className="sheet-disc" aria-label={t.disc}>
      {s.disciplines.map((k) => (
        <Swatch key={k} k={k} lang={lang} tip />
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
        {/* discipline linetypes sit beside the barcode, top right */}
        <div className="sheet-top-r">
          {disc}
          <Barcode code={`ECO-001-${no.slice(4)}`} />
        </div>
      </div>
      <div className="sheet-body">
        <Portrait s={s} lang={lang} />
        {/* identity cards, then the bio, above the rule */}
        <div className="sheet-right">
          <LabelStack s={s} lang={lang} />
          {full && <Rich as="p" className="bio" html={s.bio[lang]} />}
        </div>
      </div>
      <div className="sheet-name">
        <H id={`sheet-${s.id}`}>{s.name[lang]}</H>
        {/* the italic line repeats the name in English on Chinese pages, unless it already is English */}
        {lang === "zh" ? s.nameEn !== s.name.zh && <i>{s.nameEn}</i> : <i>{s.short}</i>}
        <span className="mono sheet-loc">
          {no} · Loc. {s.places.map((p) => `${p.name}${p.approx ? "" : ` ${fmtCoord(p.lat, p.lng)}`}`).join(" ⇄ ")}
        </span>
      </div>
      {/* order: photo + identity cards, then the bio, then highlights, then the rest */}
      {full && (
        <div className="sheet-more">
          {s.highlights && s.highlights.length > 0 && (
            <section className="highlights" aria-label={t.highlights}>
              <h4 className="mono">{t.highlights}</h4>
              <ul>
                {s.highlights.map((h) => (
                  <li key={h.zh}>{h[lang]}</li>
                ))}
              </ul>
            </section>
          )}
          {s.publications && s.publications.length > 0 && (
            <section className="highlights highlights--pubs" aria-label={t.pubs}>
              <h4 className="mono">{t.pubs}</h4>
              <ul>
                {s.publications.map((p) => (
                  <Rich as="li" key={p.zh} html={p[lang]} />
                ))}
              </ul>
            </section>
          )}
          <dl className="talk">
            <dt className="mono">{t.talk}</dt>
            <dd>{s.talk?.[lang] ?? t.talkTbc}</dd>
          </dl>
          {(s.orgs.length > 0 || (s.links?.length ?? 0) > 0) && (
            <ul className="affils" aria-label={t.affils}>
              {s.orgs.map((k) => {
                const inner = (
                  <>
                    {ORGS[k].logo && <Logo src={ORGS[k].logo} />}
                    {ORGS[k].name[lang]}
                    {SHOW_DRAFTS && ORGS[k].placeholder && <span className="flag">{t.flag}</span>}
                  </>
                );
                return (
                  <li key={k}>
                    {s.linkedOrgs?.includes(k) ? (
                      <OrgLink org={k} className="affil" lang={lang}>
                        {inner}
                      </OrgLink>
                    ) : (
                      <span className="affil affil--plain">{inner}</span>
                    )}
                  </li>
                );
              })}
              {s.links?.map((l) => (
                <li key={l.url}>
                  <a className="affil affil--link" href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.icon ? <img src={l.icon} alt="" /> : <LinkGlyph kind={l.kind} />}
                    {t[l.kind]}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {s.draftNote && <p className="draft-note">† {s.draftNote[lang]}</p>}
        </div>
      )}
      <Genet seed={s.id} count={s.identities.length} names={s.identities.map((i) => i.title[lang])} lang={lang} corner />
    </article>
  );
}
