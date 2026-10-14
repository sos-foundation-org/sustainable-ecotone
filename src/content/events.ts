// ─── Events ──────────────────────────────────────────────────────────────────
// 新增一場活動 = 在 EVENTS 加一筆。/events 列表與 /events/<slug> 頁面會自動產生。

export type EventStatus = "upcoming" | "past" | "planning";

export type ProgramItem = { time: string; title: string; detail: string };

export type ForumEvent = {
  slug: string;
  vol: number;
  title: string; // 英文主標
  titleZh: string;
  kind: string; // 活動形式，例如「系列演講」
  dateLabel: string; // 顯示用
  dateShort: string; // 卡片大字，例如 "2026.11"
  dateNote: string;
  isoDate?: string; // 確定後填 YYYY-MM-DD，用於排序 / 結構化資料
  venue: string;
  venueNote: string;
  format: string;
  formatNote: string;
  language: string;
  languageNote: string;
  status: EventStatus;
  statusLabel: string;
  summary: string;
  intro: string[];
  speakers: string[]; // speaker ids
  hasSecretSlide?: boolean;
  program: ProgramItem[];
};

export const EVENTS: ForumEvent[] = [
  {
    slug: "cross-pollination-2026",
    vol: 1,
    title: "Cross-Pollination",
    titleZh: "當學科開始互相授粉",
    kind: "系列演講",
    dateShort: "2026.11",
    dateLabel: "2026 年 11 月",
    dateNote: "確切日期確認中",
    venue: "地點確認中",
    venueNote: "臺北 · 實體為主",
    format: "系列演講 + 對談",
    formatNote: "約 3 小時",
    language: "中文為主",
    languageNote: "海外講者以英文進行",
    status: "upcoming",
    statusLabel: "Vol. 01 · 報名籌備中",
    summary:
      `五位講者、十種身份、五張不能事先曝光的 <span class="en">Secret Slide</span>。從氣候變遷、文學、地景建築到牙醫診間 — 看永續如何在學科之間授粉。`,
    intro: [
      `一朵花沒辦法自己結果，它需要一隻蜜蜂把別處的花粉帶過來。知識也一樣。這一系列演講邀請五位來自氣候科學、生物數位化、華文文學、景觀建築與牙醫臨床的講者，在同一個晚上，把各自學科的花粉帶到彼此身上。`,
    ],
    speakers: ["sun", "chan", "yen", "yuhan", "wang"],
    hasSecretSlide: true,
    program: [
      { time: "00:00", title: "開場 · Why Ecotone?", detail: "三方主辦單位致詞，介紹論壇與本場規則。" },
      { time: "00:15", title: "Talks I — 自然與氣候", detail: "孫烜駿 · 詹偉平。每場 20 分鐘，最後一張是 Secret Slide。" },
      { time: "01:00", title: "Talks II — 語言與地景", detail: "顏訥 · Yuhan（新加坡）。" },
      { time: "01:45", title: "Talk III — 診間裡的永續", detail: "王鼎涵。" },
      { time: "02:10", title: "海外聲音 · Voices from Abroad", detail: "播放海外夥伴的短片回應。" },
      { time: "02:25", title: "Cross-Pollination 對談", detail: "五位講者互相回應彼此的 Secret Slide，開放現場提問。" },
      { time: "03:00", title: "交流 · Mingle", detail: "花粉需要時間落地 — 留下來聊聊。" },
    ],
  },
];

export const eventBySlug = (slug: string) => EVENTS.find((e) => e.slug === slug);
export const upcomingEvents = () => EVENTS.filter((e) => e.status !== "past");
