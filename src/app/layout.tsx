import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { SITE } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "ECOTONE 跨領域永續論壇｜NTU × NYCU × SOS Foundation",
    template: "%s｜ECOTONE 跨領域永續論壇",
  },
  description:
    "ECOTONE 是由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起的跨領域永續論壇。第一場：2026 年 11 月 Cross-Pollination 系列演講。",
  openGraph: {
    title: "ECOTONE 跨領域永續論壇",
    description: SITE.tagline + " NTU × NYCU × SOS Foundation。",
    type: "website",
    locale: "zh_TW",
    siteName: "ECOTONE",
  },
};

export const viewport: Viewport = {
  themeColor: "#081824",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- app router root layout applies to every page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@500;600;700&display=swap"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          跳到主要內容
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
