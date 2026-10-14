// ─── Events ──────────────────────────────────────────────────────────────────
// 新增一場活動 = 在 EVENTS 加一筆。/events 列表、/events/<slug> 頁面、
// 圖版編號（Pl. I, II…）與每一冊的年輪徽記（依 slug 生成）都會自動產生。

export type EventStatus = "upcoming" | "past" | "planning";

/** 可重複使用的活動圖版（見 src/components/plates/index.tsx） */
export type EventPlate = "mangrove";

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
  /** 本冊的主張：標題 + 段落（可含 <span class="en">…</span>） */
  premise?: { title: string; body: string[] };
  speakers: string[]; // speaker ids
  /** 活動頁標題旁的銅版畫圖版（選填） */
  plate?: EventPlate;
  /** 參加方式說明，例如「活動資訊即將公布」 */
  attendance: string;
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
    statusLabel: "Vol. 01 · 籌備中",
    summary:
      `五位講者、十種身份。從氣候變遷、生物數位化、華文文學、地景建築到牙醫診間 — 看永續如何在學科之間 <span class="en">cross-pollinate</span>。`,
    intro: [
      `一朵花沒辦法自己結果，它需要一隻蜜蜂把別處的花粉帶過來。知識也一樣。這一系列演講邀請五位來自氣候科學、生物數位化、華文文學、景觀建築與牙醫臨床的講者，在同一個晚上，把各自學科的花粉帶到彼此身上。`,
    ],
    premise: {
      title: "不是五場演講，是一場授粉實驗。",
      body: [
        `一般的論壇是「輪流發言」：每個人講完自己的，聽眾各取所需。<span class="en">Cross-Pollination</span> 想做的不一樣 — 我們請每位講者在講自己專業的同時，也冒一點險，把手伸進別人的領域。`,
        `氣候科學家可能被文學研究者追問「你怎麼描述一個你看不到的未來？」；景觀建築師可能被牙醫問「你的設計怎麼算碳？」。我們相信，真正有意思的永續方案，都長在這些 <span class="en">awkward but productive</span> 的對話裡。`,
      ],
    },
    speakers: ["sun", "chan", "yen", "yuhan", "wang"],
    plate: "mangrove",
    attendance: "活動資訊即將公布 — 確切日期、地點與參加方式確認後，會在這裡更新。",
    program: [
      { time: "00:00", title: "開場 · Why Ecotone?", detail: "三方主辦單位致詞，介紹論壇與本場規則。" },
      { time: "00:15", title: "Talks I — 自然與氣候", detail: "孫烜駿 · 詹偉平。每場約 20 分鐘。" },
      { time: "01:00", title: "Talks II — 語言與地景", detail: "顏訥 · Yuhan（新加坡）。" },
      { time: "01:45", title: "Talk III — 診間裡的永續", detail: "王鼎涵。" },
      { time: "02:10", title: "海外聲音 · Voices from Abroad", detail: "播放海外夥伴的短片回應。" },
      { time: "02:25", title: "Cross-Pollination 對談", detail: "五位講者互相回應彼此的講題，開放現場提問。" },
      { time: "03:00", title: "交流 · Mingle", detail: "花粉需要時間落地 — 留下來聊聊。" },
    ],
  },
];

export const eventBySlug = (slug: string) => EVENTS.find((e) => e.slug === slug);
export const upcomingEvents = () => EVENTS.filter((e) => e.status !== "past");
export const pastEvents = () => EVENTS.filter((e) => e.status === "past");
