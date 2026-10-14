// ─── Site-wide settings ──────────────────────────────────────────────────────
// 改這裡就會全站生效。標記 PLACEHOLDER 的欄位為暫代，找到正式資料後替換。

export const SITE = {
  name: "Ecotone",
  nameZh: "兼容並續",
  subtitle: "跨領域永續論壇",
  tagline: "在學科的交界處，讓永續長出新的物種。",
  /** Production origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL on Vercel once the domain is decided. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sustainable-ecotone.vercel.app").replace(/\/+$/, ""),
  /** 報名表單網址（Google Form / Accupass 等）。留空 = 按鈕顯示「報名即將開放」 */
  registrationUrl: "",
  /** 聯絡信箱。留空 = 顯示「待公布」 */
  contactEmail: "",
  instagram: "",
};

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

/** 共同主辦 */
export const CO_ORGANIZERS: { key: OrgKey; blurb: string }[] = [
  { key: "ntu", blurb: "綜合型研究大學，提供氣候變遷與生態研究的學術基礎。" },
  { key: "nycu", blurb: "橫跨醫學、生命科學與科技工程，帶來醫療與科技的永續實踐。" },
  { key: "sos", blurb: "以藝術、自然數位化與開放知識基礎建設，讓永續被感受、被理解、被使用。" },
];

export const NAV = [
  { href: "/", label: "首頁", en: "Home" },
  { href: "/events", label: "活動", en: "Events" },
  { href: "/speakers", label: "講者", en: "Speakers" },
  { href: "/voices", label: "海外聲音", en: "Voices" },
  { href: "/about", label: "關於我們", en: "About" },
];
