import { edgeBand, r2 } from "@/lib/engrave";

/**
 * Chronophotographic leap (after É.-J. Marey): seven ghost grasshoppers along a
 * parabola. The ghosts ink in when the divider scrolls into view.
 */
export function MareyDivider({ caption = true }: { caption?: boolean }) {
  const P0 = [90, 132];
  const P1 = [600, -88];
  const P2 = [1110, 132];
  const N = 7;
  const ghosts = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const x = (1 - t) ** 2 * P0[0] + 2 * t * (1 - t) * P1[0] + t * t * P2[0];
    const y = (1 - t) ** 2 * P0[1] + 2 * t * (1 - t) * P1[1] + t * t * P2[1];
    const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
    const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
    const ang = ((Math.atan2(dy, dx) * 180) / Math.PI) * 0.55;
    return { x: r2(x), y: r2(y), ang: r2(ang), o: r2(0.16 + 0.84 * Math.pow(t, 1.6)), i };
  });
  return (
    <div className="marey wrap reveal" aria-hidden="true">
      <svg viewBox="0 0 1200 150">
        <path d="M90 132Q600-88 1110 132" fill="none" stroke="var(--ink)" strokeWidth=".6" strokeDasharray="2 5" />
        <line x1="40" y1="134" x2="1160" y2="134" stroke="var(--ink)" strokeWidth=".5" />
        {ghosts.map((g) => (
          <g
            key={g.i}
            className="ghost"
            transform={`translate(${g.x} ${g.y}) rotate(${g.ang}) scale(.42)`}
            style={{ ["--o" as string]: g.o, transitionDelay: `${g.i * 0.11}s` }}
          >
            <use href="#grasshopper" x="-110" y="-99" width="210" height="110" />
          </g>
        ))}
        <text x="90" y="149" className="svg-mono" fill="var(--cinnabar)">
          t = 0
        </text>
        <text x="1110" y="149" textAnchor="end" className="svg-mono" fill="var(--cinnabar)">
          t = 0.6 s
        </text>
      </svg>
      {caption && (
        <p>
          <i>Fig. — Saltation.</i>　跳躍：從一個學科，到另一個學科。
        </p>
      )}
    </div>
  );
}

/**
 * An engraved ecotone band between two grounds. `from` is the colour above,
 * `to` the colour below; the lower ground reaches up into the upper one.
 */
export function PlateEdge({
  from,
  to,
  mode = "lace",
  seed = 1,
  label,
}: {
  from: string;
  to: string;
  mode?: "lace" | "fingers";
  seed?: number;
  label?: string;
}) {
  const { fill, lines } = edgeBand(seed, mode);
  return (
    <div className="plate-edge" style={{ background: from }} aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        {lines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={to} strokeWidth="1" opacity={0.55 - i * 0.12} vectorEffect="non-scaling-stroke" />
        ))}
        <path d={fill} fill={to} />
        {mode === "fingers" && <path d={fill} fill="none" stroke="var(--ink)" strokeOpacity=".55" strokeWidth=".6" vectorEffect="non-scaling-stroke" />}
      </svg>
      {label && <span className="edge-label mono">{label}</span>}
    </div>
  );
}
