import { leafClusters, stipple, waterLines } from "@/lib/engrave";
import Loupe from "../Loupe";
import Saltator from "../Saltator";

const INK = "#1C1A17";
const CIN = "#A8321F";
const SEP = "#5E5141";
const PAPER = "#F2ECDF";

const ROOTS = [
  "M290 316C240 312 168 336 136 420C120 470 116 560 120 628",
  "M289 348C258 352 222 380 206 450C196 510 198 580 202 630",
  "M290 384C276 410 262 470 258 630",
  "M174 360C140 384 100 470 84 626",
  "M310 330C352 326 420 346 452 420C472 470 476 560 470 628",
  "M311 366C340 372 372 410 382 480C390 540 386 600 388 630",
  "M310 398C318 470 322 560 320 631",
  "M415 367C462 392 512 480 528 626",
];
const BRANCHES = [
  "M300 215C270 190 230 170 180 160",
  "M300 212C330 180 380 165 430 150",
  "M300 208C296 170 300 130 296 100",
  "M300 230C260 220 210 225 150 240",
  "M300 228C350 220 400 230 460 250",
];
const PROPAGULES: [number, number, number][] = [
  [188, 168, 74], [238, 178, 62], [420, 160, 86], [452, 256, 80], [160, 246, 66], [372, 174, 70], [304, 112, 58], [214, 208, 52],
];
const TIPS: [number, number, number][] = [
  [180, 160, 200], [430, 150, -20], [296, 100, -90], [150, 240, 190], [460, 250, 10], [240, 176, 230],
  [370, 170, -50], [214, 206, 150], [390, 206, 30], [250, 136, 200], [350, 124, -30], [300, 180, -100],
];
const FISH: { x: number; y: number; s: number; delay: number; dur: number }[] = [
  { x: 372, y: 486, s: 0.5, delay: -3, dur: 22 },
  { x: 452, y: 566, s: 0.38, delay: -11, dur: 26 },
  { x: 124, y: 530, s: 0.44, delay: -17, dur: 30 },
  { x: 262, y: 596, s: 0.3, delay: -7, dur: 24 },
];

/**
 * Event plate "mangrove" — 水筆仔 Kandelia obovata on the Tamsui estuary,
 * sitting on the mean high-water line. A self-contained, reusable event plate:
 * any event can show it by setting `plate: "mangrove"` in events.ts.
 * Rendered fully inked on the server; the ink pass and leaf sway are CSS, the
 * grasshopper and hand lens are small client islands.
 */
