"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";

const PAIRS: [string, string, string, string][] = [
  ["森林", "Forest", "草原", "Grassland"],
  ["醫學", "Medicine", "文學", "Literature"],
  ["法律", "Law", "海洋", "Ocean"],
  ["金融", "Finance", "農業", "Agriculture"],
  ["電機", "Electrical Eng.", "漁業", "Fisheries"],
  ["歷史", "History", "高科技", "High-tech"],
  ["臺北", "Taipei", "新加坡", "Singapore"],
];

const T = {
  zh: {
    title: "邊緣效應示意圖：兩側各自的物種曲線在交界處重疊，總豐富度在交會帶達到高峰。",
    richness: "豐富度 · richness",
    zone: "交會帶",
    cap: "邊緣效應：交會帶的物種，多於任一側。",
    swap: "換一組學科",
  },
  en: {
    title: "The edge effect: the species curves of the two sides overlap at the boundary, and total richness peaks in the ecotone.",
    richness: "richness",
    zone: "where they meet",
    cap: "The edge effect: the ecotone holds more species than either side.",
    swap: "Try another pair",
  },
} satisfies Record<Lang, unknown>;

/** Fig. 2 — the edge effect. The two sides can be swapped for any pair of disciplines (user-driven, never auto-rotating). */
export default function EdgeEffectFigure({ lang = "zh" }: { lang?: Lang }) {
  const [i, setI] = useState(0);
  const [a, aEn, b, bEn] = PAIRS[i];
  const t = T[lang];
  return (
    <figure className="fig2 reveal">
      <svg viewBox="0 0 560 310" role="img" aria-labelledby="fig2-title">
        <title id="fig2-title">{t.title}</title>
        <rect className="band" x="222" y="34" width="136" height="226" fill="url(#hatchC)" opacity=".55" />
        <line className="band" x1="222" y1="34" x2="222" y2="260" stroke="var(--cinnabar)" strokeWidth=".7" strokeDasharray="2 3" />
        <line className="band" x1="358" y1="34" x2="358" y2="260" stroke="var(--cinnabar)" strokeWidth=".7" strokeDasharray="2 3" />
        <g stroke="var(--ink)" strokeWidth=".8" fill="none">
          <path d="M60 30L60 260L524 260" />
          <path d="M60 30l-3 7M60 30l3 7M524 260l-7-3M524 260l-7 3" />
          <path d="M106 260v5M152 260v5M198 260v5M244 260v5M290 260v5M336 260v5M382 260v5M428 260v5M474 260v5" strokeWidth=".6" />
          <path d="M60 214h-5M60 168h-5M60 122h-5M60 76h-5" strokeWidth=".6" />
        </g>
        <path className="curve" pathLength={1} d="M62 74C220 74 300 150 362 256" fill="none" stroke="var(--sepia)" strokeWidth="1.1" />
        <path className="curve d2" pathLength={1} d="M520 74C362 74 282 150 218 256" fill="none" stroke="#2F6B60" strokeWidth="1.1" />
        <path className="curve d3" pathLength={1} d="M62 104C160 104 206 54 290 48C374 54 420 104 520 104" fill="none" stroke="var(--cinnabar)" strokeWidth="2" />
        <circle className="band" cx="290" cy="48" r="3.4" fill="var(--cinnabar)" />
        <text className="band svg-italic svg-italic--lg" x="300" y="40" fill="var(--cinnabar)">
          edge effect
        </text>
        <text x="40" y="146" transform="rotate(-90 40 146)" textAnchor="middle" className="svg-zh svg-zh--sm" fill="var(--sepia)">
          {t.richness}
        </text>
        <g className="svg-zh" fill="var(--ink)" aria-live="polite">
          {lang === "zh" ? (
            <>
              <text x="62" y="288">
                {a} <tspan className="svg-italic">{aEn}</tspan>
              </text>
              <text x="522" y="288" textAnchor="end">
                {b} <tspan className="svg-italic">{bEn}</tspan>
              </text>
            </>
          ) : (
            <>
              <text x="62" y="288" className="svg-italic svg-italic--lg">
                {aEn}
              </text>
              <text x="522" y="288" textAnchor="end" className="svg-italic svg-italic--lg">
                {bEn}
              </text>
            </>
          )}
        </g>
        <text x="290" y="288" textAnchor="middle" className="svg-mono" fill="var(--cinnabar)">
          ECOTONE
        </text>
        <text x="290" y="303" textAnchor="middle" className="svg-zh svg-zh--sm" fill="var(--cinnabar)">
          {t.zone}
        </text>
        <g className="svg-italic" fill="var(--sepia)">
          <text x="120" y="68">species of A</text>
          <text x="462" y="68" textAnchor="end">
            species of B
          </text>
        </g>
      </svg>
      <figcaption className="fig-cap">
        <span>
          <b>Fig. 2</b>
          {lang === "zh" ? "　" : " "}
          {t.cap}
        </span>
        <button type="button" className="text-btn" onClick={() => setI((n) => (n + 1) % PAIRS.length)}>
          {t.swap} <span aria-hidden="true">↻</span>
        </button>
      </figcaption>
    </figure>
  );
}
