import { disciplineByKey, type DisciplineKey } from "@/content/disciplines";

const DIMS = { sm: [36, 18], md: [36, 18], lg: [120, 36] } as const;

/** An engraved linetype swatch for one discipline, optionally with its label. */
export default function Swatch({ k, label = true, size = "md" }: { k: DisciplineKey; label?: boolean; size?: "sm" | "md" | "lg" }) {
  const d = disciplineByKey(k);
  const [w, h] = DIMS[size];
  return (
    <span className={`swatch swatch--${size}`} title={label ? undefined : `${d.zh} ${d.en}`}>
      <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <rect width={w} height={h} fill="#FAF6EC" />
        <rect width={w} height={h} fill={`url(#lt-${k})`} />
        <rect x=".5" y=".5" width={w - 1} height={h - 1} fill="none" stroke="#1C1A17" strokeWidth=".8" />
      </svg>
      {label ? (
        <span className="swatch-label">
          <span className="mono">{d.code}</span> {d.zh}
        </span>
      ) : (
        <span className="sr-only">{d.zh}</span>
      )}
    </span>
  );
}
