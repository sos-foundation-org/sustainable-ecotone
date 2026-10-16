import type { L10n } from "@/lib/i18n";

// ─── Events ──────────────────────────────────────────────────────────────────
// 新增一場活動 = 在 EVENTS 加一筆（可翻譯欄位寫 { zh, en }）。中英文的 /events 列表、
// /events/<slug> 與 /en/events/<slug> 頁面、圖版編號（Pl. I, II…）與每一冊的年輪徽記
// （依 slug 生成）都會自動產生。

export type EventStatus = "upcoming" | "past" | "planning";

/** 可重複使用的活動圖版（見 src/components/plates/index.tsx） */
export type EventPlate = "mangrove" | "urbanpark";

/** time：時間或編號（例如 "19:00"、"Talk 1"）；可省略 */
export type ProgramItem = { time?: string; title: L10n; detail?: L10n };

/**
 * 一個場次（觀眾報名）。報名表是「活動報名與通知」Google 表單（scripts/create-google-forms.gs 的
 * createParticipationForm），每一場是「報名場次」核取方塊的一個選項。
 */
export type Session = {
  id: string; // 小寫短代號，例如 "ntu"；同一冊內唯一（React key）
  /**
   * Google 表單「報名場次」的選項文字，必須一字不差。格式 `Vol. NN｜場名 Short name`。
   * ⚠ 表單上線後絕對不要改（回覆試算表與預填網址都靠它）；日期、教室不寫在這裡。
   */
  formLabel: string;
  /** 短場名，用在首頁「最新一冊」的場次列，例如「臺大場 / NTU session」 */
  name: L10n;
  venue: L10n; // 例如 國立臺灣大學 / National Taiwan University
  venueNote?: L10n; // 校區、教室
  date: L10n; // 顯示用；未定時寫「日期確認中」
  /** 日期確定後填 YYYY-MM-DD；有填時首頁場次列才會顯示日期 */
  isoDate?: string;
  time?: L10n;
  /** 這一場的預填報名網址（第一題 = 報名、已勾好本場）。留空 = 按鈕顯示「報名即將開放」 */
};

export type ForumEvent = {
  slug: string;
  vol: number;
  title: string; // 英文主標（兩種語言共用）
  subtitle: L10n; // 副標：中文頁顯示中文副標，英文頁顯示英文副標
  kind: L10n; // 活動形式，例如「系列演講」
  dateLabel: L10n; // 顯示用
  dateShort: string; // 卡片大字，例如 "2026.11"
  dateNote: L10n;
  isoDate?: string; // 確定後填 YYYY-MM-DD，用於排序 / 結構化資料
  venue: L10n;
  venueNote: L10n;
  format: L10n;
  formatNote: L10n;
  language: L10n;
  /** 語言補充說明；留空則不顯示 */
  languageNote: L10n;
  /** 講者區塊上方的語言標籤，例如「中文＋英文」 */
  talkLanguages?: L10n;
  status: EventStatus;
  statusLabel: L10n;
  summary: L10n;
  intro: L10n<string[]>;
  /** 本冊的主張：標題 + 段落（中文可含 <span class="en">…</span>，英文用 <em>…</em>） */
  premise?: { title: L10n; body: L10n<string[]> };
  speakers: string[]; // speaker ids
  /** 活動頁標題旁的銅版畫圖版（選填） */
  plate?: EventPlate;
  /** 參加方式說明，例如「活動資訊即將公布」 */
  attendance: L10n;
  program: ProgramItem[];
  /** 觀眾報名的場次。有填 = 活動頁出現報名區塊（#register）、首頁最新一冊出現「報名參加」；沒填 = 都不顯示 */
  sessions?: Session[];
  /**
   * 「全部場次都報名」的預填網址（本冊所有場次都已勾好）。
   * 不寫這個欄位 = 不顯示該按鈕；寫空字串 = 顯示「報名即將開放」。
   */
  /** 單一報名按鈕的網址：活動報名表單，第一題預填「報名參加活動」，場次由填表人在表單中勾選（可複選） */
  registerUrl?: string;
};

