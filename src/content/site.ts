import type { L10n } from "@/lib/i18n";

// ─── Site-wide settings ──────────────────────────────────────────────────────
// 改這裡就會全站生效。標記 PLACEHOLDER 的欄位為暫代，找到正式資料後替換。
// 可翻譯欄位寫成 { zh, en }（見 src/lib/i18n.ts）。

export const SITE = {
  name: "Ecotone",
  nameZh: "兼容並續",
  subtitle: { zh: "跨領域永續論壇", en: "Interdisciplinary Sustainability Forum" } as L10n,
  tagline: { zh: "在學科的交界處，讓永續長出新的物種。", en: "Where disciplines meet, sustainability grows new species." } as L10n,
  /** Production origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL on Vercel once the domain is decided. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sustainable-ecotone.vercel.app").replace(/\/+$/, ""),
  /** 講者招募表單（Google Form，中英雙語，兩種語言共用）。留空 = 按鈕顯示「表單即將開放」；填入後會在新分頁開啟。 */
  speakerFormUrl: "https://forms.gle/BBCC85ocLYbZUs5G8",
  /** 「追蹤未來活動」表單（第二個 Google Form，只收 e-mail，兩種語言共用）。留空 = 顯示「即將開放」；填入後在新分頁開啟。 */
  followFormUrl: "https://forms.gle/HaViaLhxS1P4wGwFA",
  /** 聯絡信箱。留空 = 顯示「待公布」 */
  contactEmail: "",
  instagram: "",
};

/** 「暫代」等草稿標記只在預覽環境顯示：設定 NEXT_PUBLIC_SHOW_DRAFTS=1 */
export const SHOW_DRAFTS = process.env.NEXT_PUBLIC_SHOW_DRAFTS === "1";

export type OrgKey = "ntu" | "nycu" | "ndhu" | "sos" | "salad" | "harvard" | "bionarr";

export type Org = {
  /** display name in each language */
  name: L10n;
  /** English descriptor: the line under the name on Chinese pages, and the text on the collector stamp ring */
  nameEn: string;
  url: string; // "" = 網址待補
  logo?: string;
  placeholder?: boolean; // logo / url 為暫代
};

export const ORGS: Record<OrgKey, Org> = {
  ntu: { name: { zh: "國立臺灣大學", en: "National Taiwan University" }, nameEn: "National Taiwan University", url: "https://www.ntu.edu.tw/", logo: "/logos/ntu.svg" },
  nycu: { name: { zh: "國立陽明交通大學", en: "National Yang Ming Chiao Tung University" }, nameEn: "National Yang Ming Chiao Tung University", url: "https://www.nycu.edu.tw/", logo: "/logos/nycu.svg" },
  ndhu: { name: { zh: "國立東華大學", en: "National Dong Hwa University" }, nameEn: "National Dong Hwa University", url: "https://www.ndhu.edu.tw/", logo: "/logos/ndhu.svg" },
  sos: { name: { zh: "SOS Foundation", en: "SOS Foundation" }, nameEn: "Sustainability Of Sustainability", url: "https://sos-commons.vercel.app/", logo: "/logos/sos.svg" },
  // PLACEHOLDER: 找不到 SALAD Dressing 官網與 logo，暫用 ArchDaily 頁面與自製佔位圖
  salad: { name: { zh: "SALAD Dressing", en: "SALAD Dressing" }, nameEn: "Landscape Architects, Singapore", url: "https://www.archdaily.com/professional/salad-dressing", logo: "/logos/salad-placeholder.svg", placeholder: true },
  harvard: { name: { zh: "Harvard University", en: "Harvard University" }, nameEn: "Harvard University", url: "https://www.harvard.edu/" },
  // PLACEHOLDER: BioNarr 官網待補
  bionarr: { name: { zh: "BioNarr", en: "BioNarr" }, nameEn: "BioNarr", url: "", placeholder: true },
};

/** 共同主辦：blurb 用於首頁，role / detail 用於關於頁 */
export const CO_ORGANIZERS: { key: OrgKey; blurb: L10n; role: L10n; detail: L10n }[] = [
  {
    key: "ntu",
    blurb: {
      zh: "綜合型研究大學，提供氣候變遷與生態研究的學術基礎。",
      en: "A comprehensive research university, grounding the forum in climate and ecological science.",
    },
    role: { zh: "學術深度", en: "Academic depth" },
    detail: {
      zh: "從氣候變遷到生態學，帶來扎實的科學研究與跨院系的學術網絡。",
      en: "From climate change to ecology, it brings rigorous science and a research network that reaches across its colleges.",
    },
  },
  {
    key: "nycu",
    blurb: {
      zh: "橫跨醫學、生命科學與科技工程，帶來醫療與科技的永續實踐。",
      en: "Spanning medicine, the life sciences and engineering, it brings sustainability practice from healthcare and technology.",
    },
    role: { zh: "醫療與科技", en: "Medicine & technology" },
    detail: {
      zh: "把醫學、生命科學與科技工程，這些最少被討論、卻影響巨大的場域，帶進永續對話。",
      en: "It brings medicine, the life sciences and engineering, fields rarely discussed yet enormously consequential, into the conversation on sustainability.",
    },
  },
  {
    key: "sos",
    blurb: {
      zh: "以藝術、自然數位化與開放知識基礎建設，讓永續被感受、被理解、被使用。",
      en: "Through art, the digitization of nature and open knowledge infrastructure, it makes sustainability something to feel, understand and use.",
    },
    role: { zh: "跨界行動", en: "Action across borders" },
    detail: {
      zh: "以藝術、自然數位化與開放知識基礎建設串起學術與公眾，負責讓對話走出校園、持續發生。",
      en: "Linking academia and the public through art, nature digitization and open knowledge infrastructure, it carries the conversation beyond campus and keeps it going.",
    },
  },
];

