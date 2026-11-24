/* eslint-disable @next/next/no-img-element -- pre-sized WebP with our own srcset (scripts/field-notes.mjs) */
import type { CSSProperties } from "react";
import type { FieldNotes as Notes, FieldShot } from "@/content/fieldnotes";
import type { Lang } from "@/lib/i18n";
import { roman } from "@/lib/engrave";
import { PlateHead } from "./Typography";
import FieldFilm from "./FieldFilm";
import FieldHyphae from "./FieldHyphae";
import FieldVignette from "./FieldVignette";
import { seedFrom } from "@/lib/engrave";

/** Each print is tipped on by hand: a slight, fixed tilt (degrees), straightened on hover. */
const TILTS = [-0.8, 0.6, -0.35, 0.9, -0.6, 0.4, -0.95, 0.3];

/** Same widths and rule as scripts/field-notes.mjs (never upscale). */
const WIDTHS = [480, 800, 1200, 1600, 2000];
const fieldWidths = (w: number) => WIDTHS.filter((x) => x <= w);

const SIZES: Record<FieldShot["shape"], string> = {
  wide: "(max-width: 640px) calc(100vw - 32px), (max-width: 960px) 62vw, 640px",
  tall: "(max-width: 640px) calc(100vw - 32px), (max-width: 960px) 31vw, 320px",
  pano: "(max-width: 960px) 100vw, 1000px",
  plate: "(max-width: 960px) 100vw, 1000px",
};

const T = {
  zh: {
    title: "現場紀錄",
    en: "Field notes",
    figs: (n: number) => `${n} 幀`,
    nav: "樣線：講台、觀眾席、交會帶",
  },
  en: {
    title: "Field notes",
    en: undefined,
    figs: (n: number) => `${n} ${n === 1 ? "frame" : "frames"}`,
    nav: "Transect: lectern, audience, ecotone",
  },
} satisfies Record<Lang, unknown>;

function Swatch({ pattern }: { pattern: string }) {
  return (
    <svg className="fn-swatch" aria-hidden="true" preserveAspectRatio="none">
      <rect width="100%" height="100%" fill="var(--card)" />
      <rect width="100%" height="100%" fill={`url(#${pattern})`} />
    </svg>
  );
}

/**
 * The volume's field notes: photographs (and short films) laid out as a transect of the
 * evening, lectern → audience → ecotone. Each photo shows a designed crop (no enlarging).
 * Films play muted in view (see FieldFilm).
 */
export default function FieldNotes({ notes, lang }: { notes: Notes; lang: Lang }) {
  const t = T[lang];
  const base = `/field/${notes.dir}`;
  const all = notes.movements.flatMap((m) => m.shots);
  const figNo = new Map(all.map((s, i) => [s.id, i + 1]));
  const cols = notes.movements.map((m) => `minmax(0, ${Math.max(m.shots.length, 2)}fr)`).join(" ");

  return (
    <section className="sec fn" id="field-notes" aria-labelledby="fn-h">
      <div className="wrap">
        <PlateHead lang={lang} no="§" label="Field notes" id="fn-h" title={t.title} en={t.en} side={`${notes.side} · ${all.length} figs`} />
        <p className="fn-intro reveal">{notes.intro[lang]}</p>

        <nav className="fn-transect reveal" aria-label={t.nav} style={{ gridTemplateColumns: cols }}>
          {notes.movements.map((m, i) => (
            <a key={m.key} href={`#fn-${m.key}`}>
              <Swatch pattern={m.pattern} />
              <span className="fn-tr-label">
                <span className="mono fn-tr-no">{roman(i + 1)}</span> <b>{m.title[lang]}</b> <i>{m.gloss[lang]}</i>
              </span>
              <span className="mono fn-tr-count">{t.figs(m.shots.length)}</span>
            </a>
          ))}
        </nav>

        {notes.movements.map((m, mi) => (
          <div key={m.key} className="fn-move" id={`fn-${m.key}`}>
            <header className="fn-rail reveal">
              <p className="fn-roman" aria-hidden="true">
                {roman(mi + 1)}.
              </p>
              <h3>
                {m.title[lang]} <i lang={lang === "zh" ? "en" : "zh-Hant"}>{m.gloss[lang]}</i>
              </h3>
              <p className="fn-note">{m.note[lang]}</p>
              {m.time && <p className="mono fn-time">{m.time}</p>}
              <Swatch pattern={m.pattern} />
              {m.vignette && <FieldVignette kind={m.vignette} />}
            </header>
            <FieldHyphae seed={seedFrom(`${notes.dir}-${m.key}`)} braid={m.braid} species={m.species} />
            <div className="fn-grid">
              {m.shots.map((s, si) => {
                const n = figNo.get(s.id) ?? 0;
                const cap = (
                  <figcaption>
                    <span className="mono fn-fig">
                      Fig. {n}
                      {s.cue && <span> · {s.cue[lang]}</span>}
                    </span>
                    <span className="fn-cap">{s.caption[lang]}</span>
                  </figcaption>
                );
                if (s.kind === "video") {
                  return (
                    <figure key={s.id} className={`fn-shot fn-shot--${s.shape} reveal`}>
                      <FieldFilm src={`${base}/${s.id}.mp4`} poster={`${base}/${s.id}-poster.webp`} w={s.w} h={s.h} seconds={s.seconds} label={s.alt[lang]} lang={lang} />
                      {cap}
                    </figure>
                  );
                }
                const ws = fieldWidths(s.w);
                const tilt = s.shape === "plate" ? 0 : TILTS[(n + mi) % TILTS.length];
                const style = { "--ar": `${s.w} / ${s.h}`, "--tilt": `${tilt}deg` } as CSSProperties;
                return (
                  <figure key={s.id} className={`fn-shot fn-shot--${s.shape} reveal`} style={style}>
                    <div className="fn-mount">
                      <img
                        src={`${base}/${s.id}-${ws.at(-1)}.webp`}
                        srcSet={ws.map((w) => `${base}/${s.id}-${w}.webp ${w}w`).join(", ")}
                        sizes={SIZES[s.shape]}
                        width={s.w}
                        height={s.h}
                        alt={s.alt[lang]}
                        loading="lazy"
                        decoding="async"
                      />
                      {s.shape !== "plate" && <span className={`tape ${si % 2 ? "b" : "a"}`} aria-hidden="true" />}
                    </div>
                    {cap}
                  </figure>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
