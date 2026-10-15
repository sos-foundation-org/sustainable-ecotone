"use client";

import { useMemo, useState } from "react";
import type { Discipline, DisciplineKey } from "@/content/disciplines";
import type { Place } from "@/content/speakers";
import type { Voice } from "@/content/voices";
import { fmtCoord, r2, seedFrom } from "@/lib/engrave";
import { hyphaPath, rng, toPath, walker, type Rng } from "@/lib/mycelium";
import type { Lang } from "@/lib/i18n";

const T = {
  zh: {
    title: "交會圖譜：上方是學科，中間每位講者是同一條根莖上的一個節點，下方是他們所在的地方。每條根代表一個真實的連結；完整列表見圖下說明。",
    fields: "↑ 學科 fields",
    places: "↓ 地方 places",
    vacant: " · 待連結",
    voice: "多元聲音 · voice",
    vacantHead: "待連結的學科 · vacant fields",
    sep: "、",
    key: "講者與其學科、地點",
  },
  en: {
    title: "Atlas of Crossings: fields float above; in the middle, each speaker is a knot on one shared rhizome; below lie the places where they work. Every root is a real connection. The full list follows the figure.",
    fields: "↑ fields",
    places: "↓ places",
    vacant: " · open",
    voice: "Diverse Voices",
    vacantHead: "Vacant fields",
    sep: ", ",
    key: "Speakers, their fields and places",
  },
} satisfies Record<Lang, unknown>;

export type AtlasSpeaker = {
  id: string;
  name: string;
  /** small round headshot on the name tag below the plate */
  photo?: string;
  initial?: string;
  disciplines: DisciplineKey[];
  places: Place[];
};

type Pt = { x: number; y: number };
type AtlasPlace = { key: string; name: string; sub: string; kind: "speaker" | "voice" };
type Root = { d: string; w: number; owner: string; to: string };
type Layout = {
  W: number;
  H: number;
  shore: number;
  disc: (Discipline & Pt & { vacant: boolean })[];
  spk: (AtlasSpeaker & Pt)[];
  plc: (AtlasPlace & Pt)[];
  roots: Root[];
  lace: { d: string; owner: string }[];
  rhizome: string;
  songs: string[];
};

/** Root from a to b: a main strand that wanders toward its target, with a few short side rootlets. */
function root(a: Pt, b: Pt, R: Rng, owner: string, to: string, out: Root[], lace: { d: string; owner: string }[]) {
  const pts = hyphaPath(a.x, a.y, b.x, b.y, R, 7);
  out.push({ d: toPath(pts), w: 1.2, owner, to });
  for (let i = 0; i < 2; i++) {
    const p = pts[Math.floor(pts.length * (0.25 + R() * 0.5))];
    if (p) lace.push({ d: toPath(walker(p[0], p[1], R() * Math.PI * 2, 14 + R() * 26, R, 4)), owner });
  }
}

