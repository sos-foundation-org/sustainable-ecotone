import { edgeBand } from "@/lib/engrave";
import { FrogLeap } from "./FrogLeap";
import type { Lang } from "@/lib/i18n";

/**
 * Fig. Saltatio ranae: the leap divider. A frog crosses the figure each time it
 * scrolls into view (see FrogLeap); kept under its old name so pages need no change.
 */
export function MareyDivider({ caption = true, lang = "zh" }: { caption?: boolean; lang?: Lang }) {
  return <FrogLeap caption={caption} lang={lang} />;
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
