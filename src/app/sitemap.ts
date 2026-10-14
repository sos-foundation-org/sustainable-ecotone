import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { EVENTS } from "@/content/events";
import { HTML_LANG, LANGS, localePath } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/events", "/speakers", "/voices", "/about", "/call-for-speakers"].map((p) => ({ path: p, priority: p === "/" ? 1 : 0.7 }));
  const events = EVENTS.map((e) => ({ path: `/events/${e.slug}`, priority: 0.9 }));
  const url = (lang: (typeof LANGS)[number], path: string) => `${SITE.url}${localePath(lang, path) === "/" ? "" : localePath(lang, path)}`;
  // every page in both languages, each entry listing its hreflang alternates
  return [...pages, ...events].flatMap(({ path, priority }) =>
    LANGS.map((lang) => ({
      url: url(lang, path),
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [HTML_LANG[l], url(l, path)])) },
    })),
  );
}
