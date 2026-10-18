// ─── /llms.txt and /llms-full.txt ────────────────────────────────────────────
// 給 AI 搜尋與問答引擎（ChatGPT、Claude、Perplexity、Gemini…）讀的純文字事實摘要（llmstxt.org 格式），
// 全部由 src/content 產生，內容改了這裡自動更新。路由：src/app/llms.txt/route.ts、src/app/llms-full.txt/route.ts。
// 雙語：英文為主、附中文名稱，讓用中文或英文提問的人都找得到。遵守 AI-README 4.x 的文案規則。

import { SITE, ORGS, CO_ORGANIZERS, PRINCIPLES, FAQ } from "@/content/site";
import { EVENTS, type ForumEvent } from "@/content/events";
import { speakerById, type Speaker } from "@/content/speakers";
import { pad2 } from "./engrave";
import { absUrl, plain } from "./jsonld";

const PAGES: { path: string; en: string; zh: string; note: string }[] = [
  { path: "/", en: "Home", zh: "首頁", note: "What Ecotone is, the latest volume, the atlas of disciplines" },
  { path: "/events", en: "Events", zh: "活動", note: "Every volume of the forum" },
  { path: "/speakers", en: "Past Speakers", zh: "歷屆講者", note: "Speakers of volumes already held" },
  { path: "/voices", en: "Diverse Voices", zh: "多元聲音", note: "Short films: people's hopes for interdisciplinary sustainability" },
  { path: "/about", en: "About", zh: "關於", note: "The name, the three co-founders, the principles" },
  { path: "/call-for-speakers", en: "Call for Speakers", zh: "成為講者", note: "How to apply to speak, and FAQ" },
];

const org = (k: keyof typeof ORGS) => (ORGS[k].name.zh === ORGS[k].name.en ? ORGS[k].name.en : `${ORGS[k].name.en} (${ORGS[k].name.zh})`);
const who = (s: Speaker) => (s.name.zh === s.name.en ? s.name.en : `${s.name.en} (${s.name.zh})`);
const speakersOf = (e: ForumEvent) => e.speakers.map(speakerById).filter((s): s is Speaker => !!s);

function eventBlock(e: ForumEvent, full: boolean) {
  const out = [
    `### Vol. ${pad2(e.vol)}: ${e.title}`,
    ``,
    `- Chinese subtitle: ${e.subtitle.zh}`,
    `- English subtitle: ${e.subtitle.en}`,
    `- Format: ${e.kind.en} (${e.kind.zh}); ${e.format.en}, ${e.formatNote.en.toLowerCase()}`,
    `- Language: ${e.language.en}`,
    `- When: ${e.dateLabel.en} (${e.dateNote.en})`,
    ...(e.sessions ?? []).map(
      (s) =>
        `- Session: ${s.name.en} (${s.name.zh}), ${s.date.en}${s.isoDate ? ` [${s.isoDate}]` : ""}, ${s.time?.en ?? ""}, ${s.venue.en}${s.venueNote ? `, ${s.venueNote.en}` : ""}${s.locality ? `, ${s.locality.en}, Taiwan` : ""}`,
    ),
    ...(e.registerUrl ? [`- Registration form: ${e.registerUrl}`] : []),
    `- Page: ${absUrl("en", `/events/${e.slug}`)} (中文：${absUrl("zh", `/events/${e.slug}`)})`,
    ``,
    plain(e.summary.en),
    ``,
    plain(e.summary.zh),
    ``,
    ...(full ? [...e.intro.en.map(plain), ``, ...e.intro.zh.map(plain), ``] : []),
    `Speakers:`,
    ...speakersOf(e).map((s) => `- ${who(s)}: ${s.short}${s.talk ? `. Talk or role: “${s.talk.en}” (${s.talk.zh})` : ""}`),
    ``,
    `Programme:`,
    ...e.program.map((p) => `- ${p.time ? `${p.time}: ` : ""}${p.title.en}${p.detail ? `. ${plain(p.detail.en)}` : ""}`),
    ``,
  ];
  return out.join("\n");
}

