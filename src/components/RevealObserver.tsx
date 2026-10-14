"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds .is-in to every .reveal element as it scrolls into view. Re-scans on route change.
 * Anything already on screen is shown immediately, and arriving via a jump link
 * (a #hash on load, a hashchange, or an in-page anchor click) switches the
 * reveal off for the page, so the target is never blank on arrival.
 */
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const showAll = () => root.classList.add("reveal-off");
    if (window.location.hash) showAll();
    else root.classList.remove("reveal-off");

    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    // already in the viewport: show now, without waiting for the observer
    const vh = window.innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("is-in");
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -4% 0px" },
    );
    els.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (a && a.pathname === window.location.pathname && a.hash) showAll();
    };
    window.addEventListener("hashchange", showAll);
    document.addEventListener("click", onClick, true);
    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", showAll);
      document.removeEventListener("click", onClick, true);
    };
  }, [pathname]);
  return null;
}
