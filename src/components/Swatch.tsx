import { disciplineByKey, type DisciplineKey } from "@/content/disciplines";
import type { Lang } from "@/lib/i18n";

const DIMS = { sm: [36, 18], md: [36, 18], lg: [120, 36] } as const;

/** An engraved linetype swatch for one discipline, optionally with its label. */
export default function Swatch({ k, label = true, size = "md", lang = "zh" }: { k: DisciplineKey; label?: boolean; size?: "sm" | "md" | "lg"; lang?: Lang }) {
  const d = disciplineByKey(k);
  const [w, h] = DIMS[size];
  const title = lang === "zh" ? `${d.name.zh} ${d.name.en}` : d.name.en;
  return (
    <span className={`swatch swatch--${size}`} title={label ? undefined : title}>
      <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <rect width={w} height={h} fill="#FAF6EC" />
        <rect width={w} height={h} fill={`url(#lt-${k})`} />
        <rect x=".5" y=".5" width={w - 1} height={h - 1} fill="none" stroke="#1C1A17" strokeWidth=".8" />
      </svg>
      {label ? (
        <span className="swatch-label">
          <span className="mono">{d.code}</span> {d.name[lang]}
        </span>
      ) : (
        <span className="sr-only">{d.name[lang]}</span>
      )}
    </span>
  );
}
