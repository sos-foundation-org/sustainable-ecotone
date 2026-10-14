// ─── Mycelium & flora generators ─────────────────────────────────────────────
// Seeded, deterministic geometry for the "above & below" home hero, the fungus
// symbols and the Voices sea. Pure functions: no DOM, safe on server or client.

import { mulberry32, r2 } from "./engrave";

export type Pt = [number, number];
export type Rng = () => number;

export const rng = (seed: number): Rng => mulberry32(seed);

const f = (n: number) => r2(n).toString();

// ── fruiting bodies ──────────────────────────────────────────────────────────

export type MushroomKind = "bell" | "parasol" | "bolete";

/**
 * A refined line-drawn mushroom standing on (x, by): a slender stem of height h
 * and a cap of width cw. Returns the three path strings (stem, cap, gill
 * detail), the cap apex and the cap centre x.
 */
export function mushroom(x: number, by: number, h: number, cw: number, kind: MushroomKind, lean = 0) {
  const cx = x + lean;
  const cy = by - h;
  const stout = kind === "bolete";
  const sw0 = stout ? cw * 0.17 : cw * 0.075;
  const sw1 = stout ? cw * 0.13 : cw * 0.05;
  let ch: number;
  let cap: string;
  let gill = "";
  if (kind === "bell") {
    ch = cw * 0.8;
    cap = `M${f(cx - cw / 2)} ${f(cy + 2)}C${f(cx - cw / 2)} ${f(cy - ch * 0.55)} ${f(cx - cw * 0.16)} ${f(cy - ch)} ${f(cx)} ${f(cy - ch)}C${f(cx + cw * 0.16)} ${f(cy - ch)} ${f(cx + cw / 2)} ${f(cy - ch * 0.55)} ${f(cx + cw / 2)} ${f(cy + 2)}Q${f(cx)} ${f(cy - cw * 0.1)} ${f(cx - cw / 2)} ${f(cy + 2)}Z`;
    for (let i = -2; i <= 2; i++) gill += `M${f(cx + i * cw * 0.03)} ${f(cy - ch * 0.84)}Q${f(cx + i * cw * 0.12)} ${f(cy - ch * 0.4)} ${f(cx + i * cw * 0.19)} ${f(cy - 1)}`;
  } else if (kind === "parasol") {
    ch = cw * 0.3;
    cap = `M${f(cx - cw / 2)} ${f(cy)}C${f(cx - cw * 0.46)} ${f(cy - ch * 0.6)} ${f(cx - cw * 0.22)} ${f(cy - ch)} ${f(cx)} ${f(cy - ch)}C${f(cx + cw * 0.22)} ${f(cy - ch)} ${f(cx + cw * 0.46)} ${f(cy - ch * 0.6)} ${f(cx + cw / 2)} ${f(cy)}Z`;
    for (let i = 1; i < 12; i++) {
      const gx = cx - cw / 2 + (cw * i) / 12;
      gill += `M${f(gx)} ${f(cy)}L${f(cx + (gx - cx) * 0.35)} ${f(cy + 2.6)}`;
    }
    gill += `M${f(cx - sw1 * 2.4)} ${f(cy + h * 0.24)}Q${f(cx)} ${f(cy + h * 0.24 + 4)} ${f(cx + sw1 * 2.4)} ${f(cy + h * 0.24)}`;
    for (let i = 0; i < 7; i++) {
      const t = (i + 0.5) / 7;
      const sx = cx - cw * 0.36 + cw * 0.72 * t;
      const sy = cy - ch * (0.35 + 0.5 * Math.sin(Math.PI * t));
      gill += `M${f(sx - 1.6)} ${f(sy - 1)}L${f(sx)} ${f(sy + 0.6)}L${f(sx + 1.6)} ${f(sy - 1)}`;
    }
  } else {
    ch = cw * 0.52;
    cap = `M${f(cx - cw / 2)} ${f(cy + 1)}C${f(cx - cw / 2)} ${f(cy - ch * 0.95)} ${f(cx - cw * 0.24)} ${f(cy - ch)} ${f(cx)} ${f(cy - ch)}C${f(cx + cw * 0.24)} ${f(cy - ch)} ${f(cx + cw / 2)} ${f(cy - ch * 0.95)} ${f(cx + cw / 2)} ${f(cy + 1)}Z`;
    gill += `M${f(cx - cw * 0.46)} ${f(cy + 1)}Q${f(cx)} ${f(cy + 4)} ${f(cx + cw * 0.46)} ${f(cy + 1)}`;
    for (let i = 0; i < 5; i++) gill += `M${f(cx - sw0 * 0.6 + i * sw0 * 0.3)} ${f(cy + h * 0.2)}l${f(sw0 * 0.15)} ${f(h * 0.5)}`;
  }
  const stem = `M${f(x - sw0)} ${f(by)}Q${f(x + lean * 0.35 - sw0 * 0.9)} ${f(by - h * 0.55)} ${f(cx - sw1)} ${f(cy)}L${f(cx + sw1)} ${f(cy)}Q${f(x + lean * 0.35 + sw0 * 0.9)} ${f(by - h * 0.55)} ${f(x + sw0)} ${f(by)}Z`;
  return { stem, cap, gill, top: cy - ch, cx };
}

