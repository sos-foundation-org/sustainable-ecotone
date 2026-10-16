"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { switchPath } from "@/lib/i18n";
import { GEO_KEY, PREF_KEY, PROMPTED_KEY, savePref } from "@/lib/langPref";

// Free IP lookup, plain-text ISO country code ("TW"). No key; on any failure nothing is shown.
const GEO_URL = "https://ipapi.co/country/";
/** Visitors from here read the Chinese site; everyone else is offered the English one. */
const HOME = "TW";

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return "blocked";
  }
};

/**
 * 「We also have an English version」: a quiet card offered once, on Chinese pages,
 * to a first-time visitor whose IP is outside Taiwan. Not shown when a language has
 * already been chosen (PREF_KEY), after it was answered or dismissed (PROMPTED_KEY),
 * or when storage is blocked. Non-modal: it never takes focus; Escape dismisses it.
 */
export default function LangPrompt() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/lab") || read(PREF_KEY) || read(PROMPTED_KEY)) return;
    let alive = true;
    const offer = (cc: string) => {
      if (alive && cc !== HOME) setShow(true);
    };
    // let the page settle first; the card is never urgent
    const t = window.setTimeout(() => {
      const cached = read(GEO_KEY);
      if (cached) return offer(cached);
      fetch(GEO_URL, { cache: "no-store" })
        .then((r) => (r.ok ? r.text() : ""))
        .then((txt) => {
          const cc = txt.trim().toUpperCase();
          if (!/^[A-Z]{2}$/.test(cc)) return;
          try {
            localStorage.setItem(GEO_KEY, cc);
          } catch {}
          offer(cc);
        })
        .catch(() => {});
    }, 1200);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [pathname]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  function dismiss() {
    try {
      localStorage.setItem(PROMPTED_KEY, "1");
    } catch {}
    setShow(false);
  }

  if (!show) return null;
  return (
    <aside className="lang-prompt" role="dialog" aria-modal="false" aria-labelledby="lang-prompt-title" lang="en">
      <p className="lang-prompt-eyebrow mono">
        <span lang="zh-Hant-TW">中</span> → EN · English edition
      </p>
      <p id="lang-prompt-title" className="lang-prompt-title">
        We also have an English version.
      </p>
      <p className="lang-prompt-q">Switch to English?</p>
      <div className="lang-prompt-actions">
        <a className="btn lang-prompt-yes" href={switchPath(pathname, "en")} hrefLang="en" onClick={() => savePref("en")}>
          Switch to English <span className="mani" aria-hidden="true">☞</span>
        </a>
        <button
          type="button"
          className="text-btn"
          onClick={() => {
            savePref("zh");
            setShow(false);
          }}
        >
          Stay in <span lang="zh-Hant-TW">中文</span>
        </button>
      </div>
      <button type="button" className="lang-prompt-x" aria-label="Close" onClick={dismiss}>
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
}
