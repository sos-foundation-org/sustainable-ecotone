// ─── Disciplines ─────────────────────────────────────────────────────────────
// 每個學科用一種「製圖線型」表示（像地圖圖例分辨道路與河流），而不是用顏色。
// pattern 對應 EngraveDefs 裡的 <pattern id="lt-<key>">。
// 新增學科：在這裡加一筆，並在 src/components/EngraveDefs.tsx 補上同名 pattern。

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
  zh: string;
  en: string;
  code: string; // 兩字母代碼，像元素符號
  linetype: string; // 線型名稱
};

export const DISCIPLINES: Discipline[] = [
  { key: "literature", zh: "文學", en: "Literature", code: "Lt", linetype: "稿紙格" },
  { key: "history", zh: "歷史", en: "History", code: "Hs", linetype: "年輪" },
  { key: "finance", zh: "金融", en: "Finance", code: "Fn", linetype: "K 線" },
  { key: "law", zh: "法律", en: "Law", code: "Lw", linetype: "地籍界線" },
  { key: "politics", zh: "政治", en: "Politics", code: "Pl", linetype: "國界線" },
  { key: "ee", zh: "電機", en: "Electrical Eng.", code: "Ee", linetype: "走線焊點" },
  { key: "hightech", zh: "高科技", en: "High-tech", code: "Ht", linetype: "晶圓格" },
  { key: "mech", zh: "機械", en: "Mechanical Eng.", code: "Me", linetype: "剖面線" },
  { key: "agriculture", zh: "農業", en: "Agriculture", code: "Ag", linetype: "犁溝" },
  { key: "fisheries", zh: "漁業", en: "Fisheries", code: "Fs", linetype: "網目" },
  { key: "medicine", zh: "醫學", en: "Medicine", code: "Md", linetype: "心電圖" },
  { key: "ecology", zh: "生態·氣候", en: "Ecology & Climate", code: "Ec", linetype: "等高線" },
  { key: "design", zh: "景觀設計", en: "Landscape Design", code: "Ds", linetype: "樹冠平面" },
];

export const disciplineByKey = (k: DisciplineKey) => DISCIPLINES.find((d) => d.key === k)!;
