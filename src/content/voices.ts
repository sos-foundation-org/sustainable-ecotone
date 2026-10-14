import type { L10n } from "@/lib/i18n";

// ─── Diverse Voices 多元聲音 ─────────────────────────────────────────────────
// 影片上傳 YouTube 後把 youtubeId 填進去即可（例如 "dQw4w9WgXcQ"）；
// 或把 mp4 放在 public/voices/ 並填 src。兩者皆空 = 顯示「影片即將上線」。
// poster：影片封面（16:9，至少 1920×1080），放 public/voices/ 後填路徑。
// lat / lng：地圖上的位置；approx = 地點未定，僅為區域示意。tz：IANA 時區，用於顯示當地時間。
// name / role / prompt 寫成 { zh, en }；location 兩種語言共用（英文地名）。

export type Voice = {
  id: string;
  name: L10n; // 人名或「待邀請」
  role: L10n;
  location: string;
  prompt: L10n; // 回應的題目
  youtubeId?: string;
  src?: string;
  poster?: string;
  lat?: number;
  lng?: number;
  approx?: boolean;
  tz?: string;
};

export const VOICES: Voice[] = [
  {
    id: "v1",
    name: { zh: "多元聲音 01", en: "Voice 01" },
    role: { zh: "高中生", en: "High school student" },
    location: "Cambridge, MA · USA",
    lat: 42.37,
    lng: -71.11,
    tz: "America/New_York",
    prompt: { zh: "如果可以替 2050 年的自己問大人一個問題，你會問什麼？", en: "If you could ask the adults one question on behalf of your 2050 self, what would it be?" },
  },
  {
    id: "v2",
    name: { zh: "多元聲音 02", en: "Voice 02" },
    role: { zh: "護理師", en: "Nurse" },
    location: "Singapore",
    lat: 1.29,
    lng: 103.85,
    tz: "Asia/Singapore",
    prompt: { zh: "照顧一個人與照顧一片土地，有什麼相似的地方？", en: "What does caring for a person have in common with caring for the land?" },
  },
  {
    id: "v3",
    name: { zh: "多元聲音 03", en: "Voice 03" },
    role: { zh: "律師", en: "Lawyer" },
    location: "Europe",
    lat: 50,
    lng: 10,
    approx: true,
    prompt: { zh: "當一條河或一片森林需要有人替它說話，法律能做什麼？", en: "When a river or a forest needs someone to speak for it, what can the law do?" },
  },
  {
    id: "v4",
    name: { zh: "多元聲音 04", en: "Voice 04" },
    role: { zh: "原住民族部落工作者", en: "Indigenous community worker" },
    location: "Latin America",
    lat: -12,
    lng: -62,
    approx: true,
    prompt: { zh: "一件你從長輩那裡學到、課本沒教的事。", en: "One thing you learned from your elders that no textbook taught." },
  },
  {
    id: "v5",
    name: { zh: "多元聲音 05", en: "Voice 05" },
    role: { zh: "退休教師", en: "Retired teacher" },
    location: "Asia-Pacific",
    lat: -20,
    lng: 148,
    approx: true,
    prompt: { zh: "教了一輩子書，關於自然，你最想重新教一次的是什麼？", en: "After a lifetime of teaching, what about nature would you most like to teach again?" },
  },
  {
    id: "v6",
    name: { zh: "多元聲音 06", en: "Voice 06" },
    role: { zh: "漁民", en: "Fisher" },
    location: "Lanyu · Taiwan",
    lat: 22.05,
    lng: 121.55,
    prompt: { zh: "這些年，海變了嗎？你是從哪裡看出來的？", en: "Has the sea changed over the years? How can you tell?" },
  },
];
