// ─── About figure: "Mycorrhiza" geometry ─────────────────────────────────────
// Two trees above the soil line (a royal palm for NTU, a bamboo clump for NYCU),
// one mycelium below (SOS). Hyphae from both root systems fuse at a node, and a
// coral fungus fruits above it: 兼容並續. Pure and seeded, so server and client
// always agree. Coordinates are in the figure's 480 × 400 viewBox.

import { mulberry32 } from "@/lib/engrave";
import { hyphaPath, walker, type Pt, type Rng } from "@/lib/mycelium";

export const VB = { w: 480, h: 400 };
export const SOIL = 214;
export const NODE: Pt = [240, 312];
const PALM_X = 60;
const BAMBOO_X = 414;

const f = (n: number) => (Math.round(n * 10) / 10).toString();
/** polyline as a compact relative path: M x y l dx dy dx dy … */
const P = (pts: Pt[]) => {
  const r = (n: number) => Math.round(n * 10);
  let x = r(pts[0][0]);
  let y = r(pts[0][1]);
  let d = `M${x / 10} ${y / 10}`;
  if (pts.length > 1) d += "l";
  for (let i = 1; i < pts.length; i++) {
    const nx = r(pts[i][0]);
    const ny = r(pts[i][1]);
    const dx = (nx - x) / 10;
    const dy = (ny - y) / 10;
    d += `${i > 1 && dx >= 0 ? " " : ""}${dx}${dy >= 0 ? " " : ""}${dy}`;
    x = nx;
    y = ny;
  }
  return d;
};
const D2R = Math.PI / 180;
type Box = [number, number, number, number];
const inBox = (x: number, y: number, b: Box, pad = 0) => x > b[0] - pad && x < b[2] + pad && y > b[1] - pad && y < b[3] + pad;

/** Areas the drawing keeps clear for the labels (viewBox units). */
export const LABEL_BOXES: Record<"ntu" | "nycu" | "sos" | "eco", Box> = {
  ntu: [90, 118, 164, 158],
  nycu: [304, 118, 392, 158],
  sos: [204, 60, 276, 100],
  eco: [176, 328, 304, 382],
};
const CLEAR = Object.values(LABEL_BOXES);
const clear = (x: number, y: number, pad = 2) => !CLEAR.some((b) => inBox(x, y, b, pad));

const qpts = (a: Pt, b: Pt, c: Pt, n: number): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]];
  });