/** 論壇原則（關於頁） */
export const PRINCIPLES: { title: L10n; detail: L10n }[] = [
  {
    title: { zh: "刻意混搭", en: "Mix on purpose" },
    detail: { zh: "每一場的講者組合，至少橫跨三個以上的學科領域。", en: "Every line-up spans at least three different fields." },
  },
  {
    title: { zh: "對話優先", en: "Dialogue over monologue" },
    detail: {
      zh: "演講只是開場。真正的內容，發生在講者彼此回應的時候。",
      en: "The talks are only the opening. The real substance comes when the speakers answer one another.",
    },
  },
  {
    title: { zh: "開放累積", en: "Open & cumulative" },
    detail: {
      zh: "每一場的內容都會整理公開，成為下一場的起點；圖譜一冊一冊長大。",
      en: "What each session produces is gathered and shared openly, and becomes the starting point for the next. The atlas grows volume by volume.",
    },
  },
];

/** 主選單。label = 主標，sub = 博物館式的小標（裝飾用，兩種語言皆保留）。 */
export const NAV: { href: string; label: L10n; sub: L10n }[] = [
  { href: "/events", label: { zh: "活動", en: "Events" }, sub: { zh: "Plates", en: "Plates" } },
  { href: "/speakers", label: { zh: "歷屆講者", en: "Past Speakers" }, sub: { zh: "Past Speakers", en: "Herbarium" } },
  { href: "/voices", label: { zh: "多元聲音", en: "Diverse Voices" }, sub: { zh: "Atlas", en: "Atlas" } },
  { href: "/about", label: { zh: "關於", en: "About" }, sub: { zh: "Colophon", en: "Colophon" } },
];

/** 導覽列右側的主要行動：講者招募（/contact 會轉址到這裡） */
export const CALL_NAV = {
  href: "/call-for-speakers",
  label: { zh: "成為講者", en: "Become a speaker" } as L10n,
  sub: { zh: "Call for Speakers", en: "Call for Speakers" } as L10n,
};

// 「歷屆講者單位」不再手動列出：由 events.ts 所有講者的 orgs 自動整理（見 src/components/Partners.tsx）。

/** 講者招募頁的常見問題 */
export const FAQ: { q: L10n; a: L10n }[] = [
  {
    q: { zh: "什麼樣的人適合申請？", en: "Who should apply?" },
    a: {
      zh: "身上有不只一張標籤的人：同時在兩個（或更多）學科、產業或國家之間生活與工作的人。你不需要是某個領域最資深的人，但需要能讓「隔壁系」聽懂、並且被你的問題打動。",
      en: "People who carry more than one label: who live and work between two (or more) disciplines, industries or countries. You don’t need to be the most senior person in your field, but you do need to make yourself understood by the department next door, and to move them with your questions.",
    },
  },
  {
    q: { zh: "一定要有多重身份嗎？", en: "Do I need several identities?" },
    a: {
      zh: "不一定。如果你只有一個身份，但一直在思考它與其他學科的交界，也非常歡迎，請告訴我們那條邊界在哪裡。",
      en: "Not necessarily. If you have one identity but keep thinking about where it meets other disciplines, you are very welcome too. Tell us where that border lies.",
    },
  },
  {
    q: { zh: "表單會問什麼？", en: "What does the form ask?" },
    a: {
      zh: "你的學科與身份（可以填好幾個）、你所在的地方、你與永續或自然的連結、你想帶來的題目。表單為中英雙語，大約 5 分鐘可以完成。",
      en: "Your disciplines and identities (list as many as you like), where you are based, how your work connects to sustainability or nature, and the topic you would bring. The form is bilingual and takes about 5 minutes.",
    },
  },
  {
    q: { zh: "人不在臺灣，也可以申請嗎？", en: "Can I apply from outside Taiwan?" },
    a: {
      zh: "可以。論壇以實體為主，但我們也透過「多元聲音」收錄短片；表單裡可以註明你偏好的參與方式。",
      en: "Yes. The forum is mainly held in person, but we also collect short films through Diverse Voices. You can tell us in the form how you would prefer to take part.",
    },
  },
  {
    q: { zh: "申請之後會怎麼進行？", en: "What happens after I apply?" },
    a: {
      zh: "我們會依每一冊的主題與講者組合整理名單，合適時主動與你聯繫。詳細的時程與安排，將於表單開放時一併說明。",
      en: "We draw up a shortlist around each volume’s theme and line-up, and get in touch when there is a good fit. Timelines and arrangements will be explained in detail when the form opens.",
    },
  },
];

/** 講者表單會詢問的欄位（顯示在招募頁的空白標籤上）。中文頁顯示 zh 加上英文小字，英文頁只顯示 en。 */
export const CALL_FIELDS: { abbr: string; label: L10n }[] = [
  { abbr: "I.", label: { zh: "你的第一個學科 / 身份", en: "Your first field" } },
  { abbr: "II.", label: { zh: "你的第二個（第三個……）身份", en: "Your other identities" } },
  { abbr: "LOC.", label: { zh: "你工作與生活的地方", en: "Where you work" } },
  { abbr: "ECO.", label: { zh: "你與永續或自然的連結", en: "Your link to sustainability or nature" } },
  { abbr: "TALK", label: { zh: "你想帶來的題目", en: "The topic you would bring" } },
];
