/* eslint-disable @next/next/no-img-element -- speaker photos are plain static files */
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Speaker } from "@/content/speakers";

export function Portrait({ s, className = "portrait" }: { s: Speaker; className?: string }) {
  const style = { "--p1": s.palette[0], "--p2": s.palette[1] } as CSSProperties;
  return (
    <div className={className} style={style}>
      {s.identities.length >= 3 && <span className="identity-count">{s.identities.length} IDENTITIES</span>}
      {s.photo ? <img src={s.photo} alt={s.name} /> : <span className="initial">{s.initial}</span>}
    </div>
  );
}

export default function SpeakerCard({ s }: { s: Speaker }) {
  return (
    <Link className="speaker-card reveal" href={`/speakers#${s.id}`}>
      <Portrait s={s} />
      <div className="speaker-body">
        <h3>{s.name}</h3>
        <div className="en">{s.short}</div>
        <ul className="identities">
          {s.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
