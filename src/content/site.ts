// ─── Site-wide settings ──────────────────────────────────────────────────────
// 改這裡就會全站生效。標記 PLACEHOLDER 的欄位為暫代，找到正式資料後替換。

export const SITE = {
  name: "Ecotone",
  nameZh: "兼容並續",
  subtitle: "跨領域永續論壇",
  tagline: "在學科的交界處，讓永續長出新的物種。",
  /** Production origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL on Vercel once the domain is decided. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sustainable-ecotone.vercel.app").replace(/\/+$/, ""),
  /** 講者招募表單（Google Form）網址。留空 = 按鈕顯示「表單即將開放」；填入後會在新分頁開啟。 */
  speakerFormUrl: "https://forms.gle/BBCC85ocLYbZUs5G8",
  /** 「追蹤未來活動」表單（第二個 Google Form，只收 e-mail）。留空 = 顯示「即將開放」；填入後在新分頁開啟。 */
  followFormUrl: "https://forms.gle/HaViaLhxS1P4wGwFA",
  /** 聯絡信箱。留空 = 顯示「待公布」 */
  contactEmail: "",
  instagram: "",
};

/** 「暫代」等草稿標記只在預覽環境顯示：設定 NEXT_PUBLIC_SHOW_DRAFTS=1 */
export const SHOW_DRAFTS = process.env.NEXT_PUBLIC_SHOW_DRAFTS === "1";

export type OrgKey = "ntu" | "nycu" | "ndhu" | "sos" | "salad" | "harvard" | "bionarr";

export type Org = {
  name: string;
  nameEn: string;
  url: string; // "" = 網址待補
  logo?: string;
  placeholder?: boolean; // logo / url 為暫代
};

export const ORGS: Record<OrgKey, Org> = {
  ntu: { name: "國立臺灣大學", nameEn: "National Taiwan University", url: "https://www.ntu.edu.tw/", logo: "/logos/ntu.svg" },
  nycu: { name: "國立陽明交通大學", nameEn: "National Yang Ming Chiao Tung University", url: "https://www.nycu.edu.tw/", logo: "/logos/nycu.svg" },
  ndhu: { name: "國立東華大學", nameEn: "National Dong Hwa University", url: "https://www.ndhu.edu.tw/", logo: "/logos/ndhu.svg" },
  sos: { name: "SOS Foundation", nameEn: "Sustainability Of Sustainability", url: "https://sos-commons.vercel.app/", logo: "/logos/sos.svg" },
  // PLACEHOLDER: 找不到 SALAD Dressing 官網與 logo，暫用 ArchDaily 頁面與自製佔位圖
  salad: { name: "SALAD Dressing", nameEn: "Landscape Architects, Singapore", url: "https://www.archdaily.com/professional/salad-dressing", logo: "/logos/salad-placeholder.svg", placeholder: true },
  harvard: { name: "Harvard University", nameEn: "Harvard University", url: "https://www.harvard.edu/" },
  // PLACEHOLDER: BioNarr 官網待補
  bionarr: { name: "BioNarr", nameEn: "BioNarr", url: "", placeholder: true },
};

/** 共同主辦：blurb 用於首頁，role / detail 用於關於頁 */
export const CO_ORGANIZERS: { key: OrgKey; blurb: string; role: string; detail: string }[] = [
  {
    key: "ntu",
    blurb: "綜合型研究大學，提供氣候變遷與生態研究的學術基礎。",
    role: "學術深度",
    detail: "從氣候變遷到生態學，帶來扎實的科學研究與跨院系的學術網絡。",
  },
  {
    key: "nycu",
    blurb: "橫跨醫學、生命科學與科技工程，帶來醫療與科技的永續實踐。",
    role: "醫療與科技",
    detail: "把醫學、生命科學與科技工程，這些最少被討論、卻影響巨大的場域，帶進永續對話。",
  },
  {
    key: "sos",
    blurb: "以藝術、自然數位化與開放知識基礎建設，讓永續被感受、被理解、被使用。",
    role: "跨界行動",
    detail: "以藝術、自然數位化與開放知識基礎建設串起學術與公眾，負責讓對話走出校園、持續發生。",
  },
];

/** 論壇原則（關於頁） */
export const PRINCIPLES = [
  { zh: "刻意混搭", en: "Mix on purpose", detail: "每一場的講者組合，至少橫跨三個以上的學科領域。" },
  { zh: "對話優先", en: "Dialogue over monologue", detail: "演講只是開場。真正的內容，發生在講者彼此回應的時候。" },
  { zh: "開放累積", en: "Open & cumulative", detail: "每一場的內容都會整理公開，成為下一場的起點；圖譜一冊一冊長大。" },
];

export const NAV = [
  { href: "/events", label: "活動", en: "Plates" },
  { href: "/speakers", label: "歷屆講者", en: "Past Speakers" },
  { href: "/voices", label: "多元聲音", en: "Atlas" },
  { href: "/about", label: "關於", en: "Colophon" },
];

/** 導覽列右側的主要行動：講者招募（/contact 會轉址到這裡） */
export const CALL_NAV = { href: "/call-for-speakers", label: "成為講者", en: "Call for Speakers" };

/** 講者所屬機構（Vol. 01 network），顯示於首頁與關於頁。 */
export const NETWORK: OrgKey[] = ["ntu", "nycu", "ndhu", "sos", "salad"];

/** 講者招募頁的常見問題 */
export const FAQ = [
  {
    q: "什麼樣的人適合申請？",
    a: "身上有不只一張標籤的人：同時在兩個（或更多）學科、產業或國家之間生活與工作的人。你不需要是某個領域最資深的人，但需要能讓「隔壁系」聽懂、並且被你的問題打動。",
  },
  { q: "一定要有多重身份嗎？", a: "不一定。如果你只有一個身份，但一直在思考它與其他學科的交界，也非常歡迎，請告訴我們那條邊界在哪裡。" },
  { q: "表單會問什麼？", a: "你的學科與身份（可以填好幾個）、你所在的地方、你想帶來的題目，以及你最想和哪一個學科對話。大約 10 分鐘可以完成。" },
  { q: "人不在臺灣，也可以申請嗎？", a: "可以。論壇以實體為主，但我們也透過「多元聲音」收錄短片；表單裡可以註明你偏好的參與方式。" },
  { q: "申請之後會怎麼進行？", a: "我們會依每一冊的主題與講者組合整理名單，合適時主動與你聯繫。詳細的時程與安排，將於表單開放時一併說明。" },
];

/** 講者表單會詢問的欄位（顯示在招募頁的空白標籤上） */
export const CALL_FIELDS = [
  { abbr: "I.", zh: "你的第一個學科 / 身份", en: "Your first field" },
  { abbr: "II.", zh: "你的第二個（第三個……）身份", en: "Your other identities" },
  { abbr: "LOC.", zh: "你工作與生活的地方", en: "Where you work" },
  { abbr: "ECO.", zh: "你與永續或自然的連結", en: "Your link to sustainability or nature" },
  { abbr: "TALK", zh: "你想帶來的題目", en: "The topic you would bring" },
];
