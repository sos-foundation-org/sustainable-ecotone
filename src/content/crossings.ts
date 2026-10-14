import type { L10n } from "@/lib/i18n";
import type { DisciplineKey } from "./disciplines";

// ─── Crossings ───────────────────────────────────────────────────────────────
// DESIDERATA：「下一跳」提問清單。網站會優先顯示「目前講者還沒碰過」的學科組合，
// 也可以當作下一場邀請講者的參考。

export type Desideratum = { a: DisciplineKey; b: DisciplineKey; question: L10n };

export const DESIDERATA: Desideratum[] = [
  { a: "literature", b: "fisheries", question: { zh: "一首詩，能不能改變一份漁獲配額？", en: "Can a poem change a fishing quota?" } },
  { a: "law", b: "agriculture", question: { zh: "土壤有沒有權利？", en: "Does soil have rights?" } },
  { a: "history", b: "hightech", question: { zh: "一顆晶片的年輪，要怎麼數？", en: "How do you count the tree rings of a microchip?" } },
  { a: "finance", b: "medicine", question: { zh: "一間診所的碳，要記在哪一本帳上？", en: "Whose ledger should a clinic’s carbon go in?" } },
  { a: "politics", b: "fisheries", question: { zh: "一條洄游的魚，屬於哪一個國家？", en: "Which country does a migrating fish belong to?" } },
  { a: "mech", b: "design", question: { zh: "城市能不能像蝗蟲的後腿一樣，先儲存、再釋放能量？", en: "Could a city store energy and then release it, like a grasshopper’s hind legs?" } },
  { a: "ee", b: "literature", question: { zh: "電路圖，算不算一種文體？", en: "Is a circuit diagram a literary genre?" } },
  { a: "history", b: "agriculture", question: { zh: "一塊田的記憶，誰來記？", en: "Who keeps the memory of a field?" } },
  { a: "law", b: "hightech", question: { zh: "演算法能不能成為一片濕地的監護人？", en: "Could an algorithm become a wetland’s guardian?" } },
  { a: "politics", b: "mech", question: { zh: "一座水閘門，是工程問題還是政治問題？", en: "Is a floodgate an engineering question or a political one?" } },
  { a: "agriculture", b: "medicine", question: { zh: "土壤的健康與人的健康，是不是同一本病歷？", en: "Do the health of the soil and the health of people share one medical record?" } },
  { a: "finance", b: "ecology", question: { zh: "一片紅樹林，值多少錢？誰有資格回答？", en: "What is a mangrove forest worth? And who has the right to answer?" } },
];
