import type { L10n } from "@/lib/i18n";

// ─── Events ──────────────────────────────────────────────────────────────────
// 新增一場活動 = 在 EVENTS 加一筆（可翻譯欄位寫 { zh, en }）。中英文的 /events 列表、
// /events/<slug> 與 /en/events/<slug> 頁面、圖版編號（Pl. I, II…）與每一冊的年輪徽記
// （依 slug 生成）都會自動產生。

export type EventStatus = "upcoming" | "past" | "planning";

/** 可重複使用的活動圖版（見 src/components/plates/index.tsx） */
export type EventPlate = "mangrove" | "urbanpark";

/** time：時間或編號（例如 "19:00"、"Talk 1"）；可省略 */
export type ProgramItem = { time?: string; title: L10n; detail: L10n };

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
    dateNote: { zh: "確切日期確認中", en: "Exact date to be confirmed" },
    venue: { zh: "地點確認中", en: "Venue to be confirmed" },
    venueNote: { zh: "臺北 · 實體為主", en: "Taipei · Mainly in person" },
    format: { zh: "系列演講 + 對談", en: "Talks + conversation" },
    formatNote: { zh: "約 3 小時", en: "About 3 hours" },
    language: { zh: "中文 + 英文", en: "Mandarin + English" },
    languageNote: { zh: "", en: "" },
    talkLanguages: { zh: "中文 & 英文", en: "Mandarin & English" },
    status: "upcoming",
    statusLabel: { zh: "Vol. 01 · 籌備中", en: "Vol. 01 · In preparation" },
    summary: {
      zh: `五位講者、十二種身份。從都市裡的昆蟲、夜間人工光、人類如何記錄自然，到再野化與科技新創，一起追問：城市能永續地成長嗎？還是該把一部分土地還給自然？`,
      en: `Five speakers, twelve identities. From insects in the city, artificial light at night and how humans have recorded nature, to rewilding and technology startups, one question runs through the evening: can cities grow sustainably, or should some of the land go back to nature?`,
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
      zh: "活動資訊即將公布。確切日期、地點與參加方式確認後，會在這裡更新。",
      en: "Date and venue to be announced. Once the exact date, venue and how to attend are confirmed, they will be posted here.",
    },
    program: [
      {
        title: { zh: "開場", en: "Opening" },
        detail: { zh: "三方主辦單位致詞，介紹論壇。", en: "A welcome from the three co-organizers and an introduction to the forum." },
      },
      {
        time: "Talk 1",
        title: { zh: "都市化及其對自然的影響", en: "Urbanization and its impacts on nature" },
        detail: { zh: "孫烜駿（Sun, Syuan-Jyun）", en: "Sun, Syuan-Jyun (孫烜駿)" },
      },
      {
        time: "Talk 2",
        title: { zh: "夜間人工光（ALAN），以及橫跨城鄉地景的研究", en: "Artificial light at night (ALAN) and conducting research across urban-rural landscapes" },
        detail: { zh: "詹偉平（Chan, Wei-Ping）", en: "Chan, Wei-Ping (詹偉平)" },
      },
      {
        time: "Talk 3",
        title: { zh: "人類如何觀看、對待並記錄自然", en: "How humans have viewed, interacted with, and documented nature" },
        detail: { zh: "顏訥（Yen, Na）", en: "Yen, Na (顏訥)" },
      },
      {
        time: "Talk 4",
        title: { zh: "再野化：和平地把人類的領域還給自然", en: "Rewilding: peacefully giving human territory back to nature" },
        detail: { zh: "吳煜涵（Goh, Yu Han）", en: "Goh, Yu Han (吳煜涵)" },
      },
      {
        time: "Talk 5",
        title: { zh: "科技、自然與永續：新興新創", en: "Technology, nature, and sustainability: emerging startups" },
        detail: {
          zh: "王鼎涵（Hank Wang）。分享循環材料與永續校園行動的經驗。",
          en: "Hank Wang (王鼎涵). Sharing experiences with circular materials and sustainable campus initiatives.",
        },
      },
      {
        title: { zh: "綜合對談", en: "Closing conversation" },
        detail: { zh: "五位講者互相回應彼此的講題，開放現場提問。", en: "The five speakers respond to one another’s talks, then open the floor to questions." },
      },
    ],
  },
];

export const eventBySlug = (slug: string) => EVENTS.find((e) => e.slug === slug);
export const upcomingEvents = () => EVENTS.filter((e) => e.status !== "past");
export const pastEvents = () => EVENTS.filter((e) => e.status === "past");
