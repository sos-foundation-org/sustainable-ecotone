"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, CALL_NAV } from "@/content/site";
import BrandMark from "./BrandMark";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const btn = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`mast${open ? " is-open" : ""}`}>
      <div className="wrap mast-row">
        <Link className="brand" href="/" aria-label="Ecotone 兼容並續 首頁">
          <BrandMark />
          <span className="brand-text">
            <span className="brand-name">
              <b>Ecotone</b>
              <em aria-hidden="true">｜</em>
              <span>兼容並續</span>
            </span>
            <small>跨領域永續論壇</small>
          </span>
        </Link>
        {/* the main conversion stays visible on small screens */}
        <Link className="mast-cta" href={CALL_NAV.href} aria-current={isActive(CALL_NAV.href) ? "page" : undefined}>
          {CALL_NAV.label}
        </Link>
        <button ref={btn} className="menu-btn" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          {open ? "關閉" : "目錄"} <i>{open ? "Close" : "Index"}</i>
        </button>
        <nav id="site-nav" ref={nav} className="nav" aria-label="主選單">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={isActive(n.href) ? "page" : undefined}>
                  {n.label}
                  <small>{n.en}</small>
                </Link>
              </li>
            ))}
            <li>
              <Link className="nav-cta" href={CALL_NAV.href} aria-current={isActive(CALL_NAV.href) ? "page" : undefined}>
                {CALL_NAV.label}
                <small>{CALL_NAV.en}</small>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
