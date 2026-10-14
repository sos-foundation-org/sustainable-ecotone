import Link from "next/link";
import { CO_ORGANIZERS, NAV, ORGS, CALL_NAV, SITE } from "@/content/site";
import { localePath, type Lang } from "@/lib/i18n";
import BrandMark from "./BrandMark";
import OrgLink from "./OrgLink";
import FollowCard from "./Follow";

const T = {
  zh: {
    about: `${SITE.subtitle.zh}，由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起。${SITE.tagline.zh}`,
    nav: "頁尾選單",
    index: "Index · 目錄",
    home: "首頁",
    call: `${CALL_NAV.label.zh} / 聯絡`,
    collectors: "共同主辦 Co-organizers",
    set: "Colophon · set in Noto Serif TC, Cormorant Garamond & IBM Plex Mono",
  },
  en: {
    about: `An interdisciplinary sustainability forum co-founded by National Taiwan University, National Yang Ming Chiao Tung University and SOS Foundation. ${SITE.tagline.en}`,
    nav: "Footer menu",
    index: "Index",
    home: "Home",
    call: "Call for Speakers / Contact",
    collectors: "Co-organizers",
    set: "Colophon · set in Cormorant Garamond, EB Garamond, IBM Plex Mono & Noto Serif TC",
  },
} satisfies Record<Lang, unknown>;

export default function Footer({ lang }: { lang: Lang }) {
  const t = T[lang];
  const href = (p: string) => localePath(lang, p);
  return (
    <footer className="colophon">
      <div className="wrap">
        <div className="colo-grid">
          <div className="colo-brand">
            <p className="brand-line">
              <BrandMark size={36} />
              <span>
                <b>Ecotone</b>｜<span lang="zh-Hant-TW">{SITE.nameZh}</span>
              </span>
            </p>
            <p className="muted">{t.about}</p>
            <FollowCard compact lang={lang} />
          </div>
          <nav aria-label={t.nav}>
            <h2 className="mono colo-h">{t.index}</h2>
            <ul>
              <li>
                <Link href={href("/")}>
                  {t.home} <i>Frontispiece</i>
                </Link>
              </li>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={href(n.href)}>
                    {n.label[lang]} <i>{n.sub[lang]}</i>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={href(CALL_NAV.href)}>
                  {t.call} {lang === "zh" && <i>{CALL_NAV.sub.zh}</i>}
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="mono colo-h">{t.collectors}</h2>
            <ul>
              {CO_ORGANIZERS.map(({ key }) => (
                <li key={key}>
                  <OrgLink org={key} lang={lang}>
                    {ORGS[key].name[lang]}
                  </OrgLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="fine mono">
          <span>
            © {new Date().getFullYear()} Ecotone{lang === "zh" && " 兼容並續"} · Interdisciplinary Sustainability Forum
          </span>
          <span>{t.set}</span>
        </div>
      </div>
    </footer>
  );
}