function build(speakers: AtlasSpeaker[], disciplines: Discipline[], places: AtlasPlace[], seed: number, narrow: boolean, lang: Lang): Layout {
  // English field names run longer: keep their labels inside the plate
  const en = lang === "en";
  const R = rng(seed);
  const covered = new Set(speakers.flatMap((s) => s.disciplines));
  const discList = narrow ? disciplines.filter((d) => covered.has(d.key)) : disciplines;
  const W = narrow ? 380 : 760;
  const jit = (n: number) => (R() - 0.5) * n;

  // fields float in the upper band, places lie below the shore line, speakers on the rhizome between
  let disc: Layout["disc"];
  let spk: Layout["spk"];
  let plc: Layout["plc"];
  let H: number;
  let shore: number;
  if (narrow) {
    const rowD = Math.ceil(discList.length / 2);
    disc = discList.map((d, i) => ({ ...d, vacant: !covered.has(d.key), x: r2((i % 2 ? (en ? 196 : 236) : 46) + jit(30)), y: r2(40 + Math.floor(i / 2) * 58 + (i % 2) * 22) }));
    const y0 = 40 + rowD * 58 + 50;
    spk = speakers.map((s, i) => ({ ...s, x: r2((i % 2 ? 250 : 120) + jit(24)), y: r2(y0 + i * 62) }));
    shore = y0 + speakers.length * 62 + 6;
    plc = places.map((p, i) => ({ ...p, x: r2((i % 2 ? 236 : 46) + jit(20)), y: r2(shore + 56 + Math.floor(i / 2) * 62 + (i % 2) * 24) }));
    H = shore + 56 + Math.ceil(places.length / 2) * 62 + 30;
  } else {
    H = 600;
    shore = 380;
    const n = Math.max(1, speakers.length);
    spk = speakers.map((s, i) => ({ ...s, x: r2(80 + ((W - 200) * (i + 0.5)) / n + jit(30)), y: r2(270 + jit(60)) }));
    // loose rejection-sampled scatter for fields, never in columns
    const placed: Pt[] = [];
    disc = discList.map((d) => {
      let best: Pt = { x: 0, y: 0 };
      let bestD = -1;
      for (let t = 0; t < 60; t++) {
        const c = { x: 30 + R() * (W - (en ? 230 : 150)), y: 34 + R() * 150 };
        const dd = Math.min(999, ...placed.map((p) => Math.hypot(p.x - c.x, (p.y - c.y) * 2.2)));
        if (dd > bestD) {
          bestD = dd;
          best = c;
        }
      }
      placed.push(best);
      return { ...d, vacant: !covered.has(d.key), x: r2(best.x), y: r2(best.y) };
    });
    const m = Math.max(1, places.length);
    plc = places.map((p, i) => ({ ...p, x: r2(40 + ((W - 170) * (i + 0.5)) / m + jit(26)), y: r2(shore + 56 + (i % 3) * 54 + jit(8)) }));
  }

  const roots: Root[] = [];
  const lace: Layout["lace"] = [];
  for (const s of spk) {
    for (const k of s.disciplines) {
      const d = disc.find((q) => q.key === k);
      if (d) root(s, { x: d.x + 14, y: d.y + 10 }, R, s.id, "d:" + k, roots, lace);
    }
    for (const p of s.places) {
      const q = plc.find((x) => x.key === p.name);
      if (q) root(s, { x: q.x, y: q.y }, R, s.id, "p:" + p.name, roots, lace);
    }
  }
  // the shared rhizome: every speaker of the collection on one living strand
  const order = [...spk].sort((a, b) => (narrow ? a.y - b.y : a.x - b.x));
  let rhizome = "";
  for (let i = 0; i < order.length - 1; i++) rhizome += toPath(hyphaPath(order[i].x, order[i].y, order[i + 1].x, order[i + 1].y, R, 8));
  // voices reach the forum across the sea: dotted song lines to the nearest speaker place in Taiwan (or the first place)
  const songs: string[] = [];
  const home = plc.find((p) => p.kind === "speaker");
  if (home) for (const v of plc.filter((p) => p.kind === "voice")) songs.push(`M${v.x} ${v.y}Q${r2((v.x + home.x) / 2)} ${r2(Math.max(v.y, home.y) + 40)} ${home.x} ${home.y}`);
  return { W, H, shore, disc, spk, plc, roots, lace, rhizome, songs };
}

/**
 * Atlas of Crossings, printed like a cyanotype of pressed roots. Fields float
 * above, places lie below the shore line, and each speaker is a knot on one
 * rhizome whose roots reach the fields and places they really touch (from
 * content). Hover / focus / press a speaker in the key to light their roots.
 * On narrow screens the plate simplifies: only touched fields are drawn, the
 * rest are listed in text.
 */
