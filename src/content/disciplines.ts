import type { L10n } from "@/lib/i18n";

// ─── Disciplines ─────────────────────────────────────────────────────────────
// 每個學科用一種「製圖線型」表示（像地圖圖例分辨道路與河流），而不是用顏色。
// pattern 對應 EngraveDefs 裡的 <pattern id="lt-<key>">。
// 新增學科：在這裡加一筆（名稱與線型都要有 zh / en），並在 src/components/EngraveDefs.tsx 補上同名 pattern。

export type DisciplineKey =
  | "literature"
  | "history"
  | "finance"
  | "law"
  | "politics"
  | "ee"
  | "hightech"
  | "mech"
  | "agriculture"
  | "fisheries"
  | "medicine"
  | "ecology"
  | "design";

export type Discipline = {
  key: DisciplineKey;
  name: L10n;
  code: string; // 兩字母代碼，像元素符號
  linetype: L10n; // 線型名稱
};

export const DISCIPLINES: Discipline[] = [
  { key: "literature", name: { zh: "文學", en: "Literature" }, code: "Lt", linetype: { zh: "稿紙格", en: "manuscript grid" } },
  { key: "history", name: { zh: "歷史", en: "History" }, code: "Hs", linetype: { zh: "年輪", en: "tree rings" } },
  { key: "finance", name: { zh: "金融", en: "Finance" }, code: "Fn", linetype: { zh: "K 線", en: "candlesticks" } },
  { key: "law", name: { zh: "法律", en: "Law" }, code: "Lw", linetype: { zh: "地籍界線", en: "cadastral boundary" } },
  { key: "politics", name: { zh: "政治", en: "Politics" }, code: "Pl", linetype: { zh: "國界線", en: "national border" } },
  { key: "ee", name: { zh: "電機", en: "Electrical Eng." }, code: "Ee", linetype: { zh: "走線焊點", en: "circuit traces" } },
  { key: "hightech", name: { zh: "科技", en: "Technology" }, code: "Tc", linetype: { zh: "晶圓格", en: "wafer grid" } },
  { key: "mech", name: { zh: "機械", en: "Mechanical Eng." }, code: "Me", linetype: { zh: "剖面線", en: "section hatching" } },
  { key: "agriculture", name: { zh: "農業", en: "Agriculture" }, code: "Ag", linetype: { zh: "犁溝", en: "plough furrows" } },
  { key: "fisheries", name: { zh: "漁業", en: "Fisheries" }, code: "Fs", linetype: { zh: "網目", en: "net mesh" } },
  { key: "medicine", name: { zh: "醫學", en: "Medicine" }, code: "Md", linetype: { zh: "心電圖", en: "ECG trace" } },
  { key: "ecology", name: { zh: "生態·氣候", en: "Ecology & Climate" }, code: "Ec", linetype: { zh: "等高線", en: "contour lines" } },
  { key: "design", name: { zh: "景觀設計", en: "Landscape Design" }, code: "Ds", linetype: { zh: "樹冠平面", en: "canopy plan" } },
];

export const disciplineByKey = (k: DisciplineKey) => DISCIPLINES.find((d) => d.key === k)!;
