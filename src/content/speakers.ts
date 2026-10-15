import type { L10n } from "@/lib/i18n";
import type { OrgKey } from "./site";
import type { DisciplineKey } from "./disciplines";

// ─── Speakers ────────────────────────────────────────────────────────────────
// 新講者：在 SPEAKERS 加一筆（可翻譯欄位寫 { zh, en }），並在 events.ts 的 speakers 陣列引用 id。
// photo 放 public/speakers/<id>-4x5.jpg（先裁成 4:5，建議至少 1200×1500）後填入路徑；沒有照片時顯示設計過的台紙佔位卡。
// disciplines：依講者既有身份標註的學科（見 disciplines.ts），用於「交會圖譜」；待講者確認。
// places：講者所屬機構的地點，用於地圖與經緯度標籤。approx = 僅為區域示意。

export type Identity = { title: L10n; detail: L10n };

export type Place = { name: string; lat: number; lng: number; approx?: boolean; country: CountryCode };

// 國家節點（首頁地下菌絲網絡）：新講者來自新國家時，在這裡加一筆。
export type CountryCode = "TW" | "SG" | "US";
export const COUNTRIES: Record<CountryCode, L10n> = {
  TW: { zh: "臺灣", en: "Taiwan" },
  SG: { zh: "新加坡", en: "Singapore" },
  US: { zh: "美國", en: "USA" },
};

export type Speaker = {
  id: string;
  /** display name in each language (en = the English name used on English pages) */
  name: L10n;
  /** romanized line shown under the Chinese name on Chinese pages */
  nameEn: string;
  /** portrait placeholder glyph */
  initial: L10n;
  eyebrow: string;
  short: string; // 卡片副標（英文，兩種語言共用）
  tags: L10n<string[]>;
  identities: Identity[];
  disciplines: DisciplineKey[];
  places: Place[];
  orgs: OrgKey[];
  bio: L10n; // 中文可含 <span class="en">…</span>；英文用 <em>…</em>
  talk?: L10n;
  photo?: string;
  /** 照片裁切焦點（CSS object-position），例如 "72% 30%"；預設置中 */
  photoPos?: string;
  draftNote?: L10n;
};

const DRAFT: L10n = { zh: "介紹為草稿，待講者確認。", en: "Draft profile, pending the speaker’s confirmation." };

