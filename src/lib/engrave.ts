// ─── Engraving utilities ─────────────────────────────────────────────────────
// Deterministic (seeded) generators for the engraved SVG art. Same input → same
// output on server and client, so nothing mismatches during hydration.

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFrom(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const r2 = (n: number) => Math.round(n * 100) / 100;

const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];
export function roman(n: number) {
  let out = "";
  for (const [v, s] of ROMAN) while (n >= v) { out += s; n -= v; }
  return out;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** Engraved horizontal water lines between y0 and y1, denser with depth. */
export function waterLines(x0: number, x1: number, y0: number, y1: number, startStep = 7, endStep = 3.6) {
  const lines: { d: string; w: number; o: number }[] = [];
  let y = y0;
  while (y < y1) {
    const depth = (y - y0) / (y1 - y0);
    let d = `M${x0} ${r2(y)}`;
    for (let x = x0 + 14; x <= x1; x += 14) d += ` L${x} ${r2(y + Math.sin(x * 0.045 + y * 0.7) * 0.9)}`;
    lines.push({ d, w: r2(0.4 + depth * 0.25), o: r2(0.28 + depth * 0.34) });
    y += startStep - depth * (startStep - endStep);
  }
  return lines;
}

/** Stipple dots for mud / sand. */
export function stipple(seed: number, n: number, x0: number, x1: number, y0: number, depth: number) {
  const rnd = mulberry32(seed);
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < n; i++) {
    dots.push({
      x: r2(x0 + rnd() * (x1 - x0)),
      y: r2(y0 + Math.pow(rnd(), 1.6) * depth),
      r: r2(0.35 + rnd() * 0.5),
      o: r2(0.4 + rnd() * 0.5),
    });
  }
  return dots;
}

/** Leaf placements in clusters around branch tips. */
export function leafClusters(seed: number, tips: [number, number, number][]) {
  const rnd = mulberry32(seed);
  const leaves: { x: number; y: number; a: number; s: number; delay: number; dur: number }[] = [];
  for (const [x, y, a] of tips) {
    const n = 4 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      leaves.push({
        x: r2(x + (rnd() - 0.5) * 6),
        y: r2(y + (rnd() - 0.5) * 6),
        a: r2(a + (i - (n - 1) / 2) * 30 + (rnd() - 0.5) * 14),
        s: r2(0.62 + rnd() * 0.38),
        delay: r2(-rnd() * 7),
        dur: r2(6 + rnd() * 4),
      });
    }
  }
  return leaves;
}

/** An ecotone edge band across a 1440×H viewBox: two grounds interpenetrating. */
export function edgeBand(seed: number, mode: "lace" | "fingers", H = 120) {
  const rnd = mulberry32(seed);
  const W = 1440;
  if (mode === "fingers") {
    // tongues of the lower ground reaching up into the upper one
    let d = `M0 ${H} L0 ${H * 0.66}`;
    let x = 0;
    while (x < W) {
      const w = 44 + rnd() * 60;
      const up = H * (0.34 + rnd() * 0.24);
      const base = H * (0.64 + rnd() * 0.08);
      d += ` C${r2(x + w * 0.2)} ${r2(base)} ${r2(x + w * 0.3)} ${r2(up)} ${r2(x + w * 0.5)} ${r2(up)}`;
      d += ` C${r2(x + w * 0.7)} ${r2(up)} ${r2(x + w * 0.8)} ${r2(base)} ${r2(x + w)} ${r2(base)}`;
      x += w;
    }
    d += ` L${W} ${H} Z`;
    return { fill: d, lines: [] as string[] };
  }
  // lace: swash scallops with backwash lines
  const y = H * 0.45;
  let d = `M0 ${H} L0 ${r2(y)}`;
  let x = 0;
  const lines: string[] = [];
  while (x < W) {
    const w = 60 + rnd() * 90;
    const dip = 8 + rnd() * 18;
    d += ` Q${r2(x + w / 2)} ${r2(y + dip)} ${r2(x + w)} ${r2(y + (rnd() - 0.5) * 6)}`;
    x += w;
  }
  d += ` L${W} ${H} Z`;
  for (let k = 1; k <= 3; k++) {
    let l = `M0 ${r2(y - k * 9)}`;
    let xx = 0;
    while (xx < W) {
      const w = 80 + rnd() * 120;
      l += ` Q${r2(xx + w / 2)} ${r2(y - k * 9 + 6 + rnd() * 6)} ${r2(xx + w)} ${r2(y - k * 9)}`;
      xx += w;
    }
    lines.push(l);
  }
  return { fill: d, lines };
}

