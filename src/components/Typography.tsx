import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import WaterlineHeading from "./WaterlineHeading";

/** Plate head: PLATE + roman numeral, bilingual title, catalogue reference. */
export function PlateHead({
  no,
  label = "Plate",
  title,
  en,
  side,
  id,
  lang = "zh",
}: {
  no: string;
  label?: string;
  title: ReactNode;
  /** optional italic subtitle (on Chinese pages usually the English gloss) */
  en?: string;
  side?: string;
  id?: string;
  lang?: Lang;
}) {
  return (
    <header className="plate-head reveal">
      <div className="plate-no" aria-hidden="true">
        <small>{label}</small>
        {no}
      </div>
      <h2 id={id}>
        <span className="sr-only">
          {label} {no}
          {lang === "zh" ? "：" : ": "}
        </span>
        {title}
        {en && <i> {en}</i>}
      </h2>
      {side && (
        <div className="side mono" aria-hidden="true">
          {side}
        </div>
      )}
    </header>
  );
}

/**
 * Inner-page title block: catalogue line, H1 resting on the tide rule, lead,
 * optional aside art. Set `waterline` to use the signature WaterlineHeading
 * (reserved for at most one heading per page).
 */
export function PageTitle({
  catalog,
  title,
  en,
  lead,
  aside,
  waterline,
  children,
}: {
  catalog: string[];
  title: ReactNode;
  en?: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  waterline?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={`page-title${aside ? " has-aside" : ""}`}>
      <div className="wrap page-title-grid">
        <div>
          <p className="catno mono">
            {catalog.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </p>
          {waterline ? (
            <WaterlineHeading en={en}>
              {title}
            </WaterlineHeading>
          ) : (
            <>
              <h1 className="pt-h1">{title}</h1>
              {en && <p className="wl-en">{en}</p>}
            </>
          )}
          {lead && <div className="lead">{lead}</div>}
          {children}
        </div>
        {aside && <div className="page-title-aside">{aside}</div>}
      </div>
    </section>
  );
}
