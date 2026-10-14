import Link from "next/link";
import { CO_ORGANIZERS, NAV, ORGS, CALL_NAV, SITE } from "@/content/site";
import BrandMark from "./BrandMark";
import OrgLink from "./OrgLink";
import FollowCard from "./Follow";

export default function Footer() {
  return (
    <footer className="colophon">
      <div className="wrap">
        <div className="colo-grid">
          <div className="colo-brand">
            <p className="brand-line">
              <BrandMark size={36} />
              <span>
                <b>Ecotone</b>｜{SITE.nameZh}
              </span>
            </p>
            <p className="muted">
              {SITE.subtitle}，由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起。{SITE.tagline}
            </p>
            <FollowCard compact />
          </div>
          <nav aria-label="頁尾選單">
            <h2 className="mono colo-h">Index · 目錄</h2>
            <ul>
              <li>
                <Link href="/">首頁 <i>Frontispiece</i></Link>
              </li>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>
                    {n.label} <i>{n.en}</i>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={CALL_NAV.href}>
                  {CALL_NAV.label} / 聯絡 <i>{CALL_NAV.en}</i>
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="mono colo-h">Collectors · 共同主辦</h2>
            <ul>
              {CO_ORGANIZERS.map(({ key }) => (
                <li key={key}>
                  <OrgLink org={key}>{ORGS[key].name}</OrgLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="fine mono">
          <span>© {new Date().getFullYear()} Ecotone 兼容並續 · Interdisciplinary Sustainability Forum</span>
          <span>Colophon · set in Noto Serif TC, Cormorant Garamond &amp; IBM Plex Mono</span>
        </div>
      </div>
    </footer>
  );
}
