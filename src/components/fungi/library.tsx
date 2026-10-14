// ─── Fungi library: drawings ─────────────────────────────────────────────────
// One function per species, in the site's engraved line (the same hand as the
// grasshopper and the frog). Every drawing stands on its base at (0, 0) and
// grows up (y < 0), so it sits on any soil line. Pure geometry: no randomness,
// so server and client always match. Metadata: src/content/fungi.ts.

import type { SVGProps } from "react";
import type { FungusId } from "@/content/fungi";
import { mushroom } from "@/lib/mycelium";

/** body: filled + outlined · cap: as body, and highlightable · line: outline only · fine: hairline detail · dot: solid ink */
export type PartKind = "body" | "cap" | "line" | "fine" | "dot";
export type Part = { d: string; k: PartKind };
export type Drawing = { w: number; h: number; parts: Part[] };

const f = (n: number) => (Math.round(n * 10) / 10).toString();
const circle = (x: number, y: number, r: number) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;

function fromMushroom(h: number, cw: number, kind: "bell" | "parasol" | "bolete"): Drawing {
  const m = mushroom(0, 0, h, cw, kind);
  return { w: cw, h: -m.top, parts: [{ d: m.stem, k: "body" }, { d: m.cap, k: "cap" }, { d: m.gill, k: "fine" }] };
}

const mycena = (): Drawing => fromMushroom(70, 36, "bell");
const macrolepiota = (): Drawing => fromMushroom(84, 62, "parasol");
const boletus = (): Drawing => fromMushroom(64, 66, "bolete");

function amanita(): Drawing {
  const warts = [
    [-20, -79], [-8, -89], [7, -88], [19, -81], [-27, -68], [27, -68], [0, -78], [-13, -70], [13, -71], [-2, -66], [22, -63], [-23, -62],
  ];
  let w = "";
  warts.forEach(([x, y], i) => (w += circle(x, y, 1.6 + (i % 3) * 0.6)));
  let gills = "";
  for (let i = -6; i <= 6; i++) gills += `M${f(i * 4.6)} -59.5L${f(i * 1.5)} -57`;
  return {
    w: 70,
    h: 96,
    parts: [
      { d: "M-11 0C-15-6-13-13-7-15L7-15C13-13 15-6 11 0Z", k: "body" },
      { d: "M-12 -9C-6-7 6-7 12-9", k: "fine" },
      { d: "M-6 -14Q-5-40-5-60L5-60Q5-40 6-14Z", k: "body" },
      { d: "M-5 -49C-10-45-12-41-11-38C-6-40 6-40 11-38C12-41 10-45 5-49Z", k: "body" },
      { d: "M-8 -41.5L-7-39M-3-42L-2.6-39.5M2-42L2.4-39.5M7-41.5L7.6-39", k: "fine" },
      { d: "M-35 -59C-35-80-19-96 0-96C19-96 35-80 35-59Q0-53-35-59Z", k: "cap" },
      { d: gills, k: "fine" },
      { d: w, k: "line" },
    ],
  };
}

function morchella(): Drawing {
  // cap profile: half-width along the cap from its base (-32) to its apex (-100)
  const hw = (y: number) => {
    const t = Math.min(1, Math.max(0, (-y - 32) / 68));
    return 15.5 * (1 - Math.pow(t, 1.8)) * (0.9 + 0.25 * Math.sin(Math.PI * t));
  };
  let ridges = "";
  const us = [-0.72, -0.36, 0, 0.36, 0.72];
  for (const u of us) {
    let d = "";
    for (let y = -33; y >= -96; y -= 3) d += `${d ? "L" : "M"}${f(u * hw(y) + Math.sin(y * 0.3 + u * 5) * 0.8)} ${y}`;
    ridges += d;
  }
  // irregular cross-ridges make the honeycomb pits, staggered row by row
  for (let row = 0; row < 9; row++) {
    const y = -38 - row * 6.6;
    for (let k = 0; k < us.length - 1; k++) {
      if ((row + k) % 2) continue;
      const a = us[k] * hw(y);
      const b = us[k + 1] * hw(y + 2);
      ridges += `M${f(a)} ${f(y)}Q${f((a + b) / 2)} ${f(y - 2.4)} ${f(b)} ${f(y + 2)}`;
    }
    const e0 = -hw(y);
    ridges += `M${f(e0)} ${f(y)}L${f(us[0] * hw(y))} ${f(y - 1.5)}M${f(-e0)} ${f(y)}L${f(us[us.length - 1] * hw(y))} ${f(y - 1.5)}`;
  }
  let outline = "";
  for (let y = -32; y >= -100; y -= 2) outline += `${outline ? "L" : "M"}${f(-hw(y))} ${y}`;
  for (let y = -100; y <= -32; y += 2) outline += `L${f(hw(y))} ${y}`;
  outline += "Q0 -29 " + f(-hw(-32)) + " -32Z";
  return {
    w: 34,
    h: 100,
    parts: [
      { d: "M-10 0C-13-9-11-22-9-34L9-34C11-22 13-9 10 0Z", k: "body" },
      { d: "M-6 -6C-5-16-6-24-5-31M3-4C4-14 3-22 4-31", k: "fine" },
      { d: outline, k: "cap" },
      { d: ridges, k: "line" },
    ],
  };
}

