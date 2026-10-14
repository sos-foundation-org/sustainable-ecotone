// ─── Voices from Abroad ──────────────────────────────────────────────────────
// 影片上傳 YouTube 後把 youtubeId 填進去即可（例如 "dQw4w9WgXcQ"）；
// 或把 mp4 放在 public/voices/ 並填 src。兩者皆空 = 顯示「影片即將上線」。

export type Voice = {
  id: string;
  name: string; // 人名或「待邀請」
  role: string;
  location: string;
  prompt: string; // 回應的題目
  youtubeId?: string;
  src?: string;
};

export const VOICES: Voice[] = [
  { id: "v1", name: "海外講者 01", role: "研究者", location: "Cambridge, MA · USA", prompt: "你的學科裡，哪個問題最需要別的學科來回答？" },
  { id: "v2", name: "海外講者 02", role: "設計師", location: "Singapore", prompt: "如果城市本身就是一個 ecotone，它會長什麼樣子？" },
  { id: "v3", name: "海外講者 03", role: "實踐者", location: "Europe", prompt: "永續要怎麼做，才能本身也是永續的？" },
  { id: "v4", name: "海外講者 04", role: "保育工作者", location: "Latin America", prompt: "一個你在田野裡學到、課本沒教的事。" },
  { id: "v5", name: "海外講者 05", role: "研究者", location: "Asia-Pacific", prompt: "給臺灣聽眾的一張 Secret Slide。" },
  { id: "v6", name: "海外講者 06", role: "藝術家", location: "TBA", prompt: "如果永續是一種感覺，它是什麼感覺？" },
];