function speakerBlock(s: Speaker) {
  return [
    `### ${who(s)}`,
    ``,
    `- Affiliations: ${s.orgs.map(org).join("; ")}`,
    `- Identities: ${s.identities.map((i) => `${plain(i.title.en)} (${plain(i.title.zh)})`).join("; ")}`,
    ...(s.talk ? [`- Talk or role: ${s.talk.en} / ${s.talk.zh}`] : []),
    ...(s.links?.length ? [`- Website: ${s.links.map((l) => l.url).join(" ; ")}`] : []),
    ``,
    plain(s.bio.en),
    ``,
    plain(s.bio.zh),
    ``,
    ...(s.highlights?.length ? [`Highlights:`, ...s.highlights.map((h) => `- ${plain(h.en)}`), ``] : []),
    ...(s.publications?.length ? [`Selected works:`, ...s.publications.map((p) => `- ${plain(p.en)}`), ``] : []),
  ].join("\n");
}

export function llmsText(full = false): string {
  const events = [...EVENTS].sort((a, b) => b.vol - a.vol);
  const speakers = Array.from(new Map(events.flatMap(speakersOf).map((s) => [s.id, s])).values());
  return [
    `# Ecotone｜兼容並續 (Interdisciplinary Sustainability Forum 跨領域永續論壇)`,
    ``,
    `> Ecotone (Chinese name 兼容並續) is an interdisciplinary sustainability forum in Taiwan, co-founded by National Taiwan University (NTU, 國立臺灣大學), National Yang Ming Chiao Tung University (NYCU, 國立陽明交通大學) and SOS Foundation. ${SITE.tagline.en} Each volume brings speakers from very different fields into one conversation on a shared sustainability question.`,
    ``,
    `Ecotone 兼容並續是由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起的跨領域永續論壇。${SITE.tagline.zh}`,
    ``,
    `Key facts:`,
    `- Name: Ecotone｜兼容並續. Partners are written “NTU × NYCU × SOS”.`,
    `- The name: an ecotone is the transition zone where two ecosystems meet. 兼容並續 adapts the idiom 兼容並蓄 (“embrace everything”), replacing 蓄 with 續 (“continue”): embrace different disciplines, and keep sustainability going.`,
    `- Speakers are chosen for being interdisciplinary and connected to sustainability or nature.`,
    `- Languages: Mandarin Chinese and English. The website is bilingual: Chinese at ${absUrl("zh", "/")} and English at ${absUrl("en", "/")}.`,
    `- Speaker applications: ${SITE.speakerFormUrl}`,
    `- Follow future events: ${SITE.followFormUrl}`,
    ...(SITE.contactEmail ? [`- Contact: ${SITE.contactEmail}`] : []),
    ...(SITE.instagram ? [`- Instagram: ${SITE.instagram}`] : []),
    ...(SITE.profiles.length ? [`- Official pages: ${SITE.profiles.join(" ; ")}`] : []),
    ``,
    `## Co-founders 共同主辦`,
    ``,
    ...CO_ORGANIZERS.map((c) => `- ${org(c.key)}: ${c.detail.en}${ORGS[c.key].url ? ` ${ORGS[c.key].url}` : ""}`),
    ``,
    `## Events 活動`,
    ``,
    ...events.map((e) => eventBlock(e, full)),
    ...(full
      ? [
          `## Speakers 講者`,
          ``,
          ...speakers.map(speakerBlock),
          `## Principles 論壇原則`,
          ``,
          ...PRINCIPLES.map((p) => `- ${p.title.en} (${p.title.zh}): ${p.detail.en}`),
          ``,
          `## Diverse Voices 多元聲音`,
          ``,
          `Short films from people of different ages, genders, ethnicities, schooling, occupations and life experiences, each sharing what they hope interdisciplinary sustainability can become, do or change. ${absUrl("en", "/voices")}`,
          ``,
          `## Call for speakers FAQ 講者招募常見問題`,
          ``,
          ...FAQ.flatMap((f) => [`### ${f.q.en} / ${f.q.zh}`, ``, plain(f.a.en), ``, plain(f.a.zh), ``]),
        ]
      : []),
    `## Pages`,
    ``,
    ...PAGES.map((p) => `- [${p.en} ${p.zh}](${absUrl("en", p.path)}): ${p.note}. 中文版 ${absUrl("zh", p.path)}`),
    ``,
    ...(full ? [] : [`## Optional`, ``, `- [Full text: every speaker, programme, principles and FAQ](${SITE.url}/llms-full.txt)`, ``]),
  ].join("\n");
}