function chaikin(pts: Pt[], n = 2): Pt[] {
  for (let k = 0; k < n; k++) {
    const o: Pt[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      o.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    o.push(pts[pts.length - 1]);
    pts = o;
  }
  return pts;
}

/** A tapered limb: filled outline, shade half (to the right of travel) and the two sides. */
function tapered(c: Pt[], w0: number, w1: number) {
  const N = c.length;
  const L: Pt[] = [];
  const R: Pt[] = [];
  c.forEach((p, j) => {
    const a = c[Math.max(0, j - 1)];
    const b = c[Math.min(N - 1, j + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    const w = (w0 + (w1 - w0) * (j / (N - 1))) / 2;
    L.push([p[0] - nx * w, p[1] - ny * w]);
    R.push([p[0] + nx * w, p[1] + ny * w]);
  });
  const rev = (q: Pt[]) => [...q].reverse().map((p) => `${f(p[0])} ${f(p[1])}`).join("L");
  return { fill: `${P(L)}L${rev(R)}Z`, shade: `${P(c)}L${rev(R)}Z`, sides: P(L) + P(R), L, R };
}

// ── NTU: royal palm (椰林大道) ──────────────────────────────────────────────
function palm(bx: number, by: number, H: number, R: Rng) {
  const top: Pt = [bx + 9, by - H];
  const c = qpts([bx, by], [bx - 7, by - H * 0.5], top, 36);
  const t = tapered(c, 9, 5.6);
  let rings = "";
  for (let j = 2; j < c.length - 1; j++) {
    const a = t.L[j];
    const b = t.R[j];
    rings += `M${f(a[0])} ${f(a[1])}Q${f((a[0] + b[0]) / 2)} ${f((a[1] + b[1]) / 2 + 1)} ${f(b[0])} ${f(b[1])}`;
  }
  const shaft = tapered(qpts(top, [top[0] + 0.6, top[1] - 9], [top[0] + 0.8, top[1] - 18], 8), 6.4, 5.2);
  const crown: Pt = [top[0] + 0.8, top[1] - 18];
  let rachis = "";
  let leaflets = "";
  for (const ad of [-172, -150, -128, -108, -88, -70, -50, -30, -8, -160, -18]) {
    const a = ad * D2R;
    const L = 60 + R() * 16;
    const droop = 0.55 + 0.35 * Math.abs(Math.cos(a));
    const p1: Pt = [crown[0] + Math.cos(a) * L * 0.55, crown[1] + Math.sin(a) * L * 0.55 - L * 0.12];
    const p2: Pt = [crown[0] + Math.cos(a) * L * 0.95, crown[1] + Math.sin(a) * L * 0.5 + L * droop * 0.55];
    const q = qpts(crown, p1, p2, 18);
    rachis += P(q);
    for (let j = 3; j < q.length; j++) {
      const u = j / (q.length - 1);
      const dx = q[j][0] - q[j - 1][0];
      const dy = q[j][1] - q[j - 1][1];
      const dl = Math.hypot(dx, dy) || 1;
      const tx = dx / dl;
      const ty = dy / dl;
      const ll = 13 * (1 - u * 0.55);
      for (const s of [-1, 1]) {
        const ex = q[j][0] + (tx * 0.55 - ty * s * 0.8) * ll;
        const ey = q[j][1] + (ty * 0.55 + tx * s * 0.8) * ll + ll * 0.55;
        leaflets += `M${f(q[j][0])} ${f(q[j][1])}Q${f((q[j][0] + ex) / 2 + tx)} ${f((q[j][1] + ey) / 2 - 1.5)} ${f(ex)} ${f(ey)}`;
      }
    }
  }
  // fibrous roots, whose tips the hyphae start from
  let roots = "";
  const tips: Pt[] = [];
  for (let i = 0; i < 24; i++) {
    const a = (90 + (i / 23 - 0.5) * 120 + (R() - 0.5) * 10) * D2R;
    const pts = walker(bx + (R() - 0.5) * 8, by + 1, a, 20 + R() * 34, R, 3);
    roots += P(pts);
    tips.push(pts[pts.length - 1]);
  }
  return { trunk: t, rings, shaft, rachis, leaflets, roots, tips };
}

// ── NYCU: bamboo clump (新竹) ───────────────────────────────────────────────
function bamboo(bx: number, by: number, R: Rng) {
  const culms: { d: string; w: number; shade: string }[] = [];
  let nodes = "";
  let twigs = "";
  const leaves = { paper: "", hatch: "", ribs: "" };
  const leaf = (x: number, y: number, a: number, L: number, wd: number) => {
    if (!clear(x, y, 4)) return;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const pt = (u: number, v: number): Pt => [x + ca * u - sa * v, y + sa * u + ca * v];
    const A = pt(L * 0.4, -wd);
    const B = pt(L, 0);
    const C = pt(L * 0.4, wd);
    const M = pt(L * 0.85, 0);
    const d = `M${f(x)} ${f(y)}Q${f(A[0])} ${f(A[1])} ${f(B[0])} ${f(B[1])}Q${f(C[0])} ${f(C[1])} ${f(x)} ${f(y)}Z`;
    if (R() < 0.35) leaves.hatch += d;
    else {
      leaves.paper += d;
      leaves.ribs += `M${f(x)} ${f(y)}L${f(M[0])} ${f(M[1])}`;
    }
  };
  const N = 6;
  for (let i = 0; i < N; i++) {
    const x0 = bx + (i - (N - 1) / 2) * 5.4;
    const h = 150 + R() * 36 - Math.abs(i - 2.5) * 8;
    const lean = (i - 2.2) * 9 + 6;
    const c = qpts([x0, by], [x0 + lean * 0.2, by - h * 0.55], [x0 + lean * 1.6, by - h], 30);
    const w0 = 3.8 - Math.abs(i - 2.5) * 0.25;
    culms.push({ d: P(c), w: w0, shade: P(c.map((p) => [p[0] + w0 * 0.25, p[1]] as Pt)) });
    for (let j = 3; j < c.length - 1; j += 3) {
      const [x, y] = c[j];
      nodes += `M${f(x - w0 / 2 - 1)} ${f(y)}L${f(x + w0 / 2 + 1)} ${f(y - 0.4)}`;
      if (j > 12) {
        const side = (j / 3 + i) % 2 ? 1 : -1;
        const tl = 8 + R() * 10;
        const ta = (-90 + side * (40 + R() * 25)) * D2R;
        const tx = x + Math.cos(ta) * tl;
        const ty = y + Math.sin(ta) * tl;
        twigs += `M${f(x)} ${f(y)}Q${f(x + Math.cos(ta) * tl * 0.5)} ${f(y + Math.sin(ta) * tl * 0.5 + 2)} ${f(tx)} ${f(ty)}`;
        const n = 3 + Math.floor(R() * 3);
        for (let k = 0; k < n; k++) leaf(tx, ty, (side > 0 ? 20 : 160) * D2R + (k - (n - 1) / 2) * 0.42 + (R() - 0.5) * 0.3 + 0.35, 11 + R() * 5, 1.9);
      }
    }
    const [tx, ty] = c[c.length - 1];
    for (let k = 0; k < 5; k++) leaf(tx, ty, (lean > 0 ? 25 : 155) * D2R + (k - 2) * 0.45, 11 + R() * 4, 1.8);
  }
  // the rhizome, with rootlets whose tips the hyphae start from
  const rz: Pt[] = [];
  for (let x = bx - 46; x <= bx + 40; x += 4) rz.push([x, by + 13 + Math.sin(x * 0.09) * 2.4]);
  let rzNodes = "";
  let rootlets = "";
  const tips: Pt[] = [];
  for (let k = 2; k < rz.length - 1; k += 3) {
    const [x, y] = rz[k];
    rzNodes += `M${f(x)} ${f(y - 3)}v6`;
    for (let s = 0; s < 2; s++) {
      const pts = walker(x, y + 2, (90 + (R() - 0.5) * 70) * D2R, 12 + R() * 16, R, 3);
      rootlets += P(pts);
      tips.push(pts[pts.length - 1]);
    }
  }
  for (let i = 0; i < N; i++) {
    const x0 = bx + (i - (N - 1) / 2) * 5.4;
    rootlets += `M${f(x0)} ${by}L${f(x0 + (R() - 0.5) * 3)} ${by + 12}`;
  }
  return { culms, nodes, twigs, leaves, rhizome: P(rz), rzNodes, rootlets, tips };
}

// ── 兼容並續: coral fungus (Ramaria), outlined branches shaded on one side ──
/** one pass per branching depth: all branches of a depth share a width */
export type CoralSeg = { d: string; shade: string; lit: string; w: number };
function coral(x0: number, y0: number, H: number, seed: number, depthMax = 4) {
  const R = mulberry32(seed);
  const segs: CoralSeg[] = [];
  const tips: [number, number, number][] = [];
  const grow = (x: number, y: number, ang: number, len: number, w: number, d: number) => {
    const pts: Pt[] = [[x, y]];
    let a = ang;
    for (let i = 0; i < 4; i++) {
      a += (R() - 0.5) * 0.12 + (-Math.PI / 2 - a) * 0.045;
      x += (Math.cos(a) * len) / 4;
      y += (Math.sin(a) * len) / 4;
      pts.push([x, y]);
    }
    segs.push({ d: P(pts), shade: P(pts.map((p) => [p[0] + w * 0.24, p[1]] as Pt)), lit: P(pts.map((p) => [p[0] - w * 0.18, p[1]] as Pt)), w });
    if (d >= depthMax) {
      tips.push([x, y, w]);
      return;
    }
    const k = d === 0 ? 3 : 2;
    for (let i = 0; i < k; i++) {
      const sp = k === 3 ? (i - 1) * 0.78 : (i ? 1 : -1) * (0.42 + R() * 0.22);
      grow(x, y, a + sp, len * (0.8 + R() * 0.1), w * 0.68, d + 1);
    }
  };
  grow(x0, y0 + 1, -Math.PI / 2, H * 0.2, H * 0.13, 0);
  const byW = new Map<number, CoralSeg>();
  for (const sg of segs) {
    const g = byW.get(sg.w) ?? { d: "", shade: "", lit: "", w: sg.w };
    g.d += sg.d;
    g.shade += sg.shade;
    g.lit += sg.lit;
    byW.set(sg.w, g);
  }
  let dots = "";
  for (const [x, y, w] of tips) {
    const r = Math.max(0.7, w * 0.32);
    dots += `M${f(x - r)} ${f(y - 0.4)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
  }
  return { segs: [...byW.values()].sort((a, b) => b.w - a.w), dots };
}

function build() {
  const R = mulberry32(5);
  const p = palm(PALM_X, SOIL, 150, R);
  const b = bamboo(BAMBOO_X, SOIL, R);

  // the soil section, cut with ragged edges
  const cut: Pt[] = [[18, SOIL]];
  for (let y = SOIL; y <= 384; y += 6) cut.push([18 + Math.sin(y * 0.3) * 1.5 + (y - SOIL) * 0.02, y]);
  for (let x = 24; x <= 456; x += 6) cut.push([x, 386 + Math.sin(x * 0.21) * 2 + Math.sin(x * 0.07) * 2]);
  for (let y = 384; y >= SOIL; y -= 6) cut.push([462 - Math.sin(y * 0.27) * 1.5 - (y - SOIL) * 0.02, y]);
  const section = P(cut) + "Z";
  let stipple = "";
  for (let i = 0; i < 900; i++) {
    const x = 22 + R() * 436;
    const y = SOIL + 4 + Math.pow(R(), 0.9) * 176;
    if (clear(x, y)) stipple += `M${f(x)} ${f(y)}h.1`;
  }
  let strata = "";
  [252, 300, 346].forEach((y0, k) => {
    let cur: Pt[] = [];
    const flush = () => {
      if (cur.length > 2) strata += P(cur);
      cur = [];
    };
    for (let x = 24; x < 456; x += 4) {
      const y = y0 + Math.sin(x * 0.03 + k) * 4 + Math.sin(x * 0.11);
      if (R() < 0.02 || !clear(x, y, 3)) flush();
      else cur.push([x, y]);
    }
    flush();
  });
  const pebbles: [number, number, number, number][] = [
    [60, 330, 5, 3],
    [136, 362, 4, 2.6],
    [350, 276, 5.4, 3.2],
    [420, 350, 4.4, 2.8],
    [180, 240, 3.4, 2],
    [318, 374, 3.6, 2.2],
  ];

  // hyphae: from each root system to the node; the last stretch, where they fuse, in cinnabar
  let hyphae = "";
  let fused = "";
  let network = "";
  const toNode = (tips: Pt[], n: number, seed: number) => {
    const RR = mulberry32(seed);
    for (let i = 0; i < n; i++) {
      const [x, y] = tips[Math.floor(RR() * tips.length)];
      const pts = hyphaPath(x, y, NODE[0] + (RR() - 0.5) * 10, NODE[1] + (RR() - 0.5) * 8, RR, 4.5);
      const at = pts.findIndex((q) => Math.hypot(q[0] - NODE[0], q[1] - NODE[1]) < 26);
      const k = at < 0 ? pts.length : at + 1;
      hyphae += P(pts.slice(0, k));
      if (at >= 0) fused += P(pts.slice(at));
      for (let s = 2; s < k - 2; s += 7) if (RR() < 0.6) network += P(walker(pts[s][0], pts[s][1], RR() * Math.PI * 2, 10 + RR() * 22, RR, 3));
    }
  };
  toNode(p.tips, 9, 41);
  toNode(b.tips, 9, 43);
  // a few threads run on past the node: a web, not a funnel
  const RN = mulberry32(77);
  for (let i = 0; i < 20; i++) {
    const a = RN() * Math.PI * 2;
    const d = 30 + RN() * 50;
    network += P(walker(NODE[0] + Math.cos(a) * d * 0.5, NODE[1] + Math.sin(a) * d * 0.35, a, 30 + RN() * 70, RN, 3.5));
  }
  for (let i = 0; i < 16; i++) {
    const x = 30 + RN() * 420;
    const y = SOIL + 16 + RN() * 150;
    if (clear(x, y, 4)) network += P(walker(x, y, RN() * Math.PI * 2, 18 + RN() * 40, RN, 3));
  }
  let knot = "";
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    knot += P(
      chaikin([
        [NODE[0] + Math.cos(a) * 3, NODE[1] + Math.sin(a) * 2],
        [NODE[0] + Math.cos(a + 0.6) * 12, NODE[1] + Math.sin(a + 0.6) * 8],
        [NODE[0] + Math.cos(a + 1.3) * 5, NODE[1] + Math.sin(a + 1.3) * 4],
      ]),
    );
  }
  let cord = "";
  for (let s = 0; s < 3; s++) {
    const pts: Pt[] = [];
    for (let y = NODE[1]; y >= SOIL; y -= 3) pts.push([NODE[0] + Math.sin(y * 0.18 + s * 2.1) * (2.2 - s * 0.4), y]);
    cord += P(pts);
  }

  // grass on the soil line, leaving room for the trees, fungus, grasshopper and leader
  let grass = "";
  const RG = mulberry32(19);
  for (let i = 0; i < 34; i++) {
    const x = 22 + RG() * 436;
    const hh = 7 + RG() * 7;
    const n = 3 + Math.floor(RG() * 3);
    if (Math.abs(x - 240) < 30 || Math.abs(x - PALM_X) < 9 || Math.abs(x - BAMBOO_X) < 20 || (x > 114 && x < 196)) continue;
    for (let k = 0; k < n; k++) {
      const dx = (k - (n - 1) / 2) * 1.6 + (RG() - 0.5) * 2;
      const h = hh * (0.6 + RG() * 0.5);
      grass += `M${f(x + dx * 0.4)} ${SOIL}q${f(dx * 0.3)} ${f(-h * 0.6)} ${f(dx)} ${f(-h)}`;
    }
  }

  const fungi = [coral(240, SOIL, 60, 23), coral(222, SOIL, 26, 31, 3), coral(259, SOIL, 22, 37, 3)];
  return { palm: p, bamboo: b, section, stipple, strata, pebbles, hyphae, fused, network, knot, cord, grass, fungi };
}

export const FIG = build();