export const EVENTS: ForumEvent[] = [
  {
    slug: "sustainable-urbanization-rewilding-2026",
    vol: 1,
    title: "Sustainable Urbanization? Rewilding?",
    subtitle: { zh: "城市與自然，如何共享同一片土地", en: "How cities and nature might share the same ground" },
    kind: { zh: "系列演講", en: "Lecture series" },
    dateShort: "2026.11",
    dateLabel: { zh: "2026 年 11 月", en: "November 2026" },
    dateNote: { zh: "11/16 臺大 · 11/17 陽明交大", en: "16 Nov NTU · 17 Nov NYCU" },
    venue: { zh: "臺大公館校區 · 陽明交大新竹校區", en: "NTU Gongguan campus · NYCU Hsinchu campus" },
    venueNote: { zh: "臺大公館校區 · 陽明交大新竹校區", en: "NTU Gongguan campus · NYCU Hsinchu campus" },
    format: { zh: "系列演講 + 對談", en: "Talks + conversation" },
    formatNote: { zh: "每場約 2.5–3 小時", en: "About 2.5–3 hours per session" },
    language: { zh: "中文 + 英文", en: "Mandarin + English" },
    languageNote: { zh: "", en: "" },
    talkLanguages: { zh: "中文 & 英文", en: "Mandarin & English" },
    status: "upcoming",
    statusLabel: { zh: "Vol. 01 · 籌備中", en: "Vol. 01 · In preparation" },
    summary: {
      zh: `五位講者、十二種身份。從都市裡的昆蟲、夜間人工光、人類如何記錄自然，到再野化，最後一起對談，追問：城市能永續地成長嗎？還是該把一部分土地還給自然？`,
      en: `Five speakers, twelve identities. From insects in the city, artificial light at night and how humans have recorded nature, to rewilding, closing with a shared conversation, one question runs through the evening: can cities grow sustainably, or should some of the land go back to nature?`,
    },
    intro: {
      zh: [
        `城市還在長大，自然還在退後。永續的都市化真的可能嗎？還是我們該反過來，把一部分土地還給自然？這一系列演講邀請五位來自生態與氣候科學、生物數位化、華文文學、景觀建築與牙醫臨床的講者，從各自的學科出發，回應同一組問題。`,
      ],
      en: [
        `Cities keep growing and nature keeps retreating. Is sustainable urbanization really possible, or should we turn it around and give some of the land back to nature? This lecture series brings together five speakers from ecology and climate science, the digitization of nature, Sinophone literature, landscape architecture and clinical dentistry, each answering the same pair of questions from their own field.`,
      ],
    },
    premise: {
      title: { zh: "不是五場演講，是一場跨領域的對話。", en: "Not five talks, but one conversation across fields." },
      body: {
        zh: [
          `一般的論壇是「輪流發言」：每個人講完自己的，聽眾各取所需。Ecotone 想做的不一樣：我們請每位講者在講自己專業的同時，也冒一點險，把手伸進別人的領域。`,
          `氣候科學家可能被文學研究者追問「你怎麼描述一個你看不到的未來？」；景觀建築師可能被牙醫問「你的設計怎麼算碳？」。我們相信，真正有意思的永續方案，都長在這些 <span class="en">awkward but productive</span> 的對話裡。`,
        ],
        en: [
          `Most forums take turns: each speaker says their piece, and the audience takes what it needs. Ecotone works differently. We ask every speaker, while speaking from their own expertise, to take a small risk and reach into someone else’s field.`,
          `A climate scientist might be pressed by a literary scholar: “How do you describe a future you cannot see?” A landscape architect might be asked by a dentist: “How does your design account for carbon?” We believe the sustainability ideas really worth having grow out of exactly these conversations, <em>awkward but productive</em>.`,
        ],
      },
    },
    speakers: ["sun", "chan", "yen", "yuhan", "wang"],
    plate: "urbanpark",
    attendance: {
      zh: "分兩天、兩場舉辦：11/16（一）晚間在臺大公館校區，11/17（二）午後在陽明交大新竹校區。報名請見下方場次。",
      en: "Two sessions on two days: Monday 16 November (evening) at NTU’s Gongguan campus, and Tuesday 17 November (afternoon) at NYCU’s Hsinchu campus. Register below.",
    },
    sessions: [
      {
        id: "ntu",
        formLabel: "Vol. 01｜臺大場 NTU",
        name: { zh: "臺大場", en: "NTU session" },
        venue: { zh: "國立臺灣大學", en: "National Taiwan University" },
        venueNote: { zh: "公館校區 · 全球變遷中心 G202", en: "Gongguan campus · Global Change Research Center, Room G202" },
        date: { zh: "11/16（一）", en: "Mon 16 November" },
        isoDate: "2026-11-16",
        time: { zh: "晚間（詳細時間待訂）", en: "Evening (exact time to be confirmed)" },
      },
      {
        id: "nycu",
        formLabel: "Vol. 01｜陽明交大場 NYCU",
        name: { zh: "陽明交大場", en: "NYCU session" },
        venue: { zh: "國立陽明交通大學", en: "National Yang Ming Chiao Tung University" },
        venueNote: { zh: "新竹校區 · 場地確認中", en: "Hsinchu campus · Room to be confirmed" },
        date: { zh: "11/17（二）", en: "Tue 17 November" },
        isoDate: "2026-11-17",
        time: { zh: "午後（詳細時間待訂）", en: "Afternoon (exact time to be confirmed)" },
      },
    ],
    registerUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc_ElhgPRGpf13rsHtOIAW_YoQk3UJVx536lpKlorrKnPahMA/viewform?usp=pp_url&entry.1577784457=%E5%A0%B1%E5%90%8D%E5%8F%83%E5%8A%A0%E6%B4%BB%E5%8B%95%20Register%20for%20a%20session",
    program: [
      {
        title: { zh: "開場", en: "Opening" },
        detail: {
          zh: "詹偉平（Chan, Wei-Ping）為整場活動開場；孫烜駿（Sun, Syuan-Jyun）從都市化（urbanization）切入，帶出本冊主題。",
          en: "Chan, Wei-Ping (詹偉平) opens the event; Sun, Syuan-Jyun (孫烜駿) sets out the theme through the lens of urbanization.",
        },
      },
      {
        time: "Talk 1",
        title: { zh: "環境變遷下的育兒策略：從行為可塑性到環境適應", en: "Raising the Next Generation under Environmental Change: Behavioural Plasticity and Adaptation in Burying Beetles" },
        detail: { zh: "孫烜駿（Sun, Syuan-Jyun）", en: "Sun, Syuan-Jyun (孫烜駿)" },
      },
      {
        time: "Talk 2",
        title: { zh: "再現 50 年前的實驗，夜間光源對蛾類趨光性的影響", en: "Repeating a 50-year-old experiment: how light at night affects moths’ attraction to light" },
        detail: { zh: "詹偉平（Chan, Wei-Ping）", en: "Chan, Wei-Ping (詹偉平)" },
      },
      {
        title: { zh: "中場休息", en: "Break" },
      },
      {
        time: "Talk 3",
        title: { zh: "人類眼中的自然：理解、對待與記錄", en: "Nature in human eyes: understanding, treating and recording it" },
        detail: { zh: "顏訥（Yen, Na）", en: "Yen, Na (顏訥)" },
      },
      {
        time: "Talk 4",
        title: { zh: "野化：為自然讓出一點空間", en: "Rewilding: making a little room for nature" },
        detail: { zh: "吳煜涵（Goh, Yu Han）", en: "Goh, Yu Han (吳煜涵)" },
      },
      {
        time: "Panel",
        title: { zh: "綜合對談", en: "Closing conversation" },
        detail: {
          zh: "主持人：王鼎涵（Hank Wang）。講者與現場一起討論。",
          en: "Moderated by Hank Wang (王鼎涵). The speakers and the audience in conversation.",
        },
      },
    ],
  },
];

export const eventBySlug = (slug: string) => EVENTS.find((e) => e.slug === slug);
export const upcomingEvents = () => EVENTS.filter((e) => e.status !== "past");
export const pastEvents = () => EVENTS.filter((e) => e.status === "past");
