import Link from "next/link";
import type { ReactNode } from "react";

/** Section title row with an optional "see all" link on the right. */
export default function SectionHead({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-head reveal">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="h-section" style={{ margin: 0 }}>
          {title}
        </h2>
      </div>
      {href && (
        <Link className="btn btn--ghost" href={href}>
          {linkLabel} <span className="arrow">→</span>
        </Link>
      )}
    </div>
  );
}
