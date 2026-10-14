"use client";

import { useState } from "react";
import type { Desideratum } from "@/content/crossings";
import LeapStage from "./LeapStage";
import type { Discipline } from "@/content/disciplines";

/**
 * Desiderata — the museum's list of wanted specimens. Two disciplines face each
 * other across the gutter with a question; ☞ 下一跳 moves to the next pair,
 * with the grasshopper's leap. Pairs nobody has crossed yet come first.
 */
export default function NextCrossing({ items, disciplines }: { items: Desideratum[]; disciplines: Discipline[] }) {
  const [i, setI] = useState(0);
  const [leap, setLeap] = useState(0);
  const item = items[i % items.length];
  const A = disciplines.find((d) => d.key === item.a)!;
  const B = disciplines.find((d) => d.key === item.b)!;

  return (
    <figure className="desiderata">
      <div className="desiderata-head mono">
        <span>Desiderata · 徵集清單</span>
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
          <span className="mono">{A.code}</span> {A.zh}
        </span>
        <span className="x" aria-hidden="true">
          ×
        </span>
        <span>
          <span className="mono">{B.code}</span> {B.zh}
        </span>
      </p>
      <blockquote className="desiderata-q" aria-live="polite">
        「{item.question}」
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
          下一跳 <i>Saltate</i>
        </button>
        <span className="desiderata-note">下一位講者，也許就來自你的學科。</span>
      </figcaption>
    </figure>
  );
}
