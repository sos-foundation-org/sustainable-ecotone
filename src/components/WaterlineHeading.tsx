import type { CSSProperties, ReactNode } from "react";

/**
 * 「兩個世界，在水線相遇」— a heading crossed by the waterline.
 *
 * The glyphs above the line are ink; below it the same text is clipped,
 * nudged and tinted cyanotype, as if seen through water. The visible, selectable
 * and accessible text is the real heading; the "under water" copy is a purely
 * visual duplicate (aria-hidden, not selectable). A cinnabar tide line runs
 * through the type and slowly breathes (static under reduced motion).
 *
 * By default the line is anchored to the LAST line's glyph bodies, so it
 * crosses the type on one- and multi-line headings alike. Pass `waterline`
 * (0–1 of the heading's height) only to override that.
 *
 * Use with restraint — at most once per page, for signature moments.
 */
export default function WaterlineHeading({
  children,
  en,
  waterline,
  as: Tag = "h1",
  id,
  align = "start",
  contained = false,
  className = "",
}: {
  children: ReactNode;
  /** optional English line set beneath, in Cormorant italic */
  en?: ReactNode;
  /** override: waterline position as a fraction of the heading's height (0–1) */
  waterline?: number;
  as?: "h1" | "h2";
  id?: string;
  align?: "start" | "center";
  /** keep the tide line inside the heading's own column (beside art) instead of full-bleed */
  contained?: boolean;
  className?: string;
}) {
  const style = (waterline !== undefined ? { "--wl": `${Math.round(waterline * 1000) / 10}%` } : undefined) as CSSProperties | undefined;
  return (
    <div className={`wl-heading wl-heading--${align}${contained ? " wl-heading--contained" : ""} ${className}`}>
      <Tag id={id} className="wl" style={style}>
        <span className="wl-above">{children}</span>
        <span className="wl-below" aria-hidden="true">
          {children}
        </span>
        <span className="wl-line" aria-hidden="true" />
      </Tag>
      {en && <p className="wl-en">{en}</p>}
    </div>
  );
}