export const SPEAKERS: Speaker[] = [
  {
    id: "sun",
    name: { zh: "孫烜駿", en: "Syuan-Jyun Sun" },
    nameEn: "Syuan-Jyun Sun",
    talk: { zh: "都市化及其對自然的影響", en: "Urbanization and its impacts on nature" },
    photo: "/speakers/sun-4x5.jpg",
    initial: { zh: "孫", en: "S" },
    eyebrow: "Climate Change · NTU",
    short: "Climate Change · NTU",
    tags: { zh: ["國立臺灣大學", "氣候變遷"], en: ["National Taiwan University", "Climate change"] },
    identities: [
      {
        title: { zh: "國立臺灣大學 · 氣候變遷研究", en: "National Taiwan University · Climate change research" },
        detail: {
          zh: "研究生物如何回應快速變動的氣候，從個體行為、族群一路到群落尺度。",
          en: "Studies how living things respond to a rapidly changing climate, from individual behaviour through populations to whole communities.",
        },
      },
    ],
    disciplines: ["ecology"],
    places: [{ name: "Taipei", lat: 25.02, lng: 121.54, country: "TW" }],
    orgs: ["ntu"],
    bio: {
      zh: `當我們談「氣候變遷」時，常常只看到溫度曲線。孫老師的研究關心的是曲線背後那些正在調整、合作、甚至演化的生命。他會從科學家的角度，拋出一個所有學科都繞不開的問題：<span class="en">how do living systems cope?</span>`,
      en: `When we talk about climate change, we often see only the temperature curve. Professor Sun’s research is about the lives behind that curve, which are adjusting, cooperating, even evolving. Speaking as a scientist, Professor Sun will pose a question no discipline can sidestep: <em>how do living systems cope?</em>`,
    },
    draftNote: DRAFT,
  },
  {
    id: "chan",
    name: { zh: "詹偉平", en: "Wei-Ping Chan" },
    nameEn: "Wei-Ping Chan",
    talk: { zh: "夜間人工光（ALAN），以及橫跨城鄉地景的研究", en: "Artificial light at night (ALAN) and conducting research across urban-rural landscapes" },
    photo: "/speakers/chan-4x5.jpg",
    initial: { zh: "詹", en: "C" },
    eyebrow: "Founder · Founder · Researcher",
    short: "SOS · BioNarr · Harvard",
    tags: { zh: ["SOS Foundation", "BioNarr", "Harvard"], en: ["SOS Foundation", "BioNarr", "Harvard"] },
    identities: [
      {
        title: { zh: "SOS Foundation 創辦人", en: "Founder, SOS Foundation" },
        detail: {
          zh: "Sustainability Of Sustainability：結合科學、藝術與數位創新，讓永續本身可以永續。",
          en: "Sustainability Of Sustainability: bringing science, art and digital innovation together so that sustainability itself can be sustained.",
        },
      },
      {
        title: { zh: "BioNarr 創辦人暨執行長", en: "Founder & CEO, BioNarr" },
        detail: {
          zh: "打造可攜式、高通量的系統，從微觀到地景尺度記錄、數位化並感測自然。",
          en: "Building portable, high-throughput systems that record, digitize and sense nature, from the microscopic to the landscape scale.",
        },
      },
      {
        title: { zh: "Harvard 研究者", en: "Researcher, Harvard" },
        detail: {
          zh: "哈佛大學有機體與演化生物學系（OEB）；曾於比較動物學博物館、Rowland Institute 從事標本 3D 數位化與夜間人工光對蛾類影響的研究。",
          en: "Department of Organismic and Evolutionary Biology (OEB), Harvard University. Previously researched the 3D digitization of natural history collections and the effects of artificial light at night on moths, at the Museum of Comparative Zoology and the Rowland Institute.",
        },
      },
    ],
    disciplines: ["ecology", "hightech"],
    places: [
      { name: "Taipei", lat: 25.02, lng: 121.54, country: "TW" },
      { name: "Cambridge, MA", lat: 42.37, lng: -71.11, country: "US" },
    ],
    orgs: ["sos", "bionarr", "harvard"],
    bio: {
      zh: `非營利、新創、學術，三個通常互相看不順眼的世界，詹偉平同時待在裡面。這一場從夜間人工光（<span class="en">ALAN</span>）談起：當城市的燈越亮越遠，夜行昆蟲與生態系會發生什麼事，以及如何在城鄉交界的地景裡做研究。`,
      en: `Nonprofit, startup, academia: three worlds that usually regard one another with suspicion, and Wei-Ping Chan works in all of them at once. This talk starts from artificial light at night (<em>ALAN</em>): what happens to night-flying insects and ecosystems as city lights spread further, and how to do research across landscapes where the urban meets the rural.`,
    },
  },
  {
    id: "yen",
    name: { zh: "顏訥", en: "Na Yen" },
    nameEn: "Na Yen",
    talk: { zh: "人類如何觀看、對待並記錄自然", en: "How humans have viewed, interacted with, and documented nature" },
    photo: "/speakers/yen-4x5.jpg",
    initial: { zh: "顏", en: "Y" },
    eyebrow: "Literature · NDHU",
    short: "Literature · NDHU",
    tags: { zh: ["國立東華大學", "華文文學"], en: ["National Dong Hwa University", "Sinophone literature"] },
    identities: [
      {
        title: { zh: "國立東華大學 · 華文文學", en: "National Dong Hwa University · Sinophone literature" },
        detail: {
          zh: "以文學與書寫，處理人、土地與時代之間的關係。",
          en: "Works through literature and writing on the relationships between people, the land and their times.",
        },
      },
    ],
    disciplines: ["literature"],
    places: [{ name: "Hualien", lat: 23.9, lng: 121.54, country: "TW" }],
    orgs: ["ndhu"],
    bio: {
      zh: `如果說科學負責回答「發生了什麼」，文學負責的是「我們如何感受它」。在一個充滿數據與模型的論壇裡，顏訥會帶來另一種精準：語言的精準。<span class="en">Because a crisis we can't narrate is a crisis we can't feel.</span>`,
      en: `If science answers the question “what happened?”, literature answers “how do we feel it?” In a forum full of data and models, Na Yen brings a different kind of precision: the precision of language. <em>Because a crisis we can’t narrate is a crisis we can’t feel.</em>`,
    },
    draftNote: DRAFT,
  },
  {
    id: "yuhan",
    name: { zh: "Yuhan", en: "Goh Yu Han" },
    nameEn: "Goh Yu Han · SALAD Dressing",
    talk: { zh: "再野化：和平地把人類的領域還給自然", en: "Rewilding: peacefully giving human territory back to nature" },
    photo: "/speakers/yuhan-4x5.jpg",
    initial: { zh: "Y", en: "G" },
    eyebrow: "Landscape Architecture · Singapore",
    short: "SALAD Dressing · Singapore",
    tags: { zh: ["景觀建築師", "新加坡"], en: ["Landscape architect", "Singapore"] },
    identities: [
      {
        title: { zh: "SALAD Dressing 景觀建築師", en: "Landscape architect, SALAD Dressing" },
        detail: {
          zh: "新加坡地景建築事務所，關注 rewilding、經驗策展與數位環境感知（Digital Umwelt）。",
          en: "A Singapore landscape architecture practice concerned with rewilding, experience curation and digital environmental sensing (Digital Umwelt).",
        },
      },
      {
        title: { zh: "來自新加坡的海外視角", en: "A view from Singapore" },
        detail: {
          zh: "在高密度的「花園城市」裡，思考城市如何讓自然重新野放。",
          en: "In the dense “Garden City”, thinking about how a city can let nature run wild again.",
        },
      },
    ],
    disciplines: ["design", "ecology"],
    places: [{ name: "Singapore", lat: 1.29, lng: 103.85, country: "SG" }],
    orgs: ["salad"],
    bio: {
      zh: `SALAD Dressing 的作品包括威尼斯建築雙年展新加坡館（2021）、杜拜世博新加坡館，以及墨爾本設計週的 <span class="en">Rewilding the Sky</span>。Yuhan 將從新加坡帶來一個問題：<span class="en">what if the city itself is the ecotone?</span>`,
      en: `SALAD Dressing’s work includes the Singapore Pavilion at the Venice Architecture Biennale (2021), the Singapore Pavilion at the Dubai World Expo, and <em>Rewilding the Sky</em> at Melbourne Design Week. From Singapore, Yuhan brings a question: <em>what if the city itself is the ecotone?</em>`,
    },
    draftNote: {
      zh: "介紹為草稿，待講者確認；SALAD Dressing logo 與官網連結為暫代。",
      en: "Draft profile, pending the speaker’s confirmation. The SALAD Dressing logo and website link are placeholders.",
    },
  },
  {
    id: "wang",
    name: { zh: "王鼎涵", en: "Hank Wang" },
    nameEn: "Hank Wang",
    talk: { zh: "科技、自然與永續：新興新創", en: "Technology, nature, and sustainability: emerging startups" },
    photo: "/speakers/wang-4x5.jpg",
    initial: { zh: "王", en: "W" },
    eyebrow: "Clinician · OMIC · Sustainability Office",
    short: "Dentistry · OMIC · Sustainability",
    tags: { zh: ["牙醫副院長", "OMIC", "永續辦"], en: ["Dental deputy superintendent", "OMIC", "Sustainability Office"] },
    identities: [
      {
        title: { zh: "牙醫副院長", en: "Dentist and deputy superintendent" },
        detail: {
          zh: "站在臨床第一線，管理一個高耗材、高能源的醫療場域。",
          en: "Works on the clinical front line, running a healthcare setting that consumes a great deal of material and energy.",
        },
      },
      {
        title: { zh: "OMIC", en: "OMIC" },
        detail: { zh: "跨領域研究與創新的推動者。", en: "A driving force for interdisciplinary research and innovation." },
      },
      {
        title: { zh: "永續辦", en: "Sustainability Office" },
        detail: {
          zh: "把永續從口號變成制度，推動實際可執行的永續行動。",
          en: "Turning sustainability from a slogan into policy, and pushing for sustainability measures that can actually be carried out.",
        },
      },
    ],
    disciplines: ["medicine"],
    places: [{ name: "Taiwan", lat: 24.2, lng: 120.9, approx: true, country: "TW" }],
    orgs: [],
    bio: {
      zh: `醫療是最少被放進永續討論的產業之一，卻是碳排與廢棄物的大戶。當一位牙醫同時要管診間、做研究、還要推永續政策，<span class="en">sustainability</span> 就不再是抽象概念，而是每天早上的 <span class="en">operational decision</span>。`,
      en: `Healthcare is one of the industries least often included in conversations about sustainability, yet it is a major source of carbon emissions and waste. When one dentist has to run a clinic, do research and drive sustainability policy all at once, sustainability stops being an abstraction and becomes an <em>operational decision</em> made every morning.`,
    },
    draftNote: {
      zh: "介紹為草稿，所屬單位與職稱待講者確認。",
      en: "Draft profile. Affiliation and title are pending the speaker’s confirmation.",
    },
  },
];

export const speakerById = (id: string) => SPEAKERS.find((s) => s.id === id);

/** 講者編號，例如 ECO-S-02（依 SPEAKERS 順序產生），用於卡片上的條碼設計。 */
export const catalogNo = (s: Speaker) => `ECO-S-${String(SPEAKERS.indexOf(s) + 1).padStart(2, "0")}`;

/** 每張身份標籤的編號。講者用台紙的視覺呈現，但文案不稱講者為「標本」。 */
export const LABEL_KINDS: { abbr: string; label: L10n }[] = [
  { abbr: "I.", label: { zh: "身份", en: "Identity" } },
  { abbr: "II.", label: { zh: "身份", en: "Identity" } },
  { abbr: "III.", label: { zh: "身份", en: "Identity" } },
  { abbr: "IV.", label: { zh: "身份", en: "Identity" } },
];
