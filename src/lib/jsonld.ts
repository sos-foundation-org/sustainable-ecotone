// ─── Structured data (schema.org JSON-LD) ────────────────────────────────────
// 給搜尋引擎與 AI 搜尋（Google、Bing、ChatGPT、Perplexity…）讀的結構化資料，全部由 src/content 產生，
// 不另外手寫事實。渲染：<JsonLd data={…} />（src/components/JsonLd.tsx）。
// 首頁、關於頁：組織 + 網站；活動頁：系列 + 每一場 Event + 講者 Person + 麵包屑；講者招募頁：FAQPage。

import { SITE, ORGS, CO_ORGANIZERS, FAQ, type OrgKey } from "@/content/site";
import type { ForumEvent } from "@/content/events";
import { speakerById, type Speaker } from "@/content/speakers";
import { disciplineByKey } from "@/content/disciplines";
import { HTML_LANG, localePath, type Lang } from "./i18n";
import { pad2 } from "./engrave";
import { OG_IMAGE } from "./meta";

type Node = Record<string, unknown>;

/** Absolute URL of a language-neutral path in one language. */
export const absUrl = (lang: Lang, path: string) => {
  const p = localePath(lang, path);
  return SITE.url + (p === "/" ? "/" : p);
};

/** Plain text from the repo's own light markup (<i>, <em>, <span class="en">). */
export const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;
const orgId = (k: OrgKey) => `${SITE.url}/#org-${k}`;
const personId = (id: string) => `${SITE.url}/#person-${id}`;
const ogImage = (lang: Lang) => SITE.url + OG_IMAGE[lang].url;

const UNIVERSITIES: OrgKey[] = ["ntu", "nycu", "ndhu", "harvard", "tohoku"];

function partnerOrg(k: OrgKey, lang: Lang): Node {
  const o = ORGS[k];
  const names = Array.from(new Set([o.name.zh, o.name.en, o.nameEn])).filter((n) => n !== o.name[lang]);
  return {
    "@type": UNIVERSITIES.includes(k) ? "CollegeOrUniversity" : "Organization",
    "@id": orgId(k),
    name: o.name[lang],
    ...(names.length ? { alternateName: names } : {}),
    ...(o.url ? { url: o.url } : {}),
  };
}

/** Ecotone itself, its three co-founders, and the website. On the home and about pages. */
export function siteGraph(lang: Lang): Node {
  const zh = lang === "zh";
  const sameAs = [SITE.instagram, ...SITE.profiles].filter(Boolean);
  const description = zh
    ? `Ecotone｜兼容並續是由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起的跨領域永續論壇。${SITE.tagline.zh}每一冊論壇邀請來自不同學科的講者，就同一組永續問題彼此對話。`
    : `Ecotone (兼容並續) is an interdisciplinary sustainability forum co-founded by National Taiwan University, National Yang Ming Chiao Tung University and SOS Foundation. ${SITE.tagline.en} Each volume brings speakers from different fields into one conversation on a shared sustainability question.`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: zh ? "Ecotone｜兼容並續" : "Ecotone",
        alternateName: ["Ecotone", "兼容並續", "Ecotone 兼容並續", "Ecotone Interdisciplinary Sustainability Forum", "跨領域永續論壇", "NTU × NYCU × SOS"],
        url: absUrl(lang, "/"),
        logo: `${SITE.url}/apple-icon.png`,
        image: ogImage(lang),
        description,
        slogan: SITE.tagline[lang],
        foundingDate: "2026",
        foundingLocation: { "@type": "Place", name: zh ? "臺灣" : "Taiwan" },
        areaServed: zh ? "臺灣" : "Taiwan",
        knowsAbout: zh
          ? ["跨領域研究", "永續發展", "都市生態", "再野化", "氣候變遷", "科學傳播"]
          : ["interdisciplinary research", "sustainability", "urban ecology", "rewilding", "climate change", "science communication"],
        founder: CO_ORGANIZERS.map((c) => ({ "@id": orgId(c.key) })),
        ...(sameAs.length ? { sameAs } : {}),
        ...(SITE.contactEmail ? { email: SITE.contactEmail } : {}),
      },
      ...CO_ORGANIZERS.map((c) => ({ ...partnerOrg(c.key, lang), description: c.blurb[lang] })),
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        name: zh ? "Ecotone｜兼容並續" : "Ecotone · Interdisciplinary Sustainability Forum",
        alternateName: ["Ecotone", "兼容並續"],
        url: absUrl(lang, "/"),
        inLanguage: [HTML_LANG.zh, HTML_LANG.en],
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** A speaker as a Person, or as an Organization with its members when the speaker is a team. */
function person(s: Speaker, lang: Lang): Node {
  const names = Array.from(new Set([s.name.zh, s.name.en, s.nameEn])).filter((n) => n !== s.name[lang]);
  const team = !!s.members?.length;
  return {
    "@type": team ? "Organization" : "Person",
    "@id": personId(s.id),
    name: s.name[lang],
    ...(names.length ? { alternateName: names } : {}),
    description: plain(s.bio[lang]),
    ...(s.photo ? { image: SITE.url + s.photo } : {}),
    ...(team
      ? {
          member: s.members!.map((m) => ({
            "@type": "Person",
            name: m.name[lang],
            alternateName: Array.from(new Set([m.name.zh, m.name.en, m.nameEn])).filter((n) => n !== m.name[lang]),
            ...(m.photo ? { image: SITE.url + m.photo } : {}),
            ...(m.role ? { jobTitle: m.role[lang] } : {}),
          })),
          ...(s.orgs.length ? { sameAs: s.orgs.map((k) => ORGS[k].url).filter(Boolean) } : {}),
        }
      : { affiliation: s.orgs.map((k) => partnerOrg(k, lang)) }),
    knowsAbout: s.disciplines.map((d) => disciplineByKey(d)?.name[lang]).filter(Boolean),
    ...(team ? {} : { hasOccupation: s.identities.map((i) => ({ "@type": "Occupation", name: plain(i.title[lang]) })) }),
    ...(s.links?.length ? { sameAs: s.links.map((l) => l.url) } : {}),
  };
}