function coprinus(): Drawing {
  // the inky, dissolving rim: a row of small drips
  let rim = "M-12.5 -40";
  for (let i = 0; i < 6; i++) rim += `q2.1 ${f(3 + (i % 3))} 4.2 0`;
  let scales = "";
  for (let row = 0; row < 7; row++) {
    const y = -46 - row * 7.5;
    const half = 12 - Math.pow(row / 7, 2.4) * 10;
    const n = Math.max(1, Math.round(half / 3.2));
    for (let i = 0; i <= n; i++) {
      const x = -half + (2 * half * i) / Math.max(1, n) + (row % 2 ? 1.6 : 0);
      if (Math.abs(x) > half) continue;
      scales += `M${f(x - 1.6)} ${f(y - 2)}Q${f(x)} ${f(y + 1.8)} ${f(x + 1.8)} ${f(y - 1.4)}`;
    }
  }
  return {
    w: 28,
    h: 100,
    parts: [
      { d: "M-4 0Q-3-22-3-42L3-42Q3-22 4 0Z", k: "body" },
      { d: "M-3.6 -21C-1-19.6 1-19.6 3.6-21", k: "fine" },
      { d: "M-12.5 -40C-14.5-62-12.5-86 0-100C12.5-86 14.5-62 12.5-40Z", k: "cap" },
      { d: rim, k: "line" },
      { d: scales, k: "fine" },
    ],
  };
}

function cantharellus(): Drawing {
  let ridges = "";
  for (let i = -5; i <= 5; i++) {
    if (!i) continue;
    const x0 = i * 5.2;
    const y0 = -60 + Math.abs(i) * 0.3;
    const xm = i * 2.4;
    ridges += `M${f(x0)} ${f(y0)}C${f(x0 * 0.8)} ${f(y0 + 6)} ${f(xm)} -46 ${f(i * 0.9)} -34`;
    if (i % 2) ridges += `M${f(x0 * 0.72)} ${f(y0 + 5)}L${f(x0 * 0.9)} ${f(y0 + 1)}`;
  }
  return {
    w: 64,
    h: 71,
    parts: [
      {
        d: "M-31 -63C-26-58-17-55-10-49C-6-40-6-20-8 0L8 0C6-20 6-40 10-49C17-55 26-58 31-63C26-70 17-64 9-68C3-66-4-71-10-66C-18-71-25-66-31-63Z",
        k: "cap",
      },
      { d: "M-24 -64C-12-61 10-61 24-64", k: "fine" },
      { d: ridges, k: "fine" },
    ],
  };
}

