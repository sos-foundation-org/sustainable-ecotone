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
  prompt: L10n; // 邀請對方說出對跨領域永續期待的提問
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
    prompt: { zh: "到了 2050 年，你希望跨領域永續已經為你的世界改變了什麼？", en: "By 2050, what do you hope interdisciplinary sustainability will have changed in your world?" },
  },
  {
    id: "v2",
    name: { zh: "多元聲音 02", en: "Voice 02" },
    role: { zh: "護理師", en: "Nurse" },
    location: "Singapore",
    lat: 1.29,
    lng: 103.85,
    tz: "Asia/Singapore",
    prompt: { zh: "你希望跨領域永續，能為人的健康與照顧帶來什麼改變？", en: "What do you hope interdisciplinary sustainability can change about health and care?" },
  },
  {
    id: "v3",
    name: { zh: "多元聲音 03", en: "Voice 03" },
    role: { zh: "律師", en: "Lawyer" },
    location: "Europe",
    lat: 50,
    lng: 10,
    approx: true,
    prompt: { zh: "當法律與生態、科學坐上同一張桌子，你希望它們一起做到什麼？", en: "When law sits at the same table as ecology and science, what do you hope they can do together?" },
  },
  {
    id: "v4",
    name: { zh: "多元聲音 04", en: "Voice 04" },
    role: { zh: "原住民族部落工作者", en: "Indigenous community worker" },
    location: "Latin America",
    lat: -12,
    lng: -62,
    approx: true,
    prompt: { zh: "你希望跨領域永續，如何讓部落的知識被聽見、被傳下去？", en: "How do you hope interdisciplinary sustainability can help your community’s knowledge be heard and passed on?" },
  },
  {
    id: "v5",
    name: { zh: "多元聲音 05", en: "Voice 05" },
    role: { zh: "退休教師", en: "Retired teacher" },
    location: "Asia-Pacific",
    lat: -20,
    lng: 148,
    approx: true,
    prompt: { zh: "教了一輩子書，你希望下一代的課堂裡，跨領域永續是什麼模樣？", en: "After a lifetime of teaching, what do you hope interdisciplinary sustainability will look like in the next generation’s classrooms?" },
  },
  {
    id: "v6",
    name: { zh: "多元聲音 06", en: "Voice 06" },
    role: { zh: "漁民", en: "Fisher" },
    location: "Lanyu · Taiwan",
    lat: 22.05,
    lng: 121.55,
    prompt: { zh: "你希望跨領域永續，能為海，也為靠海生活的人帶來什麼改變？", en: "What do you hope interdisciplinary sustainability can change for the sea, and for those who live by it?" },
  },
];
