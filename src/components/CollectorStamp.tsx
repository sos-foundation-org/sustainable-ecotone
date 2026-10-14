import { ORGS, type OrgKey } from "@/content/site";
import type { Lang } from "@/lib/i18n";
import Logo from "./Logo";
import OrgLink from "./OrgLink";

const NEW_TAB = { zh: "（另開新視窗）", en: " (opens in a new tab)" } satisfies Record<Lang, string>;

/**
 * A collector's stamp: the partner's OFFICIAL logo (never redrawn), framed by an
 * engraved ring with its name — like an ownership stamp in a folio. Chinese
 * pages ring it in both languages, English pages in English only.
 */
export default function CollectorStamp({ org, tilt = 0, lang = "zh" }: { org: OrgKey; tilt?: number; lang?: Lang }) {
  const o = ORGS[org];
  const name = o.name[lang];
  const ring = lang === "zh" ? `${o.nameEn.toUpperCase()} · ${o.name.zh} · ` : `${o.nameEn.toUpperCase()} · ${o.nameEn === name ? "" : `${name.toUpperCase()} · `}`;
  return (
    <OrgLink org={org} className="stamp" lang={lang}>
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
      <span className="stamp-logo">{o.logo ? <Logo src={o.logo} alt={`${name} logo`} /> : <span className="stamp-text">{name}</span>}</span>
      <span className="sr-only">
        {name}
        {NEW_TAB[lang]}
      </span>
    </OrgLink>
  );
}
