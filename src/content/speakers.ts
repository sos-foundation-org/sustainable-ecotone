import type { OrgKey } from "./site";

// ─── Speakers ────────────────────────────────────────────────────────────────
// 新講者：在 SPEAKERS 加一筆，並在 events.ts 的 speakers 陣列引用 id。
// photo 放 public/speakers/<id>.jpg 後填入路徑，沒有照片時顯示姓氏字卡。

export type Identity = { title: string; detail: string };

export type Speaker = {
  id: string;
  name: string;
  nameEn: string;
  initial: string;
  eyebrow: string;
  short: string; // 卡片副標
  tags: string[];
  identities: Identity[];
  orgs: OrgKey[];
  bio: string; // 可含 <span class="en">…</span>
  talk?: string;
  photo?: string;
  palette: [string, string];
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
    orgs: ["ntu"],
    bio: `當我們談「氣候變遷」時，常常只看到溫度曲線。孫老師的研究關心的是曲線背後那些正在調整、合作、甚至演化的生命。他會從科學家的角度，拋出一個所有學科都繞不開的問題：<span class="en">how do living systems cope?</span>`,
    palette: ["#2E9C9A", "#0d2a3a"],
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
    orgs: ["sos", "bionarr", "harvard"],
    bio: `非營利、新創、學術 — 三個通常互相看不順眼的世界，他同時待在裡面。這場他想聊的是：當一個人必須在 <span class="en">mission</span>、<span class="en">market</span> 與 <span class="en">peer review</span> 之間切換，永續的定義會怎麼被重新協商。`,
    palette: ["#E0B63E", "#14294b"],
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
    orgs: ["ndhu"],
    bio: `如果說科學負責回答「發生了什麼」，文學負責的是「我們如何感受它」。在一個充滿數據與模型的論壇裡，顏訥會帶來另一種精準 — 語言的精準。<span class="en">Because a crisis we can't narrate is a crisis we can't feel.</span>`,
    palette: ["#a0576b", "#1F2A33"],
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
    orgs: ["salad"],
    bio: `SALAD Dressing 的作品包括威尼斯建築雙年展新加坡館（2021）、杜拜世博新加坡館，以及墨爾本設計週的 <span class="en">Rewilding the Sky</span>。Yuhan 將從新加坡帶來一個問題：<span class="en">what if the city itself is the ecotone?</span>`,
    palette: ["#5FA58B", "#0b2a22"],
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
    orgs: [],
    bio: `醫療是最少被放進永續討論的產業之一，卻是碳排與廢棄物的大戶。當一位牙醫同時要管診間、做研究、還要推永續政策，<span class="en">sustainability</span> 就不再是抽象概念，而是每天早上的 <span class="en">operational decision</span>。`,
    palette: ["#2F5D8A", "#081824"],
    draftNote: "介紹為草稿，所屬單位、職稱與英文姓名待講者確認。",
  },
];

export const speakerById = (id: string) => SPEAKERS.find((s) => s.id === id);
