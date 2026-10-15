import { leafClusters, mulberry32, r2, stipple, waterLines } from "@/lib/engrave";
import Loupe from "../Loupe";
import type { Lang } from "@/lib/i18n";

const T = {
  zh: {
    spots: ["埋葬蟲", "趨光的蛾", "野外筆記", "屋頂花園", "環境感測站"],
    title: "圖版：城市公園的交界帶",
    desc: "銅版畫風格插圖：臺北一座城市公園的邊緣。左側是大樓與鋪面，一盞路燈下有幾隻蛾繞著燈飛；長椅上攤著一本野外筆記。鋪面在一條朱紅虛線處結束，右側是榕樹、氣根、野草與池塘。一棟大樓的屋頂長滿植物，草地上立著一座小型環境感測站，泥土上有一隻埋葬蟲。",
    edge: "鋪面的盡頭 · LIMES",
  },
  en: {
    spots: ["burying beetle", "moths at the lamp", "field notebook", "roof garden", "sensor station"],
    title: "Plate: the city park as an ecotone",
    desc: "Engraving-style illustration of the edge of a city park in Taipei. On the left, towers and paving; moths circle a streetlamp and a field notebook lies open on a bench. The paving ends at a dashed cinnabar line; beyond it grow a banyan with hanging aerial roots, wild grass and a pond. One building carries a garden on its roof, a small environmental sensor station stands in the grass, and a burying beetle crosses the soil.",
    edge: "LIMES · where the paving ends",
  },
} satisfies Record<Lang, unknown>;

const INK = "#1C1A17";
const CIN = "#A8321F";
const SEP = "#5E5141";
const PAPER = "#F2ECDF";
const CYAN = "#3B6D96";

/* the edge of the paving, from the horizon to the foot of the plate */
const EDGE = "M262 440C270 480 284 520 296 560C310 610 330 660 348 712";
const PAVE = `M20 440L262 440C270 480 284 520 296 560C310 610 330 660 348 712L20 712Z`;
const edgeX = (y: number) => (y < 560 ? 262 + ((y - 440) / 120) * 34 : 296 + ((y - 560) / 152) * 52);
const POND = { cx: 492, cy: 652, rx: 80, ry: 21 };
const LAMP = { x: 150, y: 328 };

/* Taipei 101 in the distance: podium + eight flared modules + spire */
function tower(cx: number) {
  let d = `M${cx - 16} 440L${cx - 10} 380L${cx + 10} 380L${cx + 16} 440`;
  for (let i = 0; i < 8; i++) {
    const y0 = 380 - i * 24;
    d += `M${cx - 9} ${y0}L${cx - 13} ${y0 - 24}L${cx + 13} ${y0 - 24}L${cx + 9} ${y0}`;
  }
  d += `M${cx - 6} 188L${cx - 5} 172L${cx + 5} 172L${cx + 6} 188M${cx} 172L${cx} 128`;
  return d;
}

/* paving joints: courses widen toward the viewer, joints stagger */
function paving() {
  const rows = [452, 466, 482, 500, 522, 548, 578, 612, 650, 694];
  let d = "";
  let prev = 440;
  rows.forEach((y, i) => {
    d += `M20 ${y}L360 ${y}`;
    const w = 16 + (y - 440) * 0.34;
    for (let x = 20 + (i % 2 ? w / 2 : 0); x < 360; x += w) d += `M${r2(x)} ${prev}L${r2(x)} ${y}`;
    prev = y;
  });
  d += `M20 712L360 712`;
  return d;
}

/* grass tufts on the wild side, denser and taller toward the viewer */
function tufts() {
  const rnd = mulberry32(31);
  const out: string[] = [];
  for (let i = 0; i < 400 && out.length < 120; i++) {
    const y = 446 + Math.pow(rnd(), 0.8) * 262;
    const x = 20 + rnd() * 560;
    if (x < edgeX(y) + 6 || x > 574) continue;
    if (((x - POND.cx) / (POND.rx + 8)) ** 2 + ((y - POND.cy) / (POND.ry + 6)) ** 2 < 1) continue;
    if (x > 410 && x < 492 && y < 572) continue; // trunk
    if (x > 318 && x < 364 && y < 506) continue; // sensor station
    if (x > 344 && x < 414 && y > 672) continue; // beetle
    const h = 4 + ((y - 440) / 270) * 12 * (0.6 + rnd() * 0.6);
    const n = 4 + Math.floor(rnd() * 3);
    let d = "";
    for (let k = 0; k < n; k++) {
      const dx = (k - (n - 1) / 2) * (h * 0.18) + (rnd() - 0.5) * 2;
      const hh = h * (0.7 + rnd() * 0.4);
      d += `M${r2(x)} ${r2(y)}q${r2(dx * 0.3)} ${r2(-hh * 0.6)} ${r2(dx)} ${r2(-hh)}`;
    }
    out.push(d);
  }
  return out.join("");
}

