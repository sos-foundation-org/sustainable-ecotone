"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/content/site";
import BrandMark from "./BrandMark";

export default function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const close = () => setOpen(false);

  return (
    <header className={`site-header${solid ? " is-solid" : ""}`}>
      <div className="container nav">
        <Link className="brand" href="/" aria-label="ECOTONE 首頁" onClick={close}>
          <BrandMark />
          <span className="brand-text">
            <span className="en">ECOTONE</span>
            <small>跨領域永續論壇</small>
          </span>
        </Link>
        <button
          className="nav-toggle"
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul className="nav-links">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} aria-current={isActive(n.href) ? "page" : undefined} onClick={close}>
                {n.label}
              </Link>
            </li>
          ))}
          <li>
            <Link className="nav-cta" href="/contact" aria-current={isActive("/contact") ? "page" : undefined} onClick={close}>
              報名 / 聯絡
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
