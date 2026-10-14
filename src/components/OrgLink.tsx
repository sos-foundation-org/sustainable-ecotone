import type { ReactNode } from "react";
import { ORGS, type OrgKey } from "@/content/site";
import type { Lang } from "@/lib/i18n";

const PENDING = { zh: "網址待補", en: "Link to come" } satisfies Record<Lang, string>;

/** External link to an organisation's site; renders an inert "#" with a tooltip while the URL is still a placeholder. */
export default function OrgLink({ org, className, lang = "zh", children }: { org: OrgKey; className?: string; lang?: Lang; children: ReactNode }) {
  const url = ORGS[org].url;
  if (!url) {
    return (
      <a className={className} href="#" title={PENDING[lang]} aria-disabled="true">
        {children}
      </a>
    );
  }
  return (
    <a className={className} href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
