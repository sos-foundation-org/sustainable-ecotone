import type { ForumEvent } from "@/content/events";
import { emblemRings, roman } from "@/lib/engrave";

/** A volume's emblem: tree rings seeded from its slug, so every volume is unique and stable. */
export function VolumeEmblem({ e, size = 120 }: { e: ForumEvent; size?: number }) {
  const { rings, crack } = emblemRings(e.slug);
  return (
    <svg className="emblem" width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth=".35" />
      <g fill="none" stroke="currentColor">
        {rings.map((d, i) => (
          <path key={i} d={d} strokeWidth={i === rings.length - 1 ? 0.9 : 0.45} />
        ))}
      </g>
      <g transform={`rotate(${crack} 60 60)`}>
        <path d="M61 60L112 54L111 61Z" fill="#A8321F" />
      </g>
      <circle cx="60" cy="60" r="12" fill="var(--paper)" stroke="currentColor" strokeWidth=".6" />
      <text x="60" y="65" textAnchor="middle" className="svg-italic svg-italic--emblem" fill="currentColor">
        {roman(e.vol)}
      </text>
    </svg>
  );
}

/** Programme set as a book's table of contents, with dotted leaders. */
export function ProgrammeToc({ e }: { e: ForumEvent }) {
  return (
    <ol className="toc">
      {e.program.map((p) => (
        <li key={p.time + p.title}>
          <div className="toc-row">
            <span className="toc-title">{p.title}</span>
            <span className="toc-leader" aria-hidden="true" />
            <time className="toc-time mono">{p.time}</time>
          </div>
          <p>{p.detail}</p>
        </li>
      ))}
    </ol>
  );
}