function trametes(): Drawing {
  const shelf = (y: number, dir: 1 | -1, len: number, th: number) => {
    const x = 12 * dir;
    const tip = x + len * dir;
    const out = `M${f(x)} ${f(y - th)}C${f(x + len * 0.45 * dir)} ${f(y - th - 3)} ${f(tip)} ${f(y - th * 0.4)} ${f(tip)} ${f(y + 1)}C${f(x + len * 0.7 * dir)} ${f(y + 3)} ${f(x + len * 0.3 * dir)} ${f(y + 2)} ${f(x)} ${f(y + 1.5)}Z`;
    let zones = "";
    for (let k = 1; k <= 3; k++) {
      const l = len * (1 - k * 0.22);
      zones += `M${f(x)} ${f(y - th + k * 1.2)}C${f(x + l * 0.5 * dir)} ${f(y - th - 1 + k * 1.2)} ${f(x + l * dir)} ${f(y - th * 0.3 + k)} ${f(x + l * dir)} ${f(y + 1)}`;
    }
    return [
      { d: out, k: "cap" as const },
      { d: zones, k: "fine" as const },
    ];
  };
  return {
    w: 108,
    h: 66,
    parts: [
      { d: "M-14 0L-12-60C-8-64 8-64 12-60L14 0Z", k: "body" },
      { d: "M-12 -60C-8-56 8-56 12-60", k: "line" },
      { d: "M-7 -6L-6-52M-1-4L0-55M5-8L6-50M9-3L9.6-40", k: "fine" },
      ...shelf(-50, 1, 40, 8),
      ...shelf(-34, 1, 33, 7),
      ...shelf(-19, 1, 26, 6),
      ...shelf(-42, -1, 31, 7),
      ...shelf(-26, -1, 23, 6),
    ],
  };
}

function clathrus(): Drawing {
  const cy = -45;
  const r = 30;
  // the cage: a sphere of thick arms around dark polygonal openings, foreshortened toward the rim
  // hexagonal openings on a hex grid over the visible face, foreshortened toward the rim,
  // so what remains between them reads as the cage's thin arms
  let openings = "";
  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      const hx = col * 13.6 + (row % 2 ? 6.8 : 0) + 1.5;
      const hy = cy + row * 11.8;
      const dist = Math.hypot(hx, hy - cy) / r;
      if (dist > 0.9) continue;
      const sq = Math.sqrt(1 - dist * dist);
      const ux = Math.abs(hx) / r;
      const uy = Math.abs(hy - cy) / r;
      const sx = 0.45 + 0.55 * Math.sqrt(Math.max(0, 1 - ux * ux));
      const sy = 0.45 + 0.55 * Math.sqrt(Math.max(0, 1 - uy * uy));
      const R = 5.9 * (0.75 + 0.25 * sq);
      for (let k = 0; k < 6; k++) {
        const ang = ((k * 60 + 30) * Math.PI) / 180;
        openings += `${k ? "L" : "M"}${f(hx + Math.cos(ang) * R * sx)} ${f(hy + Math.sin(ang) * R * sy)}`;
      }
      openings += "Z";
    }
  }
  return {
    w: 62,
    h: 76,
    parts: [
      { d: "M-13 0C-15-8-10-15 0-15C10-15 15-8 13 0Z", k: "body" },
      { d: "M-9 -9C-4-11 4-11 9-9", k: "fine" },
      { d: circle(0, cy, r), k: "cap" },
      { d: openings, k: "dot" },
    ],
  };
}

function geastrum(): Drawing {
  const rays = [
    "M-6 -17C-20-19-35-12-42 0C-31-5-18-9-6-12Z",
    "M6 -17C20-19 35-12 42 0C31-5 18-9 6-12Z",
    "M-4 -14C-10-9-18-4-24 1C-14-2-7-6-1-10Z",
    "M4 -14C10-9 18-4 24 1C14-2 7-6 1-10Z",
    "M-2 -12C-3-6-4-2-6 2C-1-1 1-1 6 2C4-2 3-6 2-12Z",
  ];
  return {
    w: 86,
    h: 50,
    parts: [
      ...rays.map((d) => ({ d, k: "body" as const })),
      { d: "M-30 -8C-24-11-16-13-8-14M30-8C24-11 16-13 8-14", k: "fine" },
      { d: circle(0, -28, 13.5), k: "cap" },
      { d: "M-3 -41L0-49L3-41", k: "line" },
      { d: "M-8 -36C-5-39-2-40 0-40M-10-24C-6-20 4-19 9-23", k: "fine" },
    ],
  };
}

