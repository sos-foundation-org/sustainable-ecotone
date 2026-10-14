import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { HTML_LANG, OG_LOCALE, localePath, type Lang } from "./i18n";

export const SITE_NAME: Record<Lang, string> = {
  zh: "Ecotone｜兼容並續",
  en: "Ecotone · Interdisciplinary Sustainability Forum",
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
    openGraph: {
      title: SITE_NAME[lang],
      description: `${SITE.tagline[lang]} NTU × NYCU × SOS${zh ? "。" : "."}`,
      type: "website",
      locale: OG_LOCALE[lang],
      siteName: SITE_NAME[lang],
    },
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
    },
  };
}
