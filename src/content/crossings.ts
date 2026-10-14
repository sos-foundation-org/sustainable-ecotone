import type { DisciplineKey } from "./disciplines";

// ─── Crossings ───────────────────────────────────────────────────────────────
// DESIDERATA：「下一跳」提問清單。網站會優先顯示「目前講者還沒碰過」的學科組合，
// 也可以當作下一場邀請講者的參考。

export type Desideratum = { a: DisciplineKey; b: DisciplineKey; question: string };

export const DESIDERATA: Desideratum[] = [
  { a: "literature", b: "fisheries", question: "一首詩，能不能改變一份漁獲配額？" },
  { a: "law", b: "agriculture", question: "土壤有沒有權利？" },
  { a: "history", b: "hightech", question: "一顆晶片的年輪，要怎麼數？" },
  { a: "finance", b: "medicine", question: "一間診所的碳，要記在哪一本帳上？" },
  { a: "politics", b: "fisheries", question: "一條洄游的魚，屬於哪一個國家？" },
  { a: "mech", b: "design", question: "城市能不能像蝗蟲的後腿一樣，先儲存、再釋放能量？" },
  { a: "ee", b: "literature", question: "電路圖，算不算一種文體？" },
  { a: "history", b: "agriculture", question: "一塊田的記憶，誰來記？" },
  { a: "law", b: "hightech", question: "演算法能不能成為一片濕地的監護人？" },
  { a: "politics", b: "mech", question: "一座水閘門，是工程問題還是政治問題？" },
  { a: "agriculture", b: "medicine", question: "土壤的健康與人的健康，是不是同一本病歷？" },
  { a: "finance", b: "ecology", question: "一片紅樹林，值多少錢？誰有資格回答？" },
];
