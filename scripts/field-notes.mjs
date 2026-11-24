// Field notes (活動現場紀錄) photo pipeline.
//
//   node scripts/field-notes.mjs <source-folder>
//
// For every entry in SHOTS:
//   1. repaint any `erase` boxes on the original as clean whiteboard (e.g. the second half of a
//      WiFi password); dark pixels inside a box (hair, frames) are kept,
//   2. apply a gentle tone correction (`tone`: brightness, contrast, warmth). Never desaturate:
//      people in these photos stay in full colour (AI-README 4.4),
//   3. write the designed crop used in the page grid: public/field/<dir>/<id>-<w>.webp
// Widths come from WIDTHS and never upscale. src/components/FieldNotes.tsx uses the same rule
// (fieldWidths) to build srcset, so keep the two in sync.
//
// Sources stay outside the repo; only the WebP output is committed.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const WIDTHS = [480, 800, 1200, 1600, 2000];
const DIR = "vol01";

/**
 * crop: [left, top, width, height] in source pixels.
 * erase: [x, y, w, h] boxes, same units: repainted as clean board (dark pixels inside are kept).
 * Vol. 01: the last five digits of the classroom WiFi password are erased; the network name stays.
 */
const SHOTS = [
  { id: "opening", src: "10.jpg", crop: [0, 0, 2000, 1333], erase: [[84, 569, 58, 24]], tone: { b: 1.04, c: 1.06 } },
  { id: "talk1", src: "2.jpg", crop: [420, 180, 800, 1067], erase: [], tone: { b: 1.12, c: 1.08 } },
  { id: "talk2", src: "8.jpg", crop: [400, 200, 840, 1120], erase: [[461, 773, 50, 24]], tone: { b: 1.08, c: 1.06 } },
  { id: "talk3", src: "7.jpg", crop: [0, 120, 2000, 1333], erase: [], tone: { b: 1.03, c: 1.05 } },
  { id: "talk3-sea", src: "9.jpg", crop: [0, 0, 2000, 1333], erase: [[1148, 617, 50, 25]], tone: { b: 1.06, c: 1.06 } },
  { id: "talk4", src: "5.jpg", crop: [200, 300, 900, 1200], erase: [[618, 666, 46, 18]], tone: { b: 1.03, c: 1.05 } },
  { id: "seats", src: "1.jpg", crop: [0, 380, 2000, 857], erase: [], tone: { b: 1.03, c: 1.05 } },
  { id: "after", src: "3.jpg", crop: [0, 100, 1800, 1200], erase: [], tone: { b: 1.03, c: 1.05 } },
  { id: "mingle", src: "4.jpg", crop: [800, 266, 800, 1067], erase: [], tone: { b: 1.12, c: 1.06 } },
  { id: "together", src: "6.jpg", crop: [0, 0, 2000, 1157], erase: [[418, 574, 32, 18]], tone: { b: 1.03, c: 1.05 } },
];

const srcDir = process.argv[2];
if (!srcDir) {
  console.error("usage: node scripts/field-notes.mjs <source-folder>");
  process.exit(1);
}
const out = join("public", "field", DIR);
mkdirSync(out, { recursive: true });

/**
 * Repaint each box as clean board (in place, RGB raw). The board colour is a plane
 * (a + b·x + c·y per channel) fitted to a ring of pixels around the box, keeping only
 * board-like ones (between the 30th and 70th luminance percentile: no ink, no glare).
 * Pixels much darker than the board (hair, frames, pillars) are left alone; a faint grain and a
 * three-pixel feather keep the patch from reading as a flat rectangle.
 */
function erase(px, W, H, boxes) {
  const lumAt = (i) => 0.3 * px[i] + 0.59 * px[i + 1] + 0.11 * px[i + 2];
  for (const [x0, y0, w, h] of boxes) {
    const R = 6;
    const ring = [];
    for (let y = y0 - R; y < y0 + h + R; y++)
      for (let x = x0 - R; x < x0 + w + R; x++) {
        if (x < 0 || y < 0 || x >= W || y >= H) continue;
        if (x >= x0 && x < x0 + w && y >= y0 && y < y0 + h) continue;
        const i = (y * W + x) * 3;
        ring.push({ x: x - x0, y: y - y0, i, l: lumAt(i) });
      }
    const ls = ring.map((p) => p.l).sort((p, q) => p - q);
    const lo = ls[Math.floor(ls.length * 0.3)];
    const hi = ls[Math.floor(ls.length * 0.7)];
    const pts = ring.filter((p) => p.l >= lo && p.l <= hi);
    // least squares for v = a + b·x + c·y
    const fit = (k) => {
      let n = 0, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, sv = 0, sxv = 0, syv = 0;
      for (const p of pts) {
        const v = px[p.i + k];
        n++; sx += p.x; sy += p.y; sxx += p.x * p.x; syy += p.y * p.y; sxy += p.x * p.y; sv += v; sxv += p.x * v; syv += p.y * v;
      }
      const M = [[n, sx, sy], [sx, sxx, sxy], [sy, sxy, syy]];
      const V = [sv, sxv, syv];
      const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
      const D = det(M);
      if (Math.abs(D) < 1e-6) return [sv / n, 0, 0];
      return [0, 1, 2].map((c) => det(M.map((row, r) => row.map((e, j) => (j === c ? V[r] : e)))) / D);
    };
    const planes = [0, 1, 2].map(fit);
    let seed = x0 * 7919 + y0;
    const grain = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff - 0.5) * 4;
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        const idx = ((y0 + j) * W + x0 + i) * 3;
        const edge = Math.min(i, j, w - 1 - i, h - 1 - j);
        const a = edge >= 3 ? 1 : (edge + 1) / 4;
        const bgL = [0, 1, 2].reduce((s, k) => s + [0.3, 0.59, 0.11][k] * (planes[k][0] + planes[k][1] * i + planes[k][2] * j), 0);
        if (lumAt(idx) < bgL * 0.45) continue; // much darker than the board: hair, frames, pillars
        const n = grain();
        for (let k = 0; k < 3; k++) {
          const [pa, pb, pc] = planes[k];
          const bgv = pa + pb * i + pc * j + n;
          px[idx + k] = Math.max(0, Math.min(255, Math.round(px[idx + k] * (1 - a) + bgv * a)));
        }
      }
  }
}

async function prepared(shot) {
  const { data, info } = await sharp(join(srcDir, shot.src)).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  erase(data, info.width, info.height, shot.erase);
  const { b = 1, c = 1, warm = 0.015 } = shot.tone;
  const buf = await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } })
    .modulate({ brightness: b })
    .linear(c, 128 * (1 - c))
    // a touch of warmth against the fluorescent classroom light (channel gains, not a filter)
    .recomb([
      [1 + warm, 0, 0],
      [0, 1, 0],
      [0, 0, 1 - warm],
    ])
    .png()
    .toBuffer();
  return { img: sharp(buf), W: info.width, H: info.height };
}

for (const shot of SHOTS) {
  const { img, W, H } = await prepared(shot);
  const [l, t, w, h] = shot.crop;
  const cropped = await img.clone().extract({ left: l, top: t, width: w, height: h }).toBuffer();
  for (const width of WIDTHS.filter((x) => x <= w)) {
    await sharp(cropped).resize({ width }).webp({ quality: 78 }).toFile(join(out, `${shot.id}-${width}.webp`));
  }
  console.log(`${shot.id}: crop ${w}×${h} of ${W}×${H}`);
}