export default function MangrovePlate({ plateNo = "I" }: { plateNo?: string }) {
  const water = waterLines(20, 580, 437, 621);
  const mud = stipple(7, 900, 22, 578, 632, 76);
  const leaves = leafClusters(11, TIPS);
  let k = 0;
  const ink = () => ({ pathLength: 1, style: { animationDelay: `${(k++ % 40) * 0.03}s` } });

  return (
    <figure className="plate-fig plate-fig--portrait">
      <Loupe
        artId="mangrove-art"
        viewBox="0 0 600 760"
        spots={[
          { n: "1", x: 393, y: 140, label: "蝗蟲" },
          { n: "2", x: 216, y: 414, label: "彈塗魚" },
          { n: "3", x: 452, y: 300, label: "胎生苗" },
          { n: "4", x: 466, y: 618, label: "招潮蟹" },
        ]}
      >
        <svg className="art" viewBox="0 0 600 760" role="img" aria-labelledby="mangrove-title">
          <title id="mangrove-title">
            銅版畫風格插圖：淡水河口的水筆仔紅樹林立在平均高潮線上。枝上停著一隻蝗蟲，潮線上有彈塗魚，水下的支柱根之間有魚游過，泥灘上有一隻招潮蟹。
          </title>
          <g id="mangrove-art">
            <rect width="600" height="760" fill={PAPER} />
            <rect x="12" y="12" width="576" height="736" fill="none" stroke={INK} strokeWidth="1.6" />
            <rect x="20" y="20" width="560" height="720" fill="none" stroke={INK} strokeWidth=".5" />
            <text x="36" y="48" className="svg-mono" fill={CIN}>
              PL. {plateNo}
            </text>
            <text x="564" y="48" textAnchor="end" className="svg-mono" fill={SEP}>
              ECOTONUS · TAMSUI
            </text>
            <line x1="36" y1="58" x2="564" y2="58" stroke={INK} strokeWidth=".5" />

            <g className="plate-ink" strokeLinecap="round" strokeLinejoin="round">
              {/* distant Mt. Guanyin */}
              <path className="ink" {...ink()} d="M20 424C70 416 110 392 160 380C200 372 226 346 258 340C288 342 318 362 356 374C416 392 500 406 580 414" fill="none" stroke={SEP} strokeWidth=".7" />
              <path d="M160 380C200 372 226 346 258 340C288 342 318 362 356 374C330 380 300 384 258 386C220 386 190 384 160 380Z" fill="url(#hatchW)" opacity=".45" />
              <text x="530" y="398" textAnchor="middle" className="svg-italic" fill={SEP}>
                Mt. Guanyin 觀音山
              </text>

              {/* stilt roots */}
              <g fill="none" stroke={INK} strokeWidth="1.1">
                {ROOTS.map((d) => (
                  <path key={d} className="ink" {...ink()} d={d} />
                ))}
                <path className="ink" {...ink()} strokeWidth=".55" d="M290 319C242 316 172 340 140 422C124 472 120 560 124 628M310 333C350 330 416 350 448 422C468 472 472 560 466 628" />
                <path strokeWidth=".65" d="M120 628l-8 6M120 628l6 7M202 630l-7 5M202 630l5 6M258 630l-6 5M84 626l-6 6M84 626l5 7M470 628l8 6M470 628l-5 7M388 630l7 5M320 631l-6 5M320 631l6 4M528 626l6 6" />
              </g>
              {/* trunk */}
              <path d="M290 206C293 260 290 300 286 330C284 350 288 380 288 400L314 400C312 380 316 350 314 330C310 300 307 260 310 206Z" fill={PAPER} />
              <path className="ink" {...ink()} d="M290 206C293 260 290 300 286 330C284 350 288 380 288 400M310 206C307 260 310 300 314 330C316 350 312 380 314 400" fill="none" stroke={INK} strokeWidth="1.5" />
              <path d="M302 212C304 262 306 300 309 330C311 352 308 380 310 400L314 400C312 380 316 350 314 330C310 300 307 260 310 206Z" fill="url(#hatch)" />
              <path d="M295 232l3 6M297 258l2 7M294 286l3 6M292 314l2 7M291 342l3 6M292 370l2 7" stroke={INK} strokeWidth=".6" fill="none" />
              {/* branches */}
              <g fill="none" stroke={INK} strokeWidth="1.4">
                {BRANCHES.map((d) => (
                  <path key={d} className="ink" {...ink()} d={d} />
                ))}
                <path className="ink" {...ink()} strokeWidth=".9" d="M240 176C230 190 222 200 214 206M370 170C380 184 386 196 390 206M298 150C280 140 266 136 250 136M298 140C318 128 334 124 350 124" />
              </g>
              {/* propagules — the "water pens" that give 水筆仔 its name */}
              {PROPAGULES.map(([x, y, L]) => (
                <g key={`${x}-${y}`}>
                  <path d={`M${x} ${y}C${x - 3.2} ${y + L * 0.25} ${x - 3} ${y + L * 0.8} ${x + 0.4} ${y + L}C${x + 3} ${y + L * 0.8} ${x + 3.2} ${y + L * 0.25} ${x} ${y}Z`} fill="url(#hatch)" stroke={INK} strokeWidth=".7" />
                  <path d={`M${x - 3} ${y + 2}L${x} ${y - 4}L${x + 3} ${y + 2}Z`} fill={PAPER} stroke={INK} strokeWidth=".6" />
                </g>
              ))}
              {/* leaves */}
              {leaves.map((l, i) => (
                <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.a}) scale(${l.s})`}>
                  <g className="sway" style={{ animationDelay: `${l.delay}s`, animationDuration: `${l.dur}s` }}>
                    <use href="#leaf" />
                  </g>
                </g>
              ))}

              {/* mean high-water line: the ecotone itself */}
              <path d="M20 430C60 427 100 433 140 430C180 427 220 433 260 430C300 427 340 433 380 430C420 427 460 433 500 430C540 427 560 432 580 430" fill="none" stroke={CIN} strokeWidth=".9" strokeDasharray="5 3" />
              <text x="572" y="422" textAnchor="end" className="svg-mono svg-mono--sm" fill={CIN}>
                MHW · 平均高潮線
              </text>

              <g fill="none" stroke={INK}>
                {water.map((w, i) => (
                  <path key={i} d={w.d} strokeWidth={w.w} opacity={w.o} />
                ))}
              </g>
              <path d="M20 630C90 624 150 634 240 628C330 622 420 634 500 627C540 624 560 630 580 628" fill="none" stroke={INK} strokeWidth=".8" />
              <g fill={INK}>
                {mud.map((m, i) => (
                  <circle key={i} cx={m.x} cy={m.y} r={m.r} opacity={m.o} />
                ))}
              </g>

              {FISH.map((f) => (
                <g key={f.x} transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
                  <g className="swim" style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s` }}>
                    <use href="#fish" width="120" height="50" color={INK} />
                  </g>
                </g>
              ))}
              <use href="#mudskipper" x="188" y="402" width="56" height="22.4" color={INK} />
              <use href="#crab" x="440" y="604" width="54" height="30" color={INK} />

              {/* plate key */}
              <g className="svg-key" fill={CIN} textAnchor="middle">
                <line x1="476" y1="112" x2="420" y2="142" stroke={CIN} strokeWidth=".6" />
                <circle cx="484" cy="108" r="9" fill={PAPER} stroke={CIN} strokeWidth=".7" />
                <text x="484" y="112.5">1</text>
                <line x1="104" y1="384" x2="190" y2="404" stroke={CIN} strokeWidth=".6" />
                <circle cx="96" cy="380" r="9" fill={PAPER} stroke={CIN} strokeWidth=".7" />
                <text x="96" y="384.5">2</text>
                <line x1="530" y1="300" x2="458" y2="296" stroke={CIN} strokeWidth=".6" />
                <circle cx="538" cy="300" r="9" fill={PAPER} stroke={CIN} strokeWidth=".7" />
                <text x="538" y="304.5">3</text>
                <line x1="520" y1="664" x2="482" y2="620" stroke={CIN} strokeWidth=".6" />
                <circle cx="526" cy="672" r="9" fill={PAPER} stroke={CIN} strokeWidth=".7" />
                <text x="526" y="676.5">4</text>
              </g>
            </g>

            <Saltator
              perches={[
                { x: 393, y: 161, f: 1 },
                { x: 217, y: 227, f: -1 },
              ]}
            />

            <line x1="36" y1="716" x2="564" y2="716" stroke={INK} strokeWidth=".5" />
            <text x="36" y="732" className="svg-italic" fill={INK}>
              Kandelia obovata &amp; its border visitors
            </text>
            <text x="564" y="732" textAnchor="end" className="svg-mono svg-mono--sm" fill={SEP}>
              25°10′N 121°26′E
            </text>
          </g>
        </svg>
      </Loupe>
      <figcaption>
        <span className="t">
          <b>Pl. {plateNo}</b>　水筆仔 <i>Kandelia obovata</i>，與它的交界訪客。淡水河口。
        </span>
        <span>
          紅樹林一半在海、一半在陸，是最典型的 <i>ecotone</i>。<span className="hint-fine">移動滑鼠以放大鏡觀察，</span>或按下方的編號放大細節；點一下蝗蟲，看牠跳躍。
        </span>
        <ol className="plate-key">
          <li>
            <b>1</b>蝗蟲 <i>Saltatoria</i> — 跳躍者
          </li>
          <li>
            <b>2</b>彈塗魚 <i>Periophthalmus</i> — 會走路的魚
          </li>
          <li>
            <b>3</b>胎生苗 — 「水中的筆」
          </li>
          <li>
            <b>4</b>招潮蟹 <i>Uca</i> — 潮間帶的住民
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}
