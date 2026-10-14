import type { OrgKey } from "./site";
import type { DisciplineKey } from "./disciplines";

// ─── Speakers ────────────────────────────────────────────────────────────────
// 新講者：在 SPEAKERS 加一筆，並在 events.ts 的 speakers 陣列引用 id。
// photo 放 public/speakers/<id>.jpg（4:5，至少 1600×2000）後填入路徑；沒有照片時顯示設計過的標本佔位卡。
// disciplines：依講者既有身份標註的學科（見 disciplines.ts），用於「交會圖譜」；待講者確認。
// places：講者所屬機構的地點，用於地圖與經緯度標籤。approx = 僅為區域示意。

export type Identity = { title: string; detail: string };

export type Place = { name: string; lat: number; lng: number; approx?: boolean; country: CountryCode };

// 國家節點（首頁地下菌絲網絡）：新講者來自新國家時，在這裡加一筆。
export type CountryCode = "TW" | "SG" | "US";
export const COUNTRIES: Record<CountryCode, { zh: string; en: string }> = {
  TW: { zh: "臺灣", en: "Taiwan" },
  SG: { zh: "新加坡", en: "Singapore" },
  US: { zh: "美國", en: "USA" },
};

export type Speaker = {
  id: string;
  name: string;
  nameEn: string;
  initial: string;
  eyebrow: string;
  short: string; // 卡片副標
  tags: string[];
  identities: Identity[];
  disciplines: DisciplineKey[];
  places: Place[];
  orgs: OrgKey[];
  bio: string; // 可含 <span class="en">…</span>
  talk?: string;
  photo?: string;
  draftNote?: string;
};