/* banyan canopy: leaf-cluster tips scattered through an ellipse */
function canopyTips() {
  const rnd = mulberry32(17);
  const tips: [number, number, number][] = [];
  for (let i = 0; i < 100; i++) {
    const th = rnd() * Math.PI * 2;
    const rho = Math.sqrt(0.04 + rnd() * 0.96);
    const x = Math.min(548, 450 + Math.cos(th) * 124 * rho);
    const y = 238 + Math.sin(th) * (Math.sin(th) > 0 ? 84 : 112) * rho;
    tips.push([r2(x), r2(y), r2((th * 180) / Math.PI + (rnd() - 0.5) * 60)]);
  }
  return tips;
}

const BRANCHES: [string, number][] = [
  ["M440 400C420 384 396 376 380 350C370 334 356 318 346 302", 2.6],
  ["M444 396C430 360 420 330 404 306C392 288 384 268 378 248", 2.2],
  ["M452 394C456 350 444 310 450 270C454 230 446 200 444 160", 2.4],
  ["M458 396C472 360 492 330 500 296C506 270 520 240 530 214", 2.2],
  ["M464 400C486 388 510 380 524 358C536 340 550 318 560 298", 2.6],
  ["M392 354C376 330 364 300 360 270M410 300C394 270 390 240 396 210M448 250C430 226 420 200 418 178M500 290C520 266 540 250 560 244M480 334C500 320 520 290 528 262", 1.2],
];
/* aerial roots hanging from the branches; the last one has reached the ground */
const AERIAL = [
  "M372 324C374 350 370 380 373 408",
  "M392 316C393 336 390 356 392 372",
  "M522 314C520 340 525 374 522 404",
  "M540 300C541 330 538 360 541 392",
  "M508 330C508 352 506 372 508 388",
];

/* roof garden: shrubs along the parapet, a small tree, and two façade planters */
const ROOF_TIPS: [number, number, number][] = [
  [202, 332, -130], [210, 331, -90], [218, 332, -110], [226, 331, -70], [272, 332, -100], [278, 331, -60],
  [250, 309, -150], [256, 303, -100], [264, 304, -50], [270, 310, -20], [246, 312, 170], [258, 310, -90],
  [210, 365, -120], [220, 365, -60], [250, 395, -120], [262, 395, -60],
];

const MOTHS = [
  { r: 22, dur: 6, delay: -1, rev: false, s: 0.8 },
  { r: 34, dur: 9.5, delay: -4, rev: true, s: 0.95 },
  { r: 47, dur: 13, delay: -9, rev: false, s: 0.7 },
];

/**
 * Event plate "urbanpark" — the edge of a Taipei city park, where the paving
 * ends and a banyan, wild grass and a pond begin. Same contract as
 * MangrovePlate: self-contained, server-rendered, with the hand lens (Loupe)
 * as the only client island. Moths circle the lamp and a leaf drifts down,
 * both in CSS and only when motion is welcome.
 */