export default function CrossingAtlas({
  speakers,
  disciplines,
  caption,
  idPrefix = "atlas",
  voices,
  lang = "zh",
}: {
  speakers: AtlasSpeaker[];
  disciplines: Discipline[];
  caption?: string;
  idPrefix?: string;
  /** optional: also map Diverse Voices (多元聲音) as places across the sea */
  voices?: Voice[];
  lang?: Lang;
}) {
  const t = T[lang];
  const [hl, setHl] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hl ?? pinned;

  const places = useMemo(() => {
    const out: AtlasPlace[] = [];
    for (const s of speakers) for (const p of s.places) if (!out.some((q) => q.key === p.name)) out.push({ key: p.name, name: p.name, sub: `${p.approx ? "≈ " : ""}${fmtCoord(p.lat, p.lng)}`, kind: "speaker" });
    const near = (lat: number, lng: number) => speakers.some((s) => s.places.some((p) => Math.abs(p.lat - lat) < 1.5 && Math.abs(p.lng - lng) < 1.5));
    for (const v of voices ?? []) if (v.lat !== undefined && v.lng !== undefined && !near(v.lat, v.lng) && !out.some((q) => q.key === v.location)) out.push({ key: v.location, name: v.location, sub: t.voice, kind: "voice" });
    return out;
  }, [speakers, voices, t.voice]);
  const seed = seedFrom(idPrefix + speakers.map((s) => s.id).join());
  const wide = useMemo(() => build(speakers, disciplines, places, seed, false, lang), [speakers, disciplines, places, seed, lang]);
  const narrow = useMemo(() => build(speakers, disciplines, places, seed, true, lang), [speakers, disciplines, places, seed, lang]);
  const covered = new Set(speakers.flatMap((s) => s.disciplines));
  const vacant = disciplines.filter((d) => !covered.has(d.key));

  const state = (owner: string) => (active ? (owner === active ? " on" : " off") : "");
  const touchedBy = (id: string) => {
    if (!active) return "";
    const s = speakers.find((x) => x.id === active);
    if (!s) return "";
    const hit = id.startsWith("d:") ? s.disciplines.includes(id.slice(2) as DisciplineKey) : s.places.some((p) => p.name === id.slice(2));
    return hit ? " on" : " off";
  };

  const plate = (L: Layout, variant: "wide" | "narrow") => (
    <svg className={`atlas-svg atlas-svg--${variant}`} viewBox={`0 0 ${L.W} ${L.H}`} role="img" aria-labelledby={`${idPrefix}-${variant}-t`}>
      <title id={`${idPrefix}-${variant}-t`}>{t.title}</title>
      <path className="atlas-shore" d={`M0 ${L.shore}C${L.W * 0.25} ${L.shore - 6} ${L.W * 0.5} ${L.shore + 6} ${L.W * 0.75} ${L.shore}S${L.W} ${L.shore - 4} ${L.W} ${L.shore}`} />
      <text x={8} y={L.shore - 8} className="atlas-tag">
        {t.fields}
      </text>
      <text x={8} y={L.shore + 18} className="atlas-tag">
        {t.places}
      </text>
      <g className="atlas-roots">
        <path className="atlas-rhizome" d={L.rhizome} />
        {L.songs.map((d, i) => (
          <path key={i} className="atlas-song" d={d} />
        ))}
        {L.lace.map((l, i) => (
          <path key={i} className={`atlas-lace${state(l.owner)}`} d={l.d} />
        ))}
        {L.roots.map((r, i) => (
          <path key={i} className={`atlas-root${state(r.owner)}`} d={r.d} />
        ))}
      </g>
      {L.disc.map((d) => (
        <g key={d.key} className={`atlas-d${d.vacant ? " vacant" : ""}${touchedBy("d:" + d.key)}`} transform={`translate(${d.x} ${d.y})`}>
          <rect width="28" height="16" fill="#FAF6EC" className="sw-bg" />
          <rect width="28" height="16" fill={`url(#lt-${d.key})`} className="sw-pat" />
          <rect width="28" height="16" className="frame" />
          <text x="36" y="13" className="atlas-label">
            {d.name[lang]}
          </text>
          <text x="36" y="29" className="atlas-sub">
            {d.code}
            {d.vacant ? t.vacant : ""}
          </text>
        </g>
      ))}
      {L.plc.map((p) => (
        <g key={p.key} className={`atlas-p atlas-p--${p.kind}${touchedBy("p:" + p.key)}`} transform={`translate(${p.x} ${p.y})`}>
          <path d="M0-6l6 6-6 6-6-6Z" />
          <text x="12" y="5" className="atlas-place">
            {p.name}
          </text>
          <text x="12" y="21" className="atlas-sub">
            {p.sub}
          </text>
        </g>
      ))}
      {L.spk.map((s) => (
        <g
          key={s.id}
          className={`atlas-s${state(s.id)}`}
          transform={`translate(${s.x} ${s.y})`}
          onMouseEnter={() => setHl(s.id)}
          onMouseLeave={() => setHl(null)}
          onClick={() => setPinned((p) => (p === s.id ? null : s.id))}
        >
          <circle r="9" className="knot-halo" />
          <circle r="4.5" className="knot" />
          <text y="-16" textAnchor="middle" className="atlas-name">
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  );

  return (
    <div className="atlas">
      <figure className="atlas-fig">
        {plate(wide, "wide")}
        {plate(narrow, "narrow")}
        {vacant.length > 0 && (
          <p className="atlas-vacant">
            <span className="mono">{t.vacantHead}</span> {vacant.map((d) => d.name[lang]).join(t.sep)}
          </p>
        )}
        {caption && <figcaption className="fig-cap fig-cap--light">{caption}</figcaption>}
      </figure>

      <ul className="atlas-key" aria-label={t.key}>
        {speakers.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              aria-pressed={pinned === s.id}
              onMouseEnter={() => setHl(s.id)}
              onMouseLeave={() => setHl(null)}
              onFocus={() => setHl(s.id)}
              onBlur={() => setHl(null)}
              onClick={() => setPinned((p) => (p === s.id ? null : s.id))}
            >
              {s.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- tiny static headshot
                <img className="atlas-avatar" src={s.photo} alt="" loading="lazy" />
              ) : (
                <span className="atlas-avatar atlas-avatar--initial" aria-hidden="true">
                  {s.initial ?? s.name.slice(0, 1)}
                </span>
              )}
              <b>{s.name}</b>
              <span>
                {s.disciplines.map((k) => disciplines.find((d) => d.key === k)?.name[lang]).join(t.sep)}
                <span aria-hidden="true"> · </span>
                <i>{s.places.map((p) => p.name).join(" ⇄ ")}</i>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