export const SPEAKERS: Speaker[] = [
  {
    id: "sun",
    name: "孫烜駿",
    nameEn: "Syuan-Jyun Sun",
    initial: "孫",
    eyebrow: "Climate Change · NTU",
    short: "Climate Change · NTU",
    tags: ["國立臺灣大學", "氣候變遷"],
    identities: [
      { title: "國立臺灣大學 · 氣候變遷研究", detail: "研究生物如何回應快速變動的氣候 — 從個體行為、族群到群落尺度。" },
    ],
    disciplines: ["ecology"],
    places: [{ name: "Taipei", lat: 25.02, lng: 121.54, country: "TW" }],
    orgs: ["ntu"],
    bio: `當我們談「氣候變遷」時，常常只看到溫度曲線。孫老師的研究關心的是曲線背後那些正在調整、合作、甚至演化的生命。他會從科學家的角度，拋出一個所有學科都繞不開的問題：<span class="en">how do living systems cope?</span>`,
    draftNote: "介紹為草稿，待講者確認。",
  },
  {
    id: "chan",
    name: "詹偉平",
    nameEn: "Wei-Ping Chan",
    initial: "詹",
    eyebrow: "Founder · Founder · Researcher",
    short: "SOS · BioNarr · Harvard",
    tags: ["SOS Foundation", "BioNarr", "Harvard"],
    identities: [
      { title: "SOS Foundation 創辦人", detail: "Sustainability Of Sustainability — 結合科學、藝術與數位創新，讓永續本身可以永續。" },
      { title: "BioNarr 創辦人暨執行長", detail: "打造可攜式、高通量的系統，從微觀到地景尺度記錄、數位化並感測自然。" },
      { title: "Harvard 研究者", detail: "哈佛大學有機體與演化生物學系（OEB）；曾於比較動物學博物館、Rowland Institute 從事標本 3D 數位化與夜間人工光對蛾類影響的研究。" },
    ],
    disciplines: ["ecology", "hightech"],
    places: [
      { name: "Taipei", lat: 25.02, lng: 121.54, country: "TW" },
      { name: "Cambridge, MA", lat: 42.37, lng: -71.11, country: "US" },
    ],
    orgs: ["sos", "bionarr", "harvard"],
    bio: `非營利、新創、學術 — 三個通常互相看不順眼的世界，他同時待在裡面。這場他想聊的是：當一個人必須在 <span class="en">mission</span>、<span class="en">market</span> 與 <span class="en">peer review</span> 之間切換，永續的定義會怎麼被重新協商。`,
  },
  {
    id: "yen",
    name: "顏訥",
    nameEn: "Yen Ne",
    initial: "顏",
    eyebrow: "Literature · NDHU",
    short: "Literature · NDHU",
    tags: ["國立東華大學", "華文文學"],
    identities: [
      { title: "國立東華大學 · 華文文學", detail: "以文學與書寫，處理人、土地與時代之間的關係。" },
    ],
    disciplines: ["literature"],
    places: [{ name: "Hualien", lat: 23.9, lng: 121.54, country: "TW" }],
    orgs: ["ndhu"],
    bio: `如果說科學負責回答「發生了什麼」，文學負責的是「我們如何感受它」。在一個充滿數據與模型的論壇裡，顏訥會帶來另一種精準 — 語言的精準。<span class="en">Because a crisis we can't narrate is a crisis we can't feel.</span>`,
    draftNote: "介紹為草稿，待講者確認。",
  },
  {
    id: "yuhan",
    name: "Yuhan",
    nameEn: "Goh Yu Han · SALAD Dressing",
    initial: "Y",
    eyebrow: "Landscape Architecture · Singapore",
    short: "SALAD Dressing · Singapore",
    tags: ["景觀建築師", "新加坡"],
    identities: [
      { title: "SALAD Dressing 景觀建築師", detail: "新加坡地景建築事務所，關注 rewilding、經驗策展與數位環境感知（Digital Umwelt）。" },
      { title: "來自新加坡的海外視角", detail: "在高密度的「花園城市」裡，思考城市如何讓自然重新野放。" },
    ],
    disciplines: ["design", "ecology"],
    places: [{ name: "Singapore", lat: 1.29, lng: 103.85, country: "SG" }],
    orgs: ["salad"],
    bio: `SALAD Dressing 的作品包括威尼斯建築雙年展新加坡館（2021）、杜拜世博新加坡館，以及墨爾本設計週的 <span class="en">Rewilding the Sky</span>。Yuhan 將從新加坡帶來一個問題：<span class="en">what if the city itself is the ecotone?</span>`,
    draftNote: "介紹為草稿，待講者確認；SALAD Dressing logo 與官網連結為暫代。",
  },
  {
    id: "wang",
    name: "王鼎涵",
    nameEn: "Ting-Han Wang",
    initial: "王",
    eyebrow: "Clinician · OMIC · Sustainability Office",
    short: "Dentistry · OMIC · Sustainability",
    tags: ["牙醫副院長", "OMIC", "永續辦"],
    identities: [
      { title: "牙醫副院長", detail: "站在臨床第一線，管理一個高耗材、高能源的醫療場域。" },
      { title: "OMIC", detail: "跨領域研究與創新的推動者。" },
      { title: "永續辦", detail: "把永續從口號變成制度 — 推動實際可執行的永續行動。" },
    ],
    disciplines: ["medicine"],
    places: [{ name: "Taiwan", lat: 24.2, lng: 120.9, approx: true, country: "TW" }],
    orgs: [],
    bio: `醫療是最少被放進永續討論的產業之一，卻是碳排與廢棄物的大戶。當一位牙醫同時要管診間、做研究、還要推永續政策，<span class="en">sustainability</span> 就不再是抽象概念，而是每天早上的 <span class="en">operational decision</span>。`,
    draftNote: "介紹為草稿，所屬單位、職稱與英文姓名待講者確認。",
  },
];

export const speakerById = (id: string) => SPEAKERS.find((s) => s.id === id);

/** 講者編號，例如 ECO-S-02（依 SPEAKERS 順序產生），用於卡片上的條碼設計。 */
export const catalogNo = (s: Speaker) => `ECO-S-${String(SPEAKERS.indexOf(s) + 1).padStart(2, "0")}`;

/** 每張身份標籤的編號。講者用標本台紙的視覺呈現，但文案不稱講者為「標本」。 */
export const LABEL_KINDS = [
  { abbr: "I.", zh: "身份" },
  { abbr: "II.", zh: "身份" },
  { abbr: "III.", zh: "身份" },
  { abbr: "IV.", zh: "身份" },
];