/**
 * One volume: an EventSeries with each session as an Event (date, venue, city), the speakers
 * as performers, the co-founders as organizers, plus a breadcrumb trail.
 */
export function eventGraph(lang: Lang, e: ForumEvent): Node {
  const zh = lang === "zh";
  const url = absUrl(lang, `/events/${e.slug}`);
  const name = `Ecotone Vol. ${pad2(e.vol)}: ${e.title}`;
  const description = plain(e.summary[lang]);
  const speakers = e.speakers.map(speakerById).filter((s): s is Speaker => !!s);
  const performers = speakers.map((s) => ({ "@id": personId(s.id) }));
  const organizers = [{ "@id": ORG_ID }, ...CO_ORGANIZERS.map((c) => ({ "@id": orgId(c.key) }))];
  const dated = (e.sessions ?? []).filter((s) => s.isoDate);
  const sessions = dated.map((s) => ({
    "@type": "EducationEvent",
    "@id": `${url}#session-${s.id}`,
    name: `${name} · ${s.name[lang]}`,
    description,
    // Taiwan time; a bare date until the hours are confirmed
    startDate: s.start ? `${s.isoDate}T${s.start}:00+08:00` : s.isoDate,
    ...(s.end ? { endDate: `${s.isoDate}T${s.end}:00+08:00` } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: [HTML_LANG.zh, HTML_LANG.en],
    location: {
      "@type": "Place",
      name: [s.venue[lang], s.venueNote?.[lang]].filter(Boolean).join(zh ? " · " : ", "),
      address: {
        "@type": "PostalAddress",
        ...(s.locality ? { addressLocality: s.locality[lang] } : {}),
        addressCountry: "TW",
      },
    },
    image: [ogImage(lang)],
    url,
    organizer: organizers,
    performer: performers,
    superEvent: { "@id": `${url}#series` },
    ...(e.registerUrl ? { offers: { "@type": "Offer", url: e.registerUrl, availability: "https://schema.org/InStock" } } : {}),
  }));
  const dates = dated.map((s) => s.isoDate as string).sort();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EventSeries",
        "@id": `${url}#series`,
        name,
        alternateName: `${e.title} ${e.subtitle[lang]}`,
        description,
        url,
        image: [ogImage(lang)],
        ...(dates.length ? { startDate: dates[0], endDate: dates[dates.length - 1] } : {}),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        inLanguage: [HTML_LANG.zh, HTML_LANG.en],
        organizer: organizers,
        performer: performers,
        subEvent: sessions.map((s) => ({ "@id": s["@id"] })),
      },
      ...sessions,
      ...speakers.map((s) => person(s, lang)),
      { "@type": "Organization", "@id": ORG_ID, name: zh ? "Ecotone｜兼容並續" : "Ecotone", url: absUrl(lang, "/") },
      ...CO_ORGANIZERS.map((c) => partnerOrg(c.key, lang)),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ecotone", item: absUrl(lang, "/") },
          { "@type": "ListItem", position: 2, name: zh ? "活動" : "Events", item: absUrl(lang, "/events") },
          { "@type": "ListItem", position: 3, name: e.title, item: url },
        ],
      },
    ],
  };
}

/** The call-for-speakers FAQ as a FAQPage. */
export function faqGraph(lang: Lang): Node {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: HTML_LANG[lang],
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: plain(f.q[lang]),
      acceptedAnswer: { "@type": "Answer", text: plain(f.a[lang]) },
    })),
  };
}
