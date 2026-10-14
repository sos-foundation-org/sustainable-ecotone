import type { ReactNode } from "react";
import PollinationField from "./PollinationField";

export default function PageHero({
  eyebrow,
  title,
  lead,
  children,
  full = false,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  full?: boolean;
}) {
  return (
    <section className={`hero${full ? "" : " hero--page"}`}>
      <PollinationField />
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
      {full && <div className="scroll-cue" aria-hidden="true" />}
    </section>
  );
}
