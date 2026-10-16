"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, CALL_NAV, SITE } from "@/content/site";
import { localePath, splitPath, type Lang } from "@/lib/i18n";
import BrandMark from "./BrandMark";
import LangSwitch from "./LangSwitch";

const T = {
  zh: { home: "Ecotone 兼容並續 首頁", menu: ["目錄", "Index"], close: ["關閉", "Close"], nav: "主選單" },
  en: { home: "Ecotone home", menu: ["Index", ""], close: ["Close", ""], nav: "Main menu" },
} satisfies Record<Lang, unknown>;

export default function Header({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const btn = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  const t = T[lang];
  const href = (p: string) => localePath(lang, p);

  // close the menu on navigation (derived state, no effect needed)
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // mobile menu: scroll lock, focus in on open / back on close, Escape, Tab trap
  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.classList.remove("menu-open");
      if (wasOpen.current) btn.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    root.classList.add("menu-open");
    nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !nav.current || !btn.current) return;
      const items = [btn.current, ...Array.from(nav.current.querySelectorAll<HTMLElement>("a"))];
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.classList.remove("menu-open");
    };
  }, [open]);

  const path = splitPath(pathname).path;
  const isActive = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));
  const [menuMain, menuSub] = open ? t.close : t.menu;

  return (
    <header className={`mast${open ? " is-open" : ""}`}>
      <div className="wrap mast-row">
        <Link className="brand" href={href("/")} aria-label={t.home}>
          <BrandMark />
          <span className="brand-text">
            <span className="brand-name">
              <b>Ecotone</b>
              <em aria-hidden="true">｜</em>
              <span className="brand-zh" lang="zh-Hant-TW">
                兼容並續
              </span>
            </span>
            <small>{SITE.subtitle[lang]}</small>
          </span>
        </Link>
        {/* the main conversion stays visible on small screens */}
        <Link className="mast-cta" href={href(CALL_NAV.href)} aria-current={isActive(CALL_NAV.href) ? "page" : undefined}>
          {CALL_NAV.label[lang]}
        </Link>
        <nav id="site-nav" ref={nav} className="nav" aria-label={t.nav}>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={href(n.href)} aria-current={isActive(n.href) ? "page" : undefined}>
                  {n.label[lang]}
                  <small>{n.sub[lang]}</small>
                </Link>
              </li>
            ))}
            <li>
              <Link className="nav-cta" href={href(CALL_NAV.href)} aria-current={isActive(CALL_NAV.href) ? "page" : undefined}>
                {CALL_NAV.label[lang]}
                <small>{CALL_NAV.sub[lang]}</small>
              </Link>
            </li>
          </ul>
        </nav>
        {/* after the nav on desktop; between the CTA and the menu button on phones (the nav is fixed there) */}
        <LangSwitch lang={lang} pathname={pathname} />
        <button ref={btn} className="menu-btn" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          {menuMain} {menuSub && <i>{menuSub}</i>}
        </button>
      </div>
    </header>
  );
}
