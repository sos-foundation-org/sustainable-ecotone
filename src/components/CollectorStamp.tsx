import { ORGS, type OrgKey } from "@/content/site";
import Logo from "./Logo";
import OrgLink from "./OrgLink";

/**
 * A collector's stamp: the partner's OFFICIAL logo (never redrawn), framed by an
 * engraved ring with its English name — like an ownership stamp in a folio.
 */
export default function CollectorStamp({ org, tilt = 0 }: { org: OrgKey; tilt?: number }) {
  const o = ORGS[org];
  const ring = `${o.nameEn.toUpperCase()} · ${o.name} · `;
  return (
    <OrgLink org={org} className="stamp">
      <span className="stamp-ring" style={{ transform: `rotate(${tilt}deg)` }} aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs>
            <path id={`stamp-${org}`} d="M60 60m-49 0a49 49 0 1 1 98 0a49 49 0 1 1-98 0" />
          </defs>
          <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="60" cy="60" r="41" fill="none" stroke="currentColor" strokeWidth=".5" />
          <text className="svg-mono svg-mono--ring" fill="currentColor">
            <textPath href={`#stamp-${org}`}>{ring.length > 60 ? ring : ring + ring}</textPath>
          </text>
        </svg>
      </span>
      <span className="stamp-logo">{o.logo ? <Logo src={o.logo} alt={`${o.name} logo`} /> : <span className="stamp-text">{o.name}</span>}</span>
      <span className="sr-only">{o.name}（另開新視窗）</span>
    </OrgLink>
  );
}