function cyathus(): Drawing {
  const cup = (x: number, s: number) => {
    const p = (dx: number, dy: number) => `${f(x + dx * s)} ${f(dy * s)}`;
    return [
      { d: `M${p(-6, 0)}L${p(-11, -24)}C${p(-11, -27)} ${p(11, -27)} ${p(11, -24)}L${p(6, 0)}Z`, k: "body" as const },
      { d: `M${p(-11, -24)}C${p(-11, -21)} ${p(11, -21)} ${p(11, -24)}`, k: "line" as const },
      { d: `M${p(-7, -4)}L${p(-9.5, -20)}M${p(-2, -2)}L${p(-3, -21)}M${p(3, -2)}L${p(4, -21)}`, k: "fine" as const },
      { d: circle(x - 3.4 * s, -24.2 * s, 1.7 * s) + circle(x + 0.6 * s, -24.8 * s, 1.7 * s) + circle(x + 4.4 * s, -24.2 * s, 1.6 * s), k: "dot" as const },
    ];
  };
  return { w: 50, h: 30, parts: [...cup(-14, 0.85), ...cup(14, 0.75), ...cup(0, 1.1)] };
}

export const FUNGUS_DRAWINGS: Record<FungusId, () => Drawing> = {
  mycena,
  macrolepiota,
  boletus,
  amanita,
  morchella,
  coprinus,
  cantharellus,
  trametes,
  clathrus,
  geastrum,
  cyathus,
};

const cache = new Map<FungusId, Drawing>();
/** The drawing for a species (computed once). */
export function drawing(id: FungusId): Drawing {
  let d = cache.get(id);
  if (!d) {
    d = FUNGUS_DRAWINGS[id]();
    cache.set(id, d);
  }
  return d;
}

/** Width a species takes up when drawn `height` tall. */
export const fungusWidth = (id: FungusId, height: number) => (drawing(id).w / drawing(id).h) * height;

const STROKE: Record<PartKind, Partial<SVGProps<SVGPathElement>>> = {
  body: { className: "pf", strokeWidth: 1 },
  cap: { className: "pf fungus-cap", strokeWidth: 1 },
  line: { fill: "none", strokeWidth: 1 },
  fine: { fill: "none", strokeWidth: 0.55, opacity: 0.75 },
  dot: { fill: "currentColor", stroke: "none" },
};

/** The parts of a species as SVG paths (no positioning). Strokes keep their weight at any size. */
export function FungusParts({ id }: { id: FungusId }) {
  return (
    <g stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
      {drawing(id).parts.map((p, i) => (
        <path key={i} d={p.d} vectorEffect="non-scaling-stroke" {...STROKE[p.k]} />
      ))}
    </g>
  );
}

/**
 * A fungus standing on (x, y), `height` units tall. Use inside an <svg>.
 * Decorative by default (aria-hidden); give it a role/label where it carries meaning.
 */
export function Fungus({ species, height, x = 0, y = 0, className, ...rest }: { species: FungusId; height: number; x?: number; y?: number; className?: string } & SVGProps<SVGGElement>) {
  const s = height / drawing(species).h;
  return (
    <g aria-hidden="true" className={className} transform={`translate(${f(x)} ${f(y)}) scale(${s.toFixed(4)})`} {...rest}>
      <FungusParts id={species} />
    </g>
  );
}

/** <symbol id="fungus-<id>"> for every species, for <use> (viewBox = the drawing, base at its bottom centre). */
export function FungusSymbols() {
  return (
    <>
      {(Object.keys(FUNGUS_DRAWINGS) as FungusId[]).map((id) => {
        const d = drawing(id);
        return (
          <symbol key={id} id={`fungus-${id}`} viewBox={`${f(-d.w / 2)} ${f(-d.h)} ${f(d.w)} ${f(d.h)}`} overflow="visible">
            <FungusParts id={id} />
          </symbol>
        );
      })}
    </>
  );
}

/** Pick species for a row so that no two neighbours match, deterministically from a seed number. */
export function speciesRow(n: number, seed: number, pool: FungusId[] = Object.keys(FUNGUS_DRAWINGS) as FungusId[]) {
  const out: FungusId[] = [];
  let k = Math.abs(Math.floor(seed)) % pool.length;
  const step = pool.length > 2 ? 3 : 1; // 3 is coprime with the 11-species pool → long cycle before repeats
  for (let i = 0; i < n; i++) {
    let id = pool[k % pool.length];
    if (i > 0 && id === out[i - 1]) id = pool[(k + 1) % pool.length];
    out.push(id);
    k += step;
  }
  return out;
}