/** A tuft of grass blades on the soil line. */
export function grass(x: number, by: number, R: Rng, n = 5) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const dx = (R() - 0.5) * 14;
    const h = 6 + R() * 12;
    const bend = (R() - 0.5) * 8;
    d += `M${f(x + dx)} ${f(by)}q${f(bend * 0.3)} ${f(-h * 0.6)} ${f(bend)} ${f(-h)}`;
  }
  return d;
}

export type Branch = { d: string; w: number; delay: number; depth: number };
export type Leaf = { x: number; y: number; a: number; s: number; delay: number };

/** A recursive line tree growing up from (tx, by). Returns branches, leaves and the crown's top y. */
export function tree(tx: number, by: number, H: number, seed: number, depthMax: number, t0 = 0) {
  const R = rng(seed);
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  let top = by;
  const grow = (x: number, y: number, len: number, ang: number, d: number) => {
    const ex = x + Math.cos(ang) * len;
    const ey = y + Math.sin(ang) * len;
    if (ey < top) top = ey;
    const k = (R() - 0.5) * 0.28;
    const mx = (x + ex) / 2 + Math.cos(ang + Math.PI / 2) * len * k;
    const my = (y + ey) / 2 + Math.sin(ang + Math.PI / 2) * len * k;
    branches.push({
      d: `M${f(x)} ${f(y)}Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`,
      w: r2(Math.max(0.45, (depthMax - d + 1) * 0.38)),
      delay: r2(t0 + d * 0.17 + R() * 0.08),
      depth: d,
    });
    if (d >= depthMax) {
      if (R() < 0.75) leaves.push({ x: r2(ex), y: r2(ey), a: Math.round(((ang + (R() - 0.5) * 1.4) * 180) / Math.PI), s: r2(3 + R() * 3.5), delay: r2(t0 + d * 0.17 + 0.35) });
      return;
    }
    const n = R() < 0.2 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const sp = 0.3 + R() * 0.32;
      const a = ang + (n === 2 ? (i ? 1 : -1) * sp : (i - 1) * sp * 1.05) + (R() - 0.5) * 0.14;
      grow(ex, ey, len * (0.7 + R() * 0.1), a + (-Math.PI / 2 - a) * 0.08, d + 1);
    }
  };
  grow(tx, by, H * 0.3, -Math.PI / 2 + (R() - 0.5) * 0.06, 0);
  return { branches, leaves, top };
}

// ── hyphae ───────────────────────────────────────────────────────────────────

/** A hypha that steers from A to B with a seeded wander; returns its points. */
export function hyphaPath(ax: number, ay: number, bx: number, by: number, R: Rng, step = 6): Pt[] {
  const pts: Pt[] = [[ax, ay]];
  let x = ax;
  let y = ay;
  let ang = Math.atan2(by - ay, bx - ax) + (R() - 0.5) * 1.2;
  let wander = 0;
  for (let i = 0; i < 600; i++) {
    const dist = Math.hypot(bx - x, by - y);
    if (dist < step * 1.6) break;
    const target = Math.atan2(by - y, bx - x);
    wander = wander * 0.86 + (R() - 0.5) * 0.55;
    let d = target - ang;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    ang += d * (0.12 + 0.7 * Math.max(0, 1 - dist / 90)) + wander * 0.22;
    x += Math.cos(ang) * step;
    y += Math.sin(ang) * step;
    pts.push([x, y]);
  }
  pts.push([bx, by]);
  return pts;
}

/** A free-wandering hypha of roughly `len` px. */
export function walker(x: number, y: number, ang: number, len: number, R: Rng, step = 5): Pt[] {
  const pts: Pt[] = [[x, y]];
  for (let i = 0; i < len / step; i++) {
    ang += (R() - 0.5) * 0.5;
    x += Math.cos(ang) * step;
    y += Math.sin(ang) * step;
    pts.push([x, y]);
  }
  return pts;
}

export const toPath = (pts: Pt[]) => "M" + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join("L");

/** Cumulative arc length of a polyline. */
export function measure(pts: Pt[]) {
  const c = [0];
  for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return c;
}

/** Position and heading at distance s along a measured polyline. */
export function pointAt(pts: Pt[], cum: number[], s: number): [number, number, number] {
  s = Math.max(0, Math.min(cum[cum.length - 1], s));
  let i = 1;
  while (i < cum.length - 1 && cum[i] < s) i++;
  const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
  const a = pts[i - 1];
  const b = pts[i];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[1] - a[1], b[0] - a[0])];
}