/** Concentric irregular rings for a volume emblem, seeded from its slug. */
export function emblemRings(slug: string, n = 9) {
  const rnd = mulberry32(seedFrom(slug));
  const rings: string[] = [];
  const cx = 60;
  const cy = 60;
  for (let i = 0; i < n; i++) {
    const R = 6 + i * (48 / n) + rnd() * 2;
    const ox = (rnd() - 0.5) * 1.6 * (n - i) * 0.25;
    const oy = (rnd() - 0.5) * 1.6 * (n - i) * 0.25;
    let d = "";
    const steps = 48;
    const ph = rnd() * Math.PI * 2;
    const amp = 0.6 + rnd() * 1.2;
    for (let k = 0; k <= steps; k++) {
      const t = (k / steps) * Math.PI * 2;
      const rr = R + Math.sin(t * 3 + ph) * amp * (R / 50);
      d += `${k ? "L" : "M"}${r2(cx + ox + rr * Math.cos(t))} ${r2(cy + oy + rr * Math.sin(t))}`;
    }
    rings.push(d + "Z");
  }
  const crack = r2(rnd() * 360);
  return { rings, crack };
}

// ── Geography ────────────────────────────────────────────────────────────────
const D2R = Math.PI / 180;

/** Great-circle interpolation (slerp) between two lat/lng points. */
export function greatCircle(a: [number, number], b: [number, number], n = 48): [number, number][] {
  const toV = ([lat, lng]: [number, number]) => [
    Math.cos(lat * D2R) * Math.cos(lng * D2R),
    Math.cos(lat * D2R) * Math.sin(lng * D2R),
    Math.sin(lat * D2R),
  ];
  const A = toV(a);
  const B = toV(b);
  const dot = Math.min(1, Math.max(-1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]));
  const w = Math.acos(dot);
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const s1 = w === 0 ? 1 - t : Math.sin((1 - t) * w) / Math.sin(w);
    const s2 = w === 0 ? t : Math.sin(t * w) / Math.sin(w);
    const v = [s1 * A[0] + s2 * B[0], s1 * A[1] + s2 * B[1], s1 * A[2] + s2 * B[2]];
    pts.push([Math.atan2(v[2], Math.hypot(v[0], v[1])) / D2R, Math.atan2(v[1], v[0]) / D2R]);
  }
  return pts;
}

/**
 * Equirectangular projection centred on the Pacific (lng0 = 150°E), so Taipei
 * sits left of centre and the Americas wrap to the right.
 */
export function project(lat: number, lng: number, W: number, H: number, lng0 = 150) {
  let x = lng - lng0;
  while (x < -180) x += 360;
  while (x > 180) x -= 360;
  return [r2(((x + 180) / 360) * W), r2(((90 - lat) / 180) * H)] as [number, number];
}

/** Projected polyline for a great-circle arc; splits where it wraps the antimeridian of the projection. */
export function arcPath(a: [number, number], b: [number, number], W: number, H: number) {
  const pts = greatCircle(a, b).map(([la, ln]) => project(la, ln, W, H));
  let d = "";
  let prev: [number, number] | null = null;
  for (const p of pts) {
    if (!prev || Math.abs(p[0] - prev[0]) > W / 2) d += `M${p[0]} ${p[1]}`;
    else d += ` L${p[0]} ${p[1]}`;
    prev = p;
  }
  return d;
}

/** Format a coordinate like 25°01′N 121°32′E. */
export function fmtCoord(lat: number, lng: number) {
  const f = (v: number, pos: string, neg: string) => {
    const a = Math.abs(v);
    const deg = Math.floor(a);
    const min = Math.round((a - deg) * 60);
    return `${deg}°${String(min).padStart(2, "0")}′${v >= 0 ? pos : neg}`;
  };
  return `${f(lat, "N", "S")} ${f(lng, "E", "W")}`;
}

// ── Fungi ────────────────────────────────────────────────────────────────────

/** A hypha: a seeded random walk from (x, y), heading roughly `angle` (deg, 90 = down). */
export function hypha(rnd: () => number, x: number, y: number, angle: number, steps: number, step = 6, bounds?: { x0: number; x1: number; y0: number; y1: number }) {
  let a = (angle * Math.PI) / 180;
  let d = `M${r2(x)} ${r2(y)}`;
  for (let i = 0; i < steps; i++) {
    a += (rnd() - 0.5) * 0.7;
    x += Math.cos(a) * step;
    y += Math.sin(a) * step;
    if (bounds) {
      if (y < bounds.y0) { y = bounds.y0; a = Math.abs(a); }
      if (y > bounds.y1 || x < bounds.x0 || x > bounds.x1) break;
    }
    d += ` L${r2(x)} ${r2(y)}`;
  }
  return d;
}

/** A wandering hypha that links two points (anastomosis), sagging below the soil. */
export function hyphaLink(rnd: () => number, x1: number, y1: number, x2: number, y2: number, sag = 30) {
  const n = 10;
  let d = `M${r2(x1)} ${r2(y1)}`;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const x = x1 + (x2 - x1) * t + (i < n ? (rnd() - 0.5) * 10 : 0);
    const y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * sag + (i < n ? (rnd() - 0.5) * 8 : 0);
    d += ` L${r2(x)} ${r2(y)}`;
  }
  return d;
}

