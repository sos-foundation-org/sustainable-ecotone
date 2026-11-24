import { Fungus } from "./fungi/library";
import type { FieldMovement } from "@/content/fieldnotes";

const INK = "#1C1A17";
const CIN = "#A8321F";

/**
 * Small engraved marginalia for each field-notes movement, drawn from the volume's own plate
 * (urban park: light at night, the burying beetle, figs and fungi). Decorative only.
 * Animations use the shared .orbit / .drift classes plus fn-crawl / fn-rise, and start when the
 * rail is revealed; all of them sit inside prefers-reduced-motion: no-preference.
 */
export default function FieldVignette({ kind }: { kind: NonNullable<FieldMovement["vignette"]> }) {
  if (kind === "lamp") {
    const moths = [
      { r: 15, dur: 7, delay: 0, rev: false, s: 0.62 },
      { r: 22, dur: 11, delay: -4, rev: true, s: 0.5 },
      { r: 29, dur: 15, delay: -9, rev: false, s: 0.42 },
    ];
    return (
      <svg className="fn-vig" viewBox="0 0 180 120" aria-hidden="true" focusable="false">
        <g fill="none" stroke={INK} strokeLinecap="round">
          <path d="M44 118L44 44M48 118L48 44" strokeWidth=".9" />
          <path d="M46 44C46 30 58 24 74 26L96 30" strokeWidth=".9" />
          <path d="M40 118L52 118M10 118L176 118" strokeWidth=".6" />
          <path d="M88 30L108 30L104 40L92 40Z" className="pf" strokeWidth=".8" />
          <path d="M92 40L104 40" strokeWidth=".5" />
        </g>
        <rect x="45.2" y="60" width="2.8" height="58" fill="url(#hatch)" />
        <ellipse cx="98" cy="45" rx="2.4" ry="3.6" fill={CIN} opacity=".85" />
        {moths.map((m, i) => (
          <g key={i} transform="translate(98 47)">
            <g className="orbit" style={{ animationDuration: `${m.dur}s`, animationDelay: `${m.delay}s`, animationDirection: m.rev ? "reverse" : "normal" }}>
              <g transform={`rotate(${i * 120}) translate(${m.r} 0) rotate(${m.rev ? 0 : 180}) scale(${m.s})`}>
                <use href="#moth" x="-12" y="-10" width="24" height="20" />
              </g>
            </g>
          </g>
        ))}
        <text x="176" y="112" textAnchor="end" className="svg-italic" fill="#5E5141">
          lux nocturna
        </text>
      </svg>
    );
  }
  if (kind === "beetle") {
    return (
      <svg className="fn-vig" viewBox="0 0 180 120" aria-hidden="true" focusable="false">
        <path d="M6 96C40 94 80 98 120 95S168 96 176 96" fill="none" stroke={INK} strokeWidth=".7" />
        <rect x="6" y="97" width="170" height="16" fill="url(#stip)" opacity=".7" />
        <g transform="translate(8 82)">
          <g className="fn-crawl">
            <use href="#burying-beetle" x="0" y="0" width="44" height="21" />
          </g>
        </g>
        <path d="M40 64C52 50 70 46 88 52" fill="none" stroke={INK} strokeWidth=".5" strokeDasharray="1.5 3" />
        <text x="176" y="40" textAnchor="end" className="svg-italic" fill="#5E5141">
          Nicrophorus
        </text>
      </svg>
    );
  }
  // fungi: two hyphae, ink and cinnabar, meeting under the soil and fruiting together
  return (
    <svg className="fn-vig" viewBox="0 0 180 120" aria-hidden="true" focusable="false">
      <path d="M6 88C40 86 80 90 120 87S168 88 176 88" fill="none" stroke={INK} strokeWidth=".7" />
      <g className="fn-vig-hy" fill="none" strokeWidth=".7">
        <path d="M8 112C30 104 50 110 70 100S92 94 96 90" stroke={INK} pathLength={1} />
        <path d="M174 114C150 106 132 112 116 102S100 94 96 90" stroke={CIN} pathLength={1} />
      </g>
      <circle cx="96" cy="90" r="1.8" fill={CIN} />
      <g className="fn-rise" style={{ animationDelay: ".9s" }}>
        <Fungus species="mycena" height={30} x={84} y={88} />
      </g>
      <g className="fn-rise" style={{ animationDelay: "1.2s" }}>
        <Fungus species="amanita" height={40} x={100} y={88} />
      </g>
      <g className="fn-rise" style={{ animationDelay: "1.5s" }}>
        <Fungus species="coprinus" height={24} x={116} y={88} />
      </g>
      <g transform="translate(150 6)">
        <g className="drift">
          <g transform="rotate(30) scale(.36)">
            <use href="#leaf" />
          </g>
        </g>
      </g>
    </svg>
  );
}
