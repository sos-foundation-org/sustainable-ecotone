import type { L10n } from "@/lib/i18n";

// ─── Events ──────────────────────────────────────────────────────────────────
// 新增一場活動 = 在 EVENTS 加一筆（可翻譯欄位寫 { zh, en }）。中英文的 /events 列表、
// /events/<slug> 與 /en/events/<slug> 頁面、圖版編號（Pl. I, II…）與每一冊的年輪徽記
// （依 slug 生成）都會自動產生。

export type EventStatus = "upcoming" | "past" | "planning";

/** 可重複使用的活動圖版（見 src/components/plates/index.tsx） */
export type EventPlate = "mangrove";

export type ProgramItem = { time: string; title: L10n; detail: L10n };

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
  languageNote: L10n;
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
    slug: "cross-pollination-2026",
    vol: 1,
    title: "Cross-Pollination",
    subtitle: { zh: "當學科開始互相授粉", en: "When disciplines begin to pollinate one another" },
    kind: { zh: "系列演講", en: "Lecture series" },
    dateShort: "2026.11",
    dateLabel: { zh: "2026 年 11 月", en: "November 2026" },
    dateNote: { zh: "確切日期確認中", en: "Exact date to be confirmed" },
    venue: { zh: "地點確認中", en: "Venue to be confirmed" },
    venueNote: { zh: "臺北 · 實體為主", en: "Taipei · Mainly in person" },
    format: { zh: "系列演講 + 對談", en: "Talks + conversation" },
    formatNote: { zh: "約 3 小時", en: "About 3 hours" },
    language: { zh: "中文為主", en: "Mainly Mandarin" },
    languageNote: { zh: "部分講者以英文進行", en: "Some talks in English" },
    status: "upcoming",
    statusLabel: { zh: "Vol. 01 · 籌備中", en: "Vol. 01 · In preparation" },
    summary: {
      zh: `五位講者、十種身份。從氣候變遷、生物數位化、華文文學、地景建築到牙醫診間，看永續如何在學科之間 <span class="en">cross-pollinate</span>。`,
      en: `Five speakers, ten identities. From climate change, the digitization of nature, Sinophone literature and landscape architecture to the dentist’s chair: a look at how sustainability cross-pollinates between disciplines.`,
    },
    intro: {
      zh: [
        `一朵花沒辦法自己結果，它需要一隻蜜蜂把別處的花粉帶過來。知識也一樣。這一系列演講邀請五位來自氣候科學、生物數位化、華文文學、景觀建築與牙醫臨床的講者，在同一個晚上，把各自學科的花粉帶到彼此身上。`,
      ],
      en: [
        `A flower cannot set fruit on its own. It needs a bee to bring pollen from somewhere else, and knowledge is no different. This lecture series brings together five speakers from climate science, the digitization of nature, Sinophone literature, landscape architecture and clinical dentistry, to carry the pollen of their fields to one another over a single evening.`,
      ],
    },
    premise: {
      title: { zh: "不是五場演講，是一場授粉實驗。", en: "Not five talks, but one experiment in pollination." },
      body: {
        zh: [
          `一般的論壇是「輪流發言」：每個人講完自己的，聽眾各取所需。<span class="en">Cross-Pollination</span> 想做的不一樣：我們請每位講者在講自己專業的同時，也冒一點險，把手伸進別人的領域。`,
          `氣候科學家可能被文學研究者追問「你怎麼描述一個你看不到的未來？」；景觀建築師可能被牙醫問「你的設計怎麼算碳？」。我們相信，真正有意思的永續方案，都長在這些 <span class="en">awkward but productive</span> 的對話裡。`,
        ],
        en: [
          `Most forums take turns: each speaker says their piece, and the audience takes what it needs. <em>Cross-Pollination</em> works differently. We ask every speaker, while speaking from their own expertise, to take a small risk and reach into someone else’s field.`,
          `A climate scientist might be pressed by a literary scholar: “How do you describe a future you cannot see?” A landscape architect might be asked by a dentist: “How does your design account for carbon?” We believe the sustainability ideas really worth having grow out of exactly these conversations, <em>awkward but productive</em>.`,
        ],
      },
    },
    speakers: ["sun", "chan", "yen", "yuhan", "wang"],
    plate: "mangrove",
    attendance: {
      zh: "活動資訊即將公布。確切日期、地點與參加方式確認後，會在這裡更新。",
      en: "Date and venue to be announced. Once the exact date, venue and how to attend are confirmed, they will be posted here.",
    },
    program: [
      {
        time: "00:00",
        title: { zh: "開場 · Why Ecotone?", en: "Opening · Why Ecotone?" },
        detail: { zh: "三方主辦單位致詞，介紹論壇與本場規則。", en: "A welcome from the three co-organizers, introducing the forum and the evening’s ground rules." },
      },
      {
        time: "00:15",
        title: { zh: "Talks I · 自然與氣候", en: "Talks I · Nature and climate" },
        detail: { zh: "孫烜駿 · 詹偉平。每場約 20 分鐘。", en: "Syuan-Jyun Sun · Wei-Ping Chan. About 20 minutes each." },
      },
      {
        time: "01:00",
        title: { zh: "Talks II · 語言與地景", en: "Talks II · Language and landscape" },
        detail: { zh: "顏訥 · Yuhan（新加坡）。", en: "Yen Ne · Yuhan (Singapore)." },
      },
      {
        time: "01:45",
        title: { zh: "Talk III · 診間裡的永續", en: "Talk III · Sustainability in the clinic" },
        detail: { zh: "王鼎涵。", en: "Ting-Han Wang." },
      },
      {
        time: "02:10",
        title: { zh: "多元聲音 · Diverse Voices", en: "Diverse Voices" },
        detail: { zh: "播放來自不同世代、背景與地方的短片回應。", en: "Short films in response, from people of different generations, backgrounds and places." },
      },
      {
        time: "02:25",
        title: { zh: "Cross-Pollination 對談", en: "Cross-Pollination conversation" },
        detail: { zh: "五位講者互相回應彼此的講題，開放現場提問。", en: "The five speakers respond to one another’s talks, then open the floor to questions." },
      },
      {
        time: "03:00",
        title: { zh: "交流 · Mingle", en: "Mingle" },
        detail: { zh: "花粉需要時間落地，留下來聊聊。", en: "Pollen needs time to settle. Stay and talk." },
      },
    ],
  },
];

export const eventBySlug = (slug: string) => EVENTS.find((e) => e.slug === slug);
export const upcomingEvents = () => EVENTS.filter((e) => e.status !== "past");
export const pastEvents = () => EVENTS.filter((e) => e.status === "past");
