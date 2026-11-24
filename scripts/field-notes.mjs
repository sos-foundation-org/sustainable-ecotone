// Field notes (活動現場紀錄) photo pipeline.
//
//   node scripts/field-notes.mjs <source-folder>
//
// For every entry in SHOTS:
//   1. blur any `redact` boxes on the original (e.g. a WiFi password on a whiteboard),
//   2. apply a gentle tone correction (`tone`: brightness, contrast, warmth). Never desaturate:
//      people in these photos stay in full colour (AI-README 4.4),
//   3. write the designed crop used in the page grid:   public/field/<dir>/<id>-<w>.webp
// Widths come from WIDTHS and never upscale. src/components/FieldNotes.tsx uses the same rule
// (fieldWidths) to build srcset, so keep the two in sync.
//
// Sources stay outside the repo; only the WebP output is committed.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const WIDTHS = [480, 800, 1200, 1600, 2000];
const DIR = "vol01";

/** crop: [left, top, width, height] in source pixels; redact: boxes to blur, same units. */
const SHOTS = [
  { id: "opening", src: "10.jpg", crop: [0, 0, 2000, 1333], redact: [[0, 520, 240, 100]], tone: { b: 1.04, c: 1.06 } },
  { id: "talk1", src: "2.jpg", crop: [420, 180, 800, 1067], redact: [[430, 600, 200, 60]], tone: { b: 1.12, c: 1.08 } },
  { id: "talk2", src: "8.jpg", crop: [400, 200, 840, 1120], redact: [[330, 730, 200, 100]], tone: { b: 1.08, c: 1.06 } },
  { id: "talk3", src: "7.jpg", crop: [0, 120, 2000, 1333], redact: [], tone: { b: 1.03, c: 1.05 } },
  { id: "talk3-sea", src: "9.jpg", crop: [0, 0, 2000, 1333], redact: [[990, 555, 230, 105]], tone: { b: 1.06, c: 1.06 } },
  { id: "talk4", src: "5.jpg", crop: [200, 300, 900, 1200], redact: [[580, 600, 150, 100]], tone: { b: 1.03, c: 1.05 } },
  { id: "seats", src: "1.jpg", crop: [0, 380, 2000, 857], redact: [], tone: { b: 1.03, c: 1.05 } },
  { id: "after", src: "3.jpg", crop: [0, 100, 1800, 1200], redact: [], tone: { b: 1.03, c: 1.05 } },
  { id: "mingle", src: "4.jpg", crop: [800, 266, 800, 1067], redact: [[680, 430, 100, 140]], tone: { b: 1.12, c: 1.06 } },
  { id: "together", src: "6.jpg", crop: [0, 0, 2000, 1157], redact: [[315, 535, 170, 60]], tone: { b: 1.03, c: 1.05 } },
];

const srcDir = process.argv[2];
if (!srcDir) {
  console.error("usage: node scripts/field-notes.mjs <source-folder>");
  process.exit(1);
}
const out = join("public", "field", DIR);
mkdirSync(out, { recursive: true });

async function prepared(shot) {
  const file = join(srcDir, shot.src);
  const base = sharp(file).rotate();
  const composites = [];
  const { width: W, height: H } = await sharp(file).rotate().metadata();
  for (const [x, y, w0, h0] of shot.redact) {
    // blur a padded patch and feather its edge with a soft alpha mask, so no hard box shows
    const pad = 24;
    const left = Math.max(0, x - pad);
    const top = Math.max(0, y - pad);
    const width = Math.min(W - left, w0 + pad * 2);
    const height = Math.min(H - top, h0 + pad * 2);
    const blurred = await sharp(file).rotate().extract({ left, top, width, height }).blur(16).removeAlpha().raw().toBuffer();
    const box = Buffer.alloc(width * height);
    for (let r = y - top; r < y - top + h0; r++) box.fill(255, r * width + (x - left), r * width + (x - left) + w0);
    const mask = await sharp(box, { raw: { width, height, channels: 1 } }).blur(9).extractChannel(0).raw().toBuffer();
    const patch = await sharp(blurred, { raw: { width, height, channels: 3 } }).joinChannel(mask, { raw: { width, height, channels: 1 } }).png().toBuffer();
    composites.push({ input: patch, left, top });
  }
  const { b = 1, c = 1, warm = 0.015 } = shot.tone;
  const buf = await base
    .composite(composites)
    .modulate({ brightness: b })
    .linear(c, 128 * (1 - c))
    // a touch of warmth against the fluorescent classroom light (channel gains, not a filter)
    .recomb([
      [1 + warm, 0, 0],
      [0, 1, 0],
      [0, 0, 1 - warm],
    ])
    .toBuffer();
  return sharp(buf);
}

for (const shot of SHOTS) {
  const img = await prepared(shot);
  const meta = await sharp(await img.clone().toBuffer()).metadata();
  const [l, t, w, h] = shot.crop;
  const cropped = await img.clone().extract({ left: l, top: t, width: w, height: h }).toBuffer();
  for (const width of WIDTHS.filter((x) => x <= w)) {
    await sharp(cropped).resize({ width }).webp({ quality: 78 }).toFile(join(out, `${shot.id}-${width}.webp`));
  }
  console.log(`${shot.id}: crop ${w}×${h} of ${meta.width}×${meta.height}`);
}
