import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { HTML_LANG, OG_LOCALE, localePath, type Lang } from "./i18n";

export const SITE_NAME: Record<Lang, string> = {
  zh: "Ecotone｜兼容並續",
  en: "Ecotone · Interdisciplinary Sustainability Forum",
};

/** The 1200×630 share card for each language (public/og/; regenerate with sharp, see AI-README 8.10). */
export const OG_IMAGE: Record<Lang, { url: string; width: number; height: number; alt: string }> = {
  zh: { url: "/og/ecotone-zh.png", width: 1200, height: 630, alt: "Ecotone｜兼容並續：NTU × NYCU × SOS 跨領域永續論壇。在學科的交界處，讓永續長出新的物種。" },
  en: { url: "/og/ecotone-en.png", width: 1200, height: 630, alt: "Ecotone (兼容並續): Interdisciplinary Sustainability Forum by NTU × NYCU × SOS. Where disciplines meet, sustainability grows new species." },
};

const KEYWORDS: Record<Lang, string[]> = {
  zh: ["Ecotone", "兼容並續", "跨領域永續論壇", "跨領域", "永續", "永續發展", "論壇", "系列演講", "國立臺灣大學", "臺大", "國立陽明交通大學", "陽明交大", "SOS Foundation", "都市生態", "再野化", "氣候變遷"],
  en: ["Ecotone", "兼容並續", "interdisciplinary sustainability forum", "interdisciplinary", "sustainability", "forum", "lecture series", "Taiwan", "National Taiwan University", "NTU", "National Yang Ming Chiao Tung University", "NYCU", "SOS Foundation", "urban ecology", "rewilding", "climate change"],
};

/** Defaults for each root layout; pages override title, description, alternates and Open Graph. */
export function rootMetadata(lang: Lang): Metadata {
  const zh = lang === "zh";
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: zh ? "Ecotone｜兼容並續 · NTU × NYCU × SOS 跨領域永續論壇" : "Ecotone · Interdisciplinary Sustainability Forum · NTU × NYCU × SOS",
      template: zh ? "%s｜Ecotone 兼容並續" : "%s · Ecotone",
    },
    description: `${SITE.tagline[lang]} NTU × NYCU × SOS${zh ? "。" : "."}`,
    applicationName: SITE_NAME[lang],
    authors: [{ name: zh ? "Ecotone｜兼容並續" : "Ecotone", url: localePath(lang, "/") }],
    publisher: "NTU × NYCU × SOS",
    category: zh ? "跨領域永續論壇" : "Interdisciplinary sustainability forum",
    keywords: KEYWORDS[lang],
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      title: SITE_NAME[lang],
      description: `${SITE.tagline[lang]} NTU × NYCU × SOS${zh ? "。" : "."}`,
      type: "website",
      locale: OG_LOCALE[lang],
      siteName: SITE_NAME[lang],
      images: [OG_IMAGE[lang]],
    },
    twitter: { card: "summary_large_image", images: [OG_IMAGE[lang]] },
  };
}

/**
 * Per-page metadata for one language: title, description, canonical URL,
 * hreflang alternates (zh-Hant-TW / en / x-default) and Open Graph locale.
 * `path` is the language-neutral path, e.g. "/voices".
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
  ogTitle,
  absoluteTitle = false,
}: {
  lang: Lang;
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: localePath(lang, path),
      languages: {
        [HTML_LANG.zh]: localePath("zh", path),
        [HTML_LANG.en]: localePath("en", path),
        "x-default": localePath("zh", path),
      },
    },
    openGraph: {
      title: ogTitle ?? title,
      description,
      url: localePath(lang, path),
      type: "website",
      siteName: SITE_NAME[lang],
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[lang === "zh" ? "en" : "zh"],
      images: [OG_IMAGE[lang]],
    },
    twitter: { card: "summary_large_image", title: ogTitle ?? title, description, images: [OG_IMAGE[lang]] },
  };
}
