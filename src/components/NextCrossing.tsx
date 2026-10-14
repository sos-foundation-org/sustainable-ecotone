"use client";

import { useState } from "react";
import type { Desideratum } from "@/content/crossings";
import type { Discipline } from "@/content/disciplines";
import type { Lang } from "@/lib/i18n";
import LeapStage from "./LeapStage";

const T = {
  zh: { head: "Desiderata · 徵集清單", leap: "下一跳", note: "下一位講者，也許就來自你的學科。", q: ["「", "」"] },
  en: { head: "Desiderata · Wanted", leap: "Next leap", note: "The next speaker may well come from your field.", q: ["“", "”"] },
} satisfies Record<Lang, unknown>;

/**
 * Desiderata — the museum's list of wanted crossings. Two disciplines face each
 * other across the gutter with a question; ☞ 下一跳 / Next leap moves to the
 * next pair, with the grasshopper's leap. Pairs nobody has crossed yet come first.
 */
export default function NextCrossing({ items, disciplines, lang = "zh" }: { items: Desideratum[]; disciplines: Discipline[]; lang?: Lang }) {
  const [i, setI] = useState(0);
  const [leap, setLeap] = useState(0);
  const t = T[lang];
  const item = items[i % items.length];
  const A = disciplines.find((d) => d.key === item.a)!;
  const B = disciplines.find((d) => d.key === item.b)!;

  return (
    <figure className="desiderata">
      <div className="desiderata-head mono">
        <span>{t.head}</span>
        <span>
          {String((i % items.length) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>
      <div className="desiderata-stage" aria-hidden="true">
        <LeapStage trigger={leap}>
          <rect x="22" y="40" width="72" height="40" fill="#FAF6EC" />
          <rect x="22" y="40" width="72" height="40" fill={`url(#lt-${A.key})`} />
          <rect x="22" y="40" width="72" height="40" fill="none" stroke="#1C1A17" />
          <rect x="226" y="40" width="72" height="40" fill="#FAF6EC" />
          <rect x="226" y="40" width="72" height="40" fill={`url(#lt-${B.key})`} />
          <rect x="226" y="40" width="72" height="40" fill="none" stroke="#1C1A17" />
          <line x1="158" y1="8" x2="158" y2="112" stroke="#1C1A17" strokeWidth="1.2" />
          <line x1="162" y1="8" x2="162" y2="112" stroke="#1C1A17" strokeWidth=".4" />
          <path key={leap} className="desiderata-link" pathLength={1} d="M94 60C140 30 180 30 226 60" fill="none" stroke="#A8321F" strokeWidth="1.4" />
        </LeapStage>
      </div>
      <p className="desiderata-pair">
        <span>
          <span className="mono">{A.code}</span> {A.name[lang]}
        </span>
        <span className="x" aria-hidden="true">
          ×
        </span>
        <span>
          <span className="mono">{B.code}</span> {B.name[lang]}
        </span>
      </p>
      <blockquote className="desiderata-q" aria-live="polite">
        {t.q[0]}
        {item.question[lang]}
        {t.q[1]}
      </blockquote>
      <figcaption>
        <button
          type="button"
          className="btn btn--line"
          onClick={() => {
            setI((n) => n + 1);
            setLeap((n) => n + 1);
          }}
        >
          <span className="mani" aria-hidden="true">
            ☞
          </span>
          {t.leap} {lang === "zh" && <i>Saltate</i>}
        </button>
        <span className="desiderata-note">{t.note}</span>
      </figcaption>
    </figure>
  );
}
