import Link from "next/link";
import { CO_ORGANIZERS, NAV, ORGS } from "@/content/site";
import OrgLink from "./OrgLink";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-name">
              <span className="en">Ecotone</span>
              <span className="zh">兼容並續</span>
            </div>
            <p style={{ marginTop: ".6rem", maxWidth: "28em" }}>
              跨領域永續論壇 — 由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起。在學科的交界處，讓永續長出新的物種。
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/contact">報名 / 聯絡</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Partners</h4>
            <ul>
              {CO_ORGANIZERS.map(({ key }) => (
                <li key={key}>
                  <OrgLink org={key}>{ORGS[key].name}</OrgLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ecotone 兼容並續 · Interdisciplinary Sustainability Forum</span>
          <span>NTU × NYCU × SOS Foundation</span>
        </div>
      </div>
    </footer>
  );
}
