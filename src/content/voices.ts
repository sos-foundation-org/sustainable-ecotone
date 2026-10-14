// ─── Diverse Voices 多元聲音 ─────────────────────────────────────────────────
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
  { id: "v1", name: "多元聲音 01", role: "高中生", location: "Cambridge, MA · USA", lat: 42.37, lng: -71.11, tz: "America/New_York", prompt: "如果可以替 2050 年的自己問大人一個問題，你會問什麼？" },
  { id: "v2", name: "多元聲音 02", role: "護理師", location: "Singapore", lat: 1.29, lng: 103.85, tz: "Asia/Singapore", prompt: "照顧一個人與照顧一片土地，有什麼相似的地方？" },
  { id: "v3", name: "多元聲音 03", role: "律師", location: "Europe", lat: 50, lng: 10, approx: true, prompt: "當一條河或一片森林需要有人替它說話，法律能做什麼？" },
  { id: "v4", name: "多元聲音 04", role: "原住民族部落工作者", location: "Latin America", lat: -12, lng: -62, approx: true, prompt: "一件你從長輩那裡學到、課本沒教的事。" },
  { id: "v5", name: "多元聲音 05", role: "退休教師", location: "Asia-Pacific", lat: -20, lng: 148, approx: true, prompt: "教了一輩子書，關於自然，你最想重新教一次的是什麼？" },
  { id: "v6", name: "多元聲音 06", role: "漁民", location: "Lanyu · Taiwan", lat: 22.05, lng: 121.55, prompt: "這些年，海變了嗎？你是從哪裡看出來的？" },
];
