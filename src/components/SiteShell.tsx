import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import RevealObserver from "./RevealObserver";
import EngraveDefs from "./EngraveDefs";
import { HTML_LANG, type Lang } from "@/lib/i18n";
import "@/app/globals.css";

// Chinese pages need the TC serif in full; English pages add EB Garamond for running text
// and keep Noto Serif TC only for the few brand glyphs (Google serves it in unicode-range slices).
const FONTS: Record<Lang, string> = {
  zh: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+TC:wght@200;400;600&display=swap",
  en: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+TC:wght@200;400;600&display=swap",
};

const SKIP: Record<Lang, string> = { zh: "跳到主要內容", en: "Skip to main content" };

/** The document shell shared by both root layouts: <html lang>, fonts, header, footer. */
export default function SiteShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={HTML_LANG[lang]} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- shared by the two root layouts, so <head> lives here */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS[lang]} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {SKIP[lang]}
        </a>
        <EngraveDefs />
        <Header lang={lang} />
        <main id="main">{children}</main>
        <Footer lang={lang} />
        <RevealObserver />
      </body>
    </html>
  );
}
