import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { EVENTS } from "@/content/events";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/events", "/speakers", "/voices", "/about", "/call-for-speakers"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...EVENTS.map((e) => ({ url: `${SITE.url}/events/${e.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
  ];
}