export default function UrbanParkPlate({ plateNo = "I", lang = "zh" }: { plateNo?: string; lang?: Lang }) {
  const t = T[lang];
  const water = waterLines(POND.cx - POND.rx, POND.cx + POND.rx, POND.cy - POND.ry + 3, POND.cy + POND.ry, 4.2, 2.8);
  const soil = stipple(5, 260, 300, 580, 676, 36).filter((m) => m.x > edgeX(m.y) + 4 && ((m.x - POND.cx) / POND.rx) ** 2 + ((m.y - POND.cy) / POND.ry) ** 2 > 1.1);
  const leaves = leafClusters(23, canopyTips());
  const roof = leafClusters(41, ROOF_TIPS);
  let k = 0;
  const ink = () => ({ pathLength: 1, style: { animationDelay: `${(k++ % 40) * 0.03}s` } });

  return (
    <figure className="plate-fig plate-fig--portrait">
      <Loupe
        artId="urbanpark-art"
        viewBox="0 0 600 760"
        lang={lang}
        spots={[
          { n: "1", x: 380, y: 690, label: t.spots[0] },
          { n: "2", x: LAMP.x, y: LAMP.y, label: t.spots[1] },
          { n: "3", x: 224, y: 566, label: t.spots[2] },
          { n: "4", x: 238, y: 318, label: t.spots[3] },
          { n: "5", x: 342, y: 452, label: t.spots[4] },
        ]}
      >
        <svg className="art" viewBox="0 0 600 760" role="img" aria-labelledby="urbanpark-title urbanpark-desc">
          <title id="urbanpark-title">{t.title}</title>
          <desc id="urbanpark-desc">{t.desc}</desc>
          <defs>
            <clipPath id="urbanpark-pave">
              <path d={PAVE} />
            </clipPath>
            <clipPath id="urbanpark-pond">
              <ellipse cx={POND.cx} cy={POND.cy} rx={POND.rx} ry={POND.ry} />
            </clipPath>
            <pattern id="urbanpark-win" patternUnits="userSpaceOnUse" x="110" y="278" width="12" height="13">
              <rect x="1" y="1" width="6" height="7.5" fill="none" stroke={INK} strokeWidth=".45" />
            </pattern>
            <pattern id="urbanpark-floor" patternUnits="userSpaceOnUse" y="336" width="10" height="15">
              <line x1="0" y1="0" x2="10" y2="0" stroke={INK} strokeWidth=".55" />
              <line x1="0" y1="6" x2="10" y2="6" stroke={INK} strokeWidth=".3" />
            </pattern>
            {/* a moth seen from above, heading up (-y) */}
            <symbol id="urbanpark-moth" viewBox="-12 -10 24 20" overflow="visible">
              <g stroke={INK} strokeWidth=".55" strokeLinejoin="round" strokeLinecap="round">
                <path className="pf" d="M0 1C-3 2 -7 3 -6 6.5C-3 7 -1 5 0 3ZM0 1C3 2 7 3 6 6.5C3 7 1 5 0 3Z" />
                <path className="pf" d="M0 -3C-4 -6 -10 -6 -11 -1C-8 2 -3 2 0 1ZM0 -3C4 -6 10 -6 11 -1C8 2 3 2 0 1Z" />
                <path d="M-1 -2C-4 -4.4 -8 -4.6 -10 -1.6C-7 .6 -3 .6 -1 0ZM1 -2C4 -4.4 8 -4.6 10 -1.6C7 .6 3 .6 1 0Z" fill="url(#hatch)" stroke="none" />
                <ellipse cx="0" cy=".5" rx="1.1" ry="4.6" fill={INK} />
                <path fill="none" strokeWidth=".4" d="M-.5 -4C-1.5 -6.6 -3 -8.2 -4.6 -8.8M.5 -4C1.5 -6.6 3 -8.2 4.6 -8.8" />
              </g>
            </symbol>
            {/* burying beetle, Nicrophorus, from above, facing right */}
            <symbol id="urbanpark-beetle" viewBox="-34 -18 76 36" overflow="visible">
              <g stroke={INK} strokeWidth=".8" strokeLinejoin="round" strokeLinecap="round">
                <path fill="none" d="M-2 -10L-6 -16L-12 -17M6 -10L8 -17L14 -19M16 -7L22 -14L26 -14M-2 10L-6 16L-12 17M6 10L8 17L14 19M16 7L22 14L26 14" />
                <path className="pf" d="M-14 -8C-22 -8 -28 -4 -29 0C-28 4 -22 8 -14 8Z" />
                <path fill="none" strokeWidth=".5" d="M-18 -8C-19 -3 -19 3 -18 8M-22 -7C-23 -3 -23 3 -22 7M-26 -4.6C-26.6 -2 -26.6 2 -26 4.6" />
                <path className="pf" d="M-14 -10L12 -10C14 -6 14 6 12 10L-14 10Z" />
                <path d="M-12 -9.6L-6 -9.6C-7.4 -7 -4.6 -4.4 -6 -1L-11 -1C-9.6 -4.4 -12.6 -7 -12 -9.6ZM-12 9.6L-6 9.6C-7.4 7 -4.6 4.4 -6 1L-11 1C-9.6 4.4 -12.6 7 -12 9.6ZM2 -9.6L7.4 -9.6C6 -7 9 -4 7.4 -1L2.6 -1C4 -4 1 -7 2 -9.6ZM2 9.6L7.4 9.6C6 7 9 4 7.4 1L2.6 1C4 4 1 7 2 9.6Z" fill={CIN} stroke="none" />
                <path d="M-14 0L12 0" strokeWidth=".6" />
                <path d="M-6 -6C-2 -6.6 4 -6.6 9 -6M-6 6C-2 6.6 4 6.6 9 6" fill="none" strokeWidth=".35" />
                <path d="M-14 -10L12 -10C14 -6 14 6 12 10L-14 10Z" fill="url(#hatch)" opacity=".5" stroke="none" />
                <path className="pf" d="M12 -9C20 -11 26 -7 26 0C26 7 20 11 12 9C13.6 5 13.6 -5 12 -9Z" />
                <path className="pf" d="M26 -4C30 -5 33 -3 33 0C33 3 30 5 26 4Z" />
                <path fill="none" strokeWidth=".55" d="M32 -2.4L37 -6M32 2.4L37 6" />
                <ellipse cx="38.4" cy="-7" rx="2" ry="1.4" fill={CIN} transform="rotate(-35 38.4 -7)" />
                <ellipse cx="38.4" cy="7" rx="2" ry="1.4" fill={CIN} transform="rotate(35 38.4 7)" />
              </g>
            </symbol>
          </defs>
          <g id="urbanpark-art">
            <rect width="600" height="760" fill={PAPER} />
            <rect x="12" y="12" width="576" height="736" fill="none" stroke={INK} strokeWidth="1.6" />
            <rect x="20" y="20" width="560" height="720" fill="none" stroke={INK} strokeWidth=".5" />
            <text x="36" y="48" className="svg-mono" fill={CIN}>
              PL. {plateNo}
            </text>
            <text x="564" y="48" textAnchor="end" className="svg-mono" fill={SEP}>
              ECOTONUS · URBS ET SILVA
            </text>
            <line x1="36" y1="58" x2="564" y2="58" stroke={INK} strokeWidth=".5" />

            <g className="plate-ink" strokeLinecap="round" strokeLinejoin="round">
              {/* the distant tower */}
              <path d={tower(76)} fill="url(#hatchW)" fillOpacity=".35" stroke={SEP} strokeWidth=".7" className="ink" {...ink()} />

              {/* far shrubs along the horizon */}
              <path d="M290 440C292 430 302 426 310 430C314 420 328 420 334 428C340 418 356 420 360 430C366 424 378 426 380 434C386 426 398 428 400 436L580 436L580 440Z" fill="url(#hatchW)" fillOpacity=".5" stroke={SEP} strokeWidth=".6" />
              <path d="M490 436C494 426 506 424 512 430C518 420 534 422 538 430C544 424 558 424 562 432C568 428 576 430 580 432" fill="none" stroke={SEP} strokeWidth=".6" />

              {/* low block, front left */}
              <path d="M20 372L64 372L64 440L20 440Z" fill={PAPER} stroke={INK} strokeWidth="1" className="ink" {...ink()} />
              <path d="M20 372L64 372L64 440L20 440Z" fill="url(#urbanpark-floor)" opacity=".7" />
              {/* glass tower */}
              <path d="M104 270L176 270L176 440L104 440Z" fill={PAPER} />
              <path d="M104 270L176 270L176 440L104 440Z" fill="url(#urbanpark-win)" />
              <path d="M176 270L192 262L192 440L176 440Z" fill="url(#hatch)" />
              <path className="ink" {...ink()} d="M104 440L104 270L176 270L176 440M176 270L192 262L192 440M104 270L120 262L192 262" fill="none" stroke={INK} strokeWidth="1.1" />
              {/* solar array on its roof */}
              <path d="M122 262L132 252L150 252L140 262ZM146 262L156 252L174 252L164 262Z" fill="url(#hatchW)" stroke={INK} strokeWidth=".6" />
              {/* sky-garden block */}
              <path d="M196 334L280 334L280 440L196 440Z" fill={PAPER} />
              <path d="M196 336L280 336L280 440L196 440Z" fill="url(#urbanpark-floor)" />
              <path className="ink" {...ink()} d="M196 440L196 334L280 334L280 440" fill="none" stroke={INK} strokeWidth="1.1" />
              <path d="M196 334L280 334" stroke={INK} strokeWidth="2.2" />
              {/* roof garden: shrubs, a small tree, grasses */}
              <path d="M258 333C258 324 257 316 258 306M258 318C254 314 250 312 246 311M258 314C262 310 266 308 270 308" stroke={INK} strokeWidth=".9" fill="none" />
              <path d="M244 333l-2-7M247 333l1-8M234 333l-1-5M237 333l2-6M241 333l0-7" stroke={INK} strokeWidth=".5" fill="none" />
              {roof.map((l, i) => (
                <use key={i} href="#leaf" transform={`translate(${l.x} ${l.y}) rotate(${l.a}) scale(${r2(l.s * 0.27)})`} />
              ))}
              {/* vine trailing down the façade, and balcony planters */}
              <path d="M278 336C282 350 276 362 280 376C284 390 278 402 281 414" fill="none" stroke={INK} strokeWidth=".6" />
              {[344, 358, 372, 386, 400].map((y, i) => (
                <ellipse key={y} cx={i % 2 ? 283.5 : 276.5} cy={y} rx="3.4" ry="1.6" transform={`rotate(${i % 2 ? 30 : -30} ${i % 2 ? 283.5 : 276.5} ${y})`} fill="url(#hatch)" stroke={INK} strokeWidth=".45" />
              ))}
              <path d="M206 366h22M244 396h24" stroke={INK} strokeWidth="1.2" />

              {/* horizon */}
              <path d="M20 440L580 440" stroke={INK} strokeWidth=".7" />

              {/* paving */}
              <g clipPath="url(#urbanpark-pave)">
                <path d={PAVE} fill={PAPER} />
                <path d={paving()} fill="none" stroke={INK} strokeWidth=".45" opacity=".75" />
              </g>
              {/* heat off the paving */}
              <path d="M52 664c-3-6 3-9 0-15s3-9 0-15M66 658c-3-6 3-9 0-15s3-9 0-15M80 664c-3-6 3-9 0-15s3-9 0-15" fill="none" stroke={CIN} strokeWidth=".5" opacity=".5" />
              {/* leaves the banyan has already let go of */}
              {[
                [118, 628, 160, 0.4],
                [196, 682, 20, 0.36],
                [262, 640, -60, 0.34],
              ].map(([x, y, a, s]) => (
                <use key={x} href="#leaf" transform={`translate(${x} ${y}) rotate(${a}) scale(${s} ${s * 0.6})`} />
              ))}
              {/* cracks where the root has landed, and weeds in the joints */}
              <path d="M298 574l-9 3l-6-2l-9 5l-7 0M296 578l-4 9l-8 4l-3 7M300 580l-2 10" fill="none" stroke={INK} strokeWidth=".6" />
              <path d="M276 610q-2-8-6-12M278 610q1-9 4-13M280 610q3-6 8-8M300 650q-2-8-6-11M302 650q1-9 3-13M304 650q3-6 8-8M262 548q-1-6-4-9M264 548q1-7 3-10" fill="none" stroke={INK} strokeWidth=".6" />

              {/* the wild side */}
              <path d={tufts()} fill="none" stroke={INK} strokeWidth=".45" />
              <g fill={INK}>
                {soil.map((m, i) => (
                  <circle key={i} cx={m.x} cy={m.y} r={m.r} opacity={m.o} />
                ))}
              </g>

              {/* pond */}
              <ellipse cx={POND.cx} cy={POND.cy} rx={POND.rx} ry={POND.ry} fill={PAPER} />
              <g clipPath="url(#urbanpark-pond)" fill="none" stroke={CYAN}>
                {water.map((w, i) => (
                  <path key={i} d={w.d} strokeWidth={w.w} opacity={w.o + 0.15} />
                ))}
              </g>
              <path className="ink" {...ink()} d={`M${POND.cx - POND.rx} ${POND.cy}C${POND.cx - POND.rx} ${POND.cy - 14} ${POND.cx - 40} ${POND.cy - POND.ry} ${POND.cx} ${POND.cy - POND.ry}C${POND.cx + 40} ${POND.cy - POND.ry} ${POND.cx + POND.rx} ${POND.cy - 14} ${POND.cx + POND.rx} ${POND.cy}`} fill="none" stroke={INK} strokeWidth=".9" />
              <path d={`M${POND.cx - POND.rx} ${POND.cy}C${POND.cx - POND.rx} ${POND.cy + 14} ${POND.cx - 40} ${POND.cy + POND.ry} ${POND.cx} ${POND.cy + POND.ry}C${POND.cx + 40} ${POND.cy + POND.ry} ${POND.cx + POND.rx} ${POND.cy + 14} ${POND.cx + POND.rx} ${POND.cy}`} fill="none" stroke={INK} strokeWidth=".5" />
              {/* lily pads */}
              {[
                [452, 648, 9],
                [470, 660, 6.5],
                [520, 644, 7.5],
              ].map(([x, y, r]) => (
                <g key={x} stroke={INK} strokeWidth=".55">
                  <ellipse cx={x} cy={y} rx={r} ry={r * 0.38} fill={PAPER} />
                  <path d={`M${x} ${y}L${x + r * 0.9} ${y - r * 0.16}`} />
                </g>
              ))}
              {/* reeds at the far bank */}
              <g fill="none" stroke={INK} strokeWidth=".7">
                <path d="M548 640C548 620 550 600 552 584M556 642C557 624 560 606 564 594M564 640C566 626 570 614 574 606M540 642C539 628 536 616 532 606" />
                <path d="M553 584C556 572 562 562 570 556M541 612C536 600 530 594 524 592" strokeWidth=".5" />
              </g>
              <rect x="550.4" y="588" width="3.4" height="13" rx="1.7" fill={SEP} stroke={INK} strokeWidth=".5" transform="rotate(6 552 594)" />
              <rect x="562.4" y="596" width="3.2" height="11" rx="1.6" fill={SEP} stroke={INK} strokeWidth=".5" transform="rotate(14 564 601)" />

              {/* banyan: trunk with buttress roots */}
              <path d="M424 562C432 540 434 500 432 460C430 430 428 410 420 392L484 394C474 410 470 430 468 460C466 500 470 540 478 562Z" fill={PAPER} />
              <path d="M452 400C456 440 456 500 460 540C462 552 466 558 470 562L478 562C470 540 466 500 468 460C470 430 474 410 484 394Z" fill="url(#hatch)" />
              <path className="ink" {...ink()} d="M424 562C432 540 434 500 432 460C430 430 428 410 420 392M478 562C470 540 466 500 468 460C470 430 474 410 484 394" fill="none" stroke={INK} strokeWidth="1.5" />
              <path className="ink" {...ink()} d="M424 562C414 564 404 568 394 574M432 554C426 562 422 570 420 578M478 562C490 564 500 568 510 574M470 556C474 564 478 572 480 580M444 560C444 568 442 574 440 580M438 420C440 450 442 480 440 520M446 470C448 500 450 530 452 556" fill="none" stroke={INK} strokeWidth=".7" />
              {/* branches */}
              {BRANCHES.map(([d, w]) => (
                <path key={d} className="ink" {...ink()} d={d} fill="none" stroke={INK} strokeWidth={w} />
              ))}
              {/* aerial roots, and the one prop root that has reached the paving */}
              <g fill="none" stroke={INK} strokeWidth=".55">
                {AERIAL.map((d) => (
                  <path key={d} d={d} />
                ))}
                <path d="M374 318C376 314 378 310 380 306M524 306C524 302 522 298 520 296" />
              </g>
              <path className="ink" {...ink()} d="M346 300C344 360 338 420 330 480C322 530 312 556 300 576" fill="none" stroke={INK} strokeWidth="1.6" />
              <path d="M350 302C348 360 342 420 334 480C326 530 316 556 304 576" fill="none" stroke={INK} strokeWidth=".45" />
              {/* canopy: shade on the crown's underside, then the leaves */}
              <path d="M334 290C330 314 354 332 388 334C418 342 450 340 470 334C500 340 530 330 556 310L560 276C522 298 480 308 440 304C400 304 366 298 334 290Z" fill="url(#hatchW)" opacity=".55" />
              {leaves.map((l, i) => (
                <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.a}) scale(${r2(l.s * 0.46)})`}>
                  {i % 6 === 0 ? (
                    <g className="sway" style={{ animationDelay: `${l.delay}s`, animationDuration: `${l.dur}s` }}>
                      <use href="#leaf" />
                    </g>
                  ) : (
                    <use href="#leaf" />
                  )}
                </g>
              ))}
              <text x="572" y="420" textAnchor="end" className="svg-italic" fill={SEP}>
                Ficus microcarpa
              </text>

              {/* environmental sensor station: louvred screen, solar panel, antenna */}
              <g stroke={INK} fill="none" strokeWidth=".8">
                <path d="M334 470L332 500M350 470L352 500M334 488L350 488" />
                <path d="M330 446L354 446L354 470L330 470Z" fill={PAPER} />
                <path d="M332 450h20M332 454h20M332 458h20M332 462h20M332 466h20" strokeWidth=".4" />
                <path d="M327 446L342 438L357 446Z" fill={PAPER} />
                <path d="M342 438L342 420" />
                <path d="M328 422L346 412L360 418L342 428Z" fill="url(#hatchW)" strokeWidth=".6" />
                <path d="M346 412L346 400" strokeWidth=".5" />
              </g>
              <circle cx="346" cy="398.6" r="1.6" fill={CIN} />
              <path d="M341 394.6a7 7 0 0 1 10 0M338 391.4a11 11 0 0 1 16 0" fill="none" stroke={CIN} strokeWidth=".5" />

              {/* bench, with a field notebook left open on it */}
              <g stroke={INK} fill="none" strokeLinecap="round">
                <path d="M174 538L266 538M174 546L266 546" strokeWidth="1.1" />
                <path d="M174 566L266 566L262 574L170 574Z" fill={PAPER} strokeWidth="1" />
                <path d="M172 570L264 570" strokeWidth=".4" />
                <path d="M180 534L180 566M258 534L258 566" strokeWidth="1.2" />
                <path d="M176 574L174 600M256 574L258 600M188 574L190 596M246 574L244 596" strokeWidth="1.1" />
                <path d="M174 600c-3 0-4-3-2-4M258 600c3 0 4-3 2-4" strokeWidth=".7" />
              </g>
              <path d="M204 570L222 571L224 563L207 562Z" fill={PAPER} stroke={INK} strokeWidth=".6" />
              <path d="M222 571L240 569L240 561L224 563Z" fill={PAPER} stroke={INK} strokeWidth=".6" />
              <path d="M209 564.6l12 .6M208.4 566.4l12 .6M207.8 568.2l9 .4" stroke={INK} strokeWidth=".3" />
              <path d="M228 566.6C231 563 235 563 237 563.6C234 565 231 566 228 566.6ZM228 566.6l-2 1.6" fill="none" stroke={INK} strokeWidth=".4" />
              <path d="M243 573L258 565" stroke={INK} strokeWidth="1.3" />
              <path d="M258 565l2-1" stroke={CIN} strokeWidth="1.3" />

              {/* streetlamp and its light */}
              <circle cx={LAMP.x} cy={LAMP.y} r="44" fill={PAPER} opacity=".55" />
              <circle cx={LAMP.x} cy={LAMP.y} r="30" fill={PAPER} opacity=".9" />
              <g stroke={SEP} strokeWidth=".45" strokeDasharray="1.5 2.5" opacity=".7">
                {Array.from({ length: 16 }, (_, i) => {
                  const a = ((i + 0.5) / 16) * Math.PI * 2;
                  return <path key={i} d={`M${r2(LAMP.x + Math.cos(a) * 24)} ${r2(LAMP.y + Math.sin(a) * 24)}L${r2(LAMP.x + Math.cos(a) * 58)} ${r2(LAMP.y + Math.sin(a) * 58)}`} />;
                })}
              </g>
              <g stroke={INK} strokeLinejoin="round">
                <path d="M138 600L162 600L160 592L140 592Z" fill="url(#hatch)" strokeWidth=".8" />
                <path d="M142 592L144 560L156 560L158 592Z" fill={PAPER} strokeWidth=".8" />
                <path className="ink" {...ink()} d="M147 560L147 350M153 560L153 350" fill="none" strokeWidth="1.1" />
                <path d="M150.4 560L150.4 350L153 350L153 560Z" fill="url(#hatch)" stroke="none" />
                <path d="M144 470L156 470M145 474L155 474M144 352L156 352" strokeWidth=".8" />
                <path d="M143 346L157 346L161 318L139 318Z" fill={PAPER} strokeWidth=".9" />
                <path d="M146 346L144 318M154 346L156 318" strokeWidth=".4" />
                <path d="M136 318L164 318L150 304Z" fill="url(#hatch)" strokeWidth=".9" />
                <path d="M150 304L150 296" strokeWidth=".8" />
              </g>
              <circle cx="150" cy="294.6" r="1.6" fill={INK} />
              <ellipse cx={LAMP.x} cy={LAMP.y + 4} rx="3" ry="5" fill={CIN} opacity=".85" />
              {MOTHS.map((m, i) => (
                <g key={i} transform={`translate(${LAMP.x} ${LAMP.y + 2})`}>
                  <g className="orbit" style={{ animationDuration: `${m.dur}s`, animationDelay: `${m.delay}s`, animationDirection: m.rev ? "reverse" : "normal" }}>
                    <g transform={`rotate(${i * 120}) translate(${m.r} 0) rotate(${m.rev ? 0 : 180}) scale(${m.s})`}>
                      <use href="#urbanpark-moth" x="-12" y="-10" width="24" height="20" />
                    </g>
                  </g>
                </g>
              ))}

              {/* a leaf letting go */}
              <g transform="translate(398 318)">
                <g className="drift">
                  <g transform="rotate(30) scale(.44)">
                    <use href="#leaf" />
                  </g>
                </g>
              </g>

              {/* burying beetle on the soil */}
              <use href="#urbanpark-beetle" x="350" y="676" width="60" height="28.4" />

              {/* the edge of the paving: the ecotone itself */}
              <path d={EDGE} fill="none" stroke={CIN} strokeWidth=".9" strokeDasharray="5 3" />
              <text x="334" y="706" textAnchor="end" className="svg-mono svg-mono--sm" fill={CIN}>
                {t.edge}
              </text>

              {/* plate key */}
              <g className="svg-key" fill={CIN} textAnchor="middle">
                <line x1="422" y1="699" x2="408" y2="694" stroke={CIN} strokeWidth=".6" />
                <circle cx="430" cy="700" r="9" fill={PAPER} stroke={CIN} strokeWidth=".7" />
                <text x="430" y="704.5">1</text>
                <line x1="206" y1="264" x2="170" y2="306" stroke={CIN} strokeWidth=".6" />
                <circle cx="212" cy="256" r="9" fill={PAPER} stroke={CIN} strokeWidth=".7" />
                <text x="212" y="260.5">2</text>
                <line x1="226" y1="618" x2="222" y2="576" stroke={CIN} strokeWidth=".6" />
                <circle cx="226" cy="626" r="9" fill={PAPER} stroke={CIN} strokeWidth=".7" />
                <text x="226" y="630.5">3</text>
                <line x1="284" y1="270" x2="264" y2="300" stroke={CIN} strokeWidth=".6" />
                <circle cx="290" cy="262" r="9" fill={PAPER} stroke={CIN} strokeWidth=".7" />
                <text x="290" y="266.5">4</text>
                <line x1="308" y1="474" x2="328" y2="462" stroke={CIN} strokeWidth=".6" />
                <circle cx="300" cy="480" r="9" fill={PAPER} stroke={CIN} strokeWidth=".7" />
                <text x="300" y="484.5">5</text>
              </g>
            </g>

            <line x1="36" y1="716" x2="564" y2="716" stroke={INK} strokeWidth=".5" />
            <text x="36" y="732" className="svg-italic" fill={INK}>
              Urbs et silva: a city park &amp; its border dwellers
            </text>
            <text x="564" y="732" textAnchor="end" className="svg-mono svg-mono--sm" fill={SEP}>
              25°02′N 121°32′E
            </text>
          </g>
        </svg>
      </Loupe>
      {lang === "zh" ? (
        <figcaption>
          <span className="t">
            <b>Pl. {plateNo}</b>　城市公園的邊緣：鋪面在此讓位給榕樹 <i>Ficus microcarpa</i>、池塘與野草。臺北。
          </span>
          <span>
            城市與自然的交界帶（<i>ecotone</i>）不在遠方，就從公園鋪面的盡頭開始。<span className="hint-fine">移動滑鼠以放大鏡觀察，</span>或按下方的編號放大細節。
          </span>
          <ol className="plate-key">
            <li>
              <b>1</b>埋葬蟲 <i>Nicrophorus</i> · 熱島裡的清道夫
            </li>
            <li>
              <b>2</b>趨光的蛾 <i>Heterocera</i> · 被路燈改寫的夜
            </li>
            <li>
              <b>3</b>野外筆記 · 人如何記下自然
            </li>
            <li>
              <b>4</b>屋頂花園 · 荒野重返高處
            </li>
            <li>
              <b>5</b>環境感測站 · 科技與自然的介面
            </li>
          </ol>
        </figcaption>
      ) : (
        <figcaption>
          <span className="t">
            <b>Pl. {plateNo}</b> <i>Urbs et silva</i>: the edge of a city park, where paving gives way to a banyan (<i>Ficus microcarpa</i>), a pond and wild grass. Taipei.
          </span>
          <span>
            The meeting of city and nature is not somewhere far away; it begins where the paving of a park ends. <span className="hint-fine">Move your mouse to look through the hand lens, </span>or press the numbers below to magnify a detail.
          </span>
          <ol className="plate-key">
            <li>
              <b>1</b>Burying beetle <i>Nicrophorus</i> · the cleaner in the heat island
            </li>
            <li>
              <b>2</b>Moths <i>Heterocera</i> · a night rewritten by the streetlamp
            </li>
            <li>
              <b>3</b>Field notebook · how we write nature down
            </li>
            <li>
              <b>4</b>Roof garden · the wild returning to high places
            </li>
            <li>
              <b>5</b>Sensor station · where technology meets nature
            </li>
          </ol>
        </figcaption>
      )}
    </figure>
  );
}
