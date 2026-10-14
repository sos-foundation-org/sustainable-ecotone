// ─── Voices from Abroad ──────────────────────────────────────────────────────
// 影片上傳 YouTube 後把 youtubeId 填進去即可（例如 "dQw4w9WgXcQ"）；
// 或把 mp4 放在 public/voices/ 並填 src。兩者皆空 = 顯示「影片即將上線」。
// poster：影片封面（16:9，至少 1920×1080），放 public/voices/ 後填路徑。
// lat / lng：地圖上的位置；approx = 地點未定，僅為區域示意。tz：IANA 時區，用於顯示當地時間。

export type Voice = {
  id: string;
  name: string; // 人名或「待邀請」
  role: string;
  location: string;
  prompt: string; // 回應的題目
  youtubeId?: string;
  src?: string;
  poster?: string;
  lat?: number;
  lng?: number;
  approx?: boolean;
  tz?: string;
};

export const VOICES: Voice[] = [
  { id: "v1", name: "海外講者 01", role: "研究者", location: "Cambridge, MA · USA", lat: 42.37, lng: -71.11, tz: "America/New_York", prompt: "你的學科裡，哪個問題最需要別的學科來回答？" },
  { id: "v2", name: "海外講者 02", role: "設計師", location: "Singapore", lat: 1.29, lng: 103.85, tz: "Asia/Singapore", prompt: "如果城市本身就是一個 ecotone，它會長什麼樣子？" },
  { id: "v3", name: "海外講者 03", role: "實踐者", location: "Europe", lat: 50, lng: 10, approx: true, prompt: "永續要怎麼做，才能本身也是永續的？" },
  { id: "v4", name: "海外講者 04", role: "保育工作者", location: "Latin America", lat: -12, lng: -62, approx: true, prompt: "一個你在田野裡學到、課本沒教的事。" },
  { id: "v5", name: "海外講者 05", role: "研究者", location: "Asia-Pacific", lat: -20, lng: 148, approx: true, prompt: "一個你想丟給臺灣聽眾、自己的學科回答不了的問題。" },
  { id: "v6", name: "海外講者 06", role: "藝術家", location: "TBA", prompt: "如果永續是一種感覺，它是什麼感覺？" },
];
