import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import EngraveDefs from "@/components/EngraveDefs";
import { SITE } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Ecotone｜兼容並續 · NTU × NYCU × SOS 跨領域永續論壇",
    template: "%s｜Ecotone 兼容並續",
  },
  description:
    "Ecotone 兼容並續是由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起的跨領域永續論壇：在學科的交界處，讓永續長出新的物種。第一場：2026 年 11 月 Cross-Pollination 系列演講。",
  openGraph: {
    title: "Ecotone｜兼容並續",
    description: SITE.tagline + " NTU × NYCU × SOS Foundation。",
    type: "website",
    locale: "zh_TW",
    siteName: "Ecotone｜兼容並續",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2ECDF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- app router root layout applies to every page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+TC:wght@200;400;600&display=swap"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          跳到主要內容
        </a>
        <EngraveDefs />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
