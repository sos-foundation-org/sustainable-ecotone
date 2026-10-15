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
export type CountryCode = "TW" | "SG" | "US" | "JP";
export const COUNTRIES: Record<CountryCode, L10n> = {
  TW: { zh: "臺灣", en: "Taiwan" },
  SG: { zh: "新加坡", en: "Singapore" },
  US: { zh: "美國", en: "USA" },
  JP: { zh: "日本", en: "Japan" },
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
  /** 亮點：公開可查的成就、著作、報導等；source 為出處網址（不顯示，供查核） */
  highlights?: { zh: string; en: string; source?: string }[];
  /** 重要著作／發表：論文、書籍、報告、展覽；zh/en 可含 <i>…</i> 標題 */
  publications?: { zh: string; en: string; source?: string }[];
  photo?: string;
  /** 卡片上的外部連結圖示（實驗室或個人網頁） */
  links?: { kind: "lab" | "personal"; url: string; icon?: string }[];
  /** 這些所屬機構在卡片上保留超連結；其餘只顯示名稱 */
  linkedOrgs?: OrgKey[];
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
    highlights: [
      { zh: "臺大氣候變遷與永續發展國際學位學程助理教授，主持孫烜駿實驗室", en: "Assistant Professor, International Degree Program in Climate Change and Sustainable Development, National Taiwan University; leads the Sun Lab", source: "https://ntuhighlights.ntu.edu.tw/News_Content_n_171094_s_254845.html" },
      { zh: "英國劍橋大學博士，以埋葬蟲為模式物種研究物種交互作用與適應", en: "PhD, University of Cambridge; uses burying beetles as a model system to study species interactions and adaptation", source: "https://labspotlight.ntu.edu.tw/focus/166" },
      { zh: "實驗發現升溫 2°C 會削弱埋葬蟲親代照顧對幼蟲的保護", en: "Showed experimentally that a 2°C rise in temperature erodes the protection burying-beetle parental care gives offspring", source: "https://ntuhighlights.ntu.edu.tw/News_Content_n_171094_s_254845.html" },
      { zh: "調查臺灣北部 180 多個樣點，揭示都市化與熱島效應使埋葬蟲族群減少", en: "Surveyed 180+ sites across northern Taiwan, showing that urbanisation and urban heat reduce burying-beetle populations", source: "https://labspotlight.ntu.edu.tw/focus/166" },
    ],
    publications: [
      { zh: "<i>Insect adaptation to urban environments: A synthesis of morphological, behavioural, and physiological responses</i>，Current Opinion in Insect Science（2026）", en: "<i>Insect adaptation to urban environments: A synthesis of morphological, behavioural, and physiological responses</i>. Current Opinion in Insect Science (2026)", source: "https://doi.org/10.1016/j.cois.2026.101620" },
      { zh: "<i>Climate-mediated cooperation promotes niche expansion in burying beetles</i>，eLife（2014）", en: "<i>Climate-mediated cooperation promotes niche expansion in burying beetles</i>. eLife (2014)", source: "https://elifesciences.org/articles/02440" },
      { zh: "<i>Temperature stress induces mites to help their carrion beetle hosts by eliminating rival blowflies</i>，eLife（2020）", en: "<i>Temperature stress induces mites to help their carrion beetle hosts by eliminating rival blowflies</i>. eLife (2020)", source: "https://elifesciences.org/articles/55649" },
      { zh: "<i>Heat stress effects on offspring compound across parental care</i>，Proceedings of the Royal Society B（2025）", en: "<i>Heat stress effects on offspring compound across parental care</i>. Proceedings of the Royal Society B (2025), senior author", source: "https://ntuhighlights.ntu.edu.tw/News_Content_n_171094_s_254845.html" },
    ],
    photo: "/speakers/sun-4x5.jpg",
    links: [{ kind: "lab", url: "https://sites.google.com/view/sjsun/home" }],
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
    disciplines: ["ecology", "climate"],
    places: [{ name: "Taipei", lat: 25.02, lng: 121.54, country: "TW" }],
    orgs: ["ntu"],
    bio: {
      zh: `當我們談「氣候變遷」時，常常只看到溫度曲線。孫老師的研究關心的是曲線背後那些正在調整、合作、甚至演化的生命。孫老師會從科學家的角度，拋出一個所有學科都繞不開的問題：生命系統要如何因應？（<span class="en">how do living systems cope?</span>）`,
      en: `When we talk about climate change, we often see only the temperature curve. Professor Sun’s research is about the lives behind that curve, which are adjusting, cooperating, even evolving. Speaking as a scientist, Professor Sun will pose a question no discipline can sidestep: <em>how do living systems cope?</em>`,
    },
    draftNote: DRAFT,
  },
  {
    id: "chan",
    name: { zh: "詹偉平", en: "Wei-Ping Chan" },
    nameEn: "Wei-Ping Chan",
    talk: { zh: "夜間人工光（ALAN），以及橫跨城鄉地景的研究", en: "Artificial light at night (ALAN) and conducting research across urban-rural landscapes" },
    highlights: [
      { zh: "打造 11 波段高通量多光譜影像系統，已數位化逾 18,000 件博物館館藏", en: "Built an 11-band high-throughput multispectral imaging system that has digitized more than 18,000 museum specimens", source: "wpc_website" },
      { zh: "運用橫跨 130 多年的歷史資料，解析蛾類趨光性下降的成因", en: "Used more than 130 years of historical behavioural data to disentangle why moths are becoming less attracted to light", source: "wpc_website" },
      { zh: "研究登上 Nature 與 Science，主題涵蓋全球山區氣候變遷速度與物種海拔分布", en: "First-author papers in Nature and Science on climate velocities in the world’s mountains and species’ elevational ranges", source: "wpc_website" },
      { zh: "哈佛大學有機體與演化生物學博士", en: "PhD in Organismic and Evolutionary Biology, Harvard University", source: "wpc_website" },
    ],
    publications: [
      { zh: "<i>Climate velocities and species tracking in global mountain regions</i>，Nature（2024）", en: "<i>Climate velocities and species tracking in global mountain regions</i>. Nature (2024)", source: "wpc_website" },
      { zh: "<i>Seasonal and daily climate variation have opposite effects on species elevational range size</i>，Science（2016）", en: "<i>Seasonal and daily climate variation have opposite effects on species elevational range size</i>. Science (2016)", source: "wpc_website" },
      { zh: "<i>Historical behavioural data disentangle evolutionary and environmental drivers of recent declines in insect attraction to light</i>，Proc. R. Soc. B（2025）", en: "<i>Historical behavioural data disentangle evolutionary and environmental drivers of recent declines in insect attraction to light</i>. Proc. R. Soc. B (2025)", source: "wpc_website" },
      { zh: "<i>A high throughput multispectral imaging system for museum specimens</i>，Communications Biology（2022）", en: "<i>A high throughput multispectral imaging system for museum specimens</i>. Communications Biology (2022)", source: "wpc_website" },
    ],
    photo: "/speakers/chan-4x5.jpg",
    links: [{ kind: "personal", url: "https://wpchanwork.github.io/wei-ping_chan/zh/index.html" }],
    linkedOrgs: ["sos"],
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
        title: { zh: "Harvard 研究專員", en: "Harvard OEB Associate" },
        detail: {
          zh: "哈佛大學有機體與演化生物學系（OEB）；曾於比較動物學博物館、Rowland Institute 從事標本 3D 數位化與夜間人工光對蛾類影響的研究。",
          en: "Department of Organismic and Evolutionary Biology (OEB), Harvard University. Previously researched the 3D digitization of natural history collections and the effects of artificial light at night on moths, at the Museum of Comparative Zoology and the Rowland Institute.",
        },
      },
    ],
    disciplines: ["ecology", "climate", "hightech"],
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
    highlights: [
      { zh: "國立東華大學華文文學系助理教授（2026 年起），東華華文系學士、碩士", en: "Assistant Professor, Department of Sinophone Literatures, National Dong Hwa University (since 2026); BA and MA from the same department", source: "https://sili.ndhu.edu.tw/p/412-1055-22760.php?Lang=zh-tw" },
      { zh: "國立清華大學中國文學博士，研究筆記小說、散文創作與性別文化", en: "PhD in Chinese Literature, National Tsing Hua University; research covers biji fiction, essay writing and gender culture", source: "https://sili.ndhu.edu.tw/p/412-1055-22760.php?Lang=zh-tw" },
      { zh: "曾任中央研究院中國文哲研究所博士後研究員、哈佛大學東亞系訪問學人", en: "Former postdoctoral researcher at the Institute of Chinese Literature and Philosophy, Academia Sinica, and visiting scholar in East Asian Languages and Civilizations at Harvard", source: "https://zh.wikipedia.org/wiki/顏訥" },
      { zh: "文學直播節目「作家事」共同主持人，曾任聯合報「鳴人堂」專欄作者", en: "Co-host of the literary live-stream show 作家事 (Zuojia shi); former columnist for the United Daily News opinion platform 鳴人堂", source: "https://zh.wikipedia.org/wiki/顏訥" },
    ],
    publications: [
      { zh: "散文集《幽魂訥訥》，印刻，2017", en: "<i>You hun ne ne</i> (幽魂訥訥), essays, INK Publishing, 2017", source: "https://www.books.com.tw/products/0010769079" },
      { zh: "散文集《假仙女》，2024", en: "<i>Faux-cul</i> (假仙女), essays, 2024", source: "https://vocus.cc/article/67068a52fd8978000138c49f" },
    ],
    photo: "/speakers/yen-4x5.jpg",
    links: [{ kind: "personal", url: "https://sili.ndhu.edu.tw/p/412-1055-22760.php?Lang=zh-tw" }],
    initial: { zh: "顏", en: "Y" },
    eyebrow: "Literature · NDHU",
    short: "Literature · NDHU",
    tags: { zh: ["國立東華大學", "華文文學", "作家"], en: ["National Dong Hwa University", "Sinophone literature", "Writer"] },
    identities: [
      {
        title: { zh: "國立東華大學 · 華文文學", en: "National Dong Hwa University · Sinophone literature" },
        detail: {
          zh: "以文學與書寫，處理人、土地與時代之間的關係。",
          en: "Works through literature and writing on the relationships between people, the land and their times.",
        },
      },
      {
        title: { zh: "作家", en: "Writer" },
        detail: { zh: "散文作家，著有《幽魂訥訥》（2017）與《假仙女》（2024）。", en: "Essayist, author of You hun ne ne (2017) and Faux-cul (2024)." },
      },
    ],
    disciplines: ["literature"],
    places: [{ name: "Hualien", lat: 23.9, lng: 121.54, country: "TW" }],
    orgs: ["ndhu"],
    bio: {
      zh: `如果說科學負責回答「發生了什麼」，文學負責的是「我們如何感受它」。在一個充滿數據與模型的論壇裡，顏訥會帶來另一種精準：語言的精準。一場說不出來的危機，我們也無從感受。（<span class="en">Because a crisis we can't narrate is a crisis we can't feel.</span>）`,
      en: `If science answers the question “what happened?”, literature answers “how do we feel it?” In a forum full of data and models, Na Yen brings a different kind of precision: the precision of language. <em>Because a crisis we can’t narrate is a crisis we can’t feel.</em>`,
    },
    draftNote: DRAFT,
  },
  {
    id: "yuhan",
    name: { zh: "Goh Yu Han", en: "Goh Yu Han" },
    nameEn: "Goh Yu Han",
    talk: { zh: "再野化：和平地把人類的領域還給自然", en: "Rewilding: peacefully giving human territory back to nature" },
    highlights: [
      { zh: "新加坡景觀建築事務所 Salad Dressing 設計總監，2010 年正式加入", en: "Director of Design at Salad Dressing, a Singapore landscape architecture studio, which Goh Yu Han formally joined in 2010", source: "https://www.saladlandscape.com/about" },
      { zh: "帶領 Salad Dressing 團隊參展 2021 威尼斯建築雙年展新加坡館", en: "Led the Salad Dressing team exhibiting in the Singapore Pavilion at the 2021 Venice Architecture Biennale", source: "https://www.labiennale.org/en/architecture/2021/singapore/" },
      { zh: "獲選文化景觀基金會（TCLF）Oberlander Prize 論壇新銳實踐者講者（2026）", en: "Selected as an emerging-practitioner speaker for The Cultural Landscape Foundation’s Virtual Oberlander Prize Forum (2026)", source: "https://www.tclf.org/virtual-oberlander-prize-forum-where-do-we-go-here" },
    ],
    publications: [
      { zh: "2020 杜拜世博新加坡館（Salad Dressing 擔任景觀建築師），獲 2023 新加坡總統設計獎年度設計", en: "Singapore Pavilion, Expo 2020 Dubai (Salad Dressing as landscape architect); President’s Design Award, Design of the Year 2023", source: "https://pda.designsingapore.org/presidents-design-award/award-recipients/2023/singapore-pavilion-expo-2020-dubai" },
      { zh: "2021 威尼斯建築雙年展新加坡館「<i>to gather: The Architecture of Relationships</i>」參展作品", en: "Exhibit in <i>to gather: The Architecture of Relationships</i>, Singapore Pavilion, 17th Venice Architecture Biennale (2021)", source: "https://www.labiennale.org/en/architecture/2021/singapore/" },
      { zh: "墨爾本設計週展覽 <i>Rewilding the Sky</i>", en: "<i>Rewilding the Sky</i>, exhibition at Melbourne Design Week", source: "https://msd.unimelb.edu.au/events/rewilding-the-sky-with-salad-dressing-landscape-architects" },
    ],
    photo: "/speakers/yuhan-4x5.jpg",
    linkedOrgs: ["salad"],
    initial: { zh: "Y", en: "G" },
    eyebrow: "Landscape Architecture · Singapore",
    short: "SALAD Dressing · Singapore",
    tags: { zh: ["景觀建築師", "新加坡"], en: ["Landscape architect", "Singapore"] },
    identities: [
      {
        title: { zh: "Salad Dressing 設計總監", en: "Director of Design, Salad Dressing" },
        detail: {
          zh: "新加坡地景建築事務所，關注再野化（rewilding）、經驗策展與數位環境感知（Digital Umwelt）。",
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
      zh: `Salad Dressing 曾參展 2021 威尼斯建築雙年展新加坡館、擔任杜拜世博新加坡館的景觀建築師，並在墨爾本設計週展出 <span class="en">Rewilding the Sky</span>。Yu Han 將從新加坡帶來一個問題：如果城市本身就是一個生態交會帶呢？（<span class="en">what if the city itself is the ecotone?</span>）`,
      en: `Salad Dressing exhibited in the Singapore Pavilion at the 2021 Venice Architecture Biennale, was landscape architect for the Singapore Pavilion at Expo 2020 Dubai, and showed <em>Rewilding the Sky</em> at Melbourne Design Week. From Singapore, Yu Han brings a question: <em>what if the city itself is the ecotone?</em>`,
    },
    draftNote: {
      zh: "介紹為草稿，待講者確認；SALAD Dressing 的標誌與官網連結為暫代。",
      en: "Draft profile, pending the speaker’s confirmation. The SALAD Dressing logo and website link are placeholders.",
    },
  },
  {
    id: "wang",
    name: { zh: "王鼎涵", en: "Hank Wang" },
    nameEn: "Hank Wang",
    talk: { zh: "科技、自然與永續：新興新創", en: "Technology, nature, and sustainability: emerging startups" },
    highlights: [
      { zh: "主持 AI 口腔健康計畫，獲 2025 台灣永續行動獎金獎、亞太永續行動獎銀獎", en: "Led an AI oral-health project that won Gold at the 2025 Taiwan Sustainability Action Awards and Silver at the Asia-Pacific Sustainability Action Awards", source: "https://sdgs.nycu.edu.tw/archives/27392?lang=en" },
      { zh: "日本東北大學齒學研究科客座副教授（2022 年起）", en: "Visiting Associate Professor, Graduate School of Dentistry, Tohoku University, Japan (since 2022)", source: "https://ihp.nycu.edu.tw/Faculty/Faculty/350" },
    ],
    publications: [
      { zh: "<i>SegmentAnyTooth: An open-source deep learning framework for tooth enumeration and segmentation in intraoral photos</i>，Journal of Dental Sciences（2025，共同通訊作者）", en: "<i>SegmentAnyTooth: an open-source deep learning framework for tooth enumeration and segmentation in intraoral photos</i>. Journal of Dental Sciences (2025), co-corresponding author", source: "https://scholar.nycu.edu.tw/en/publications/segmentanytooth-an-open-source-deep-learning-framework-for-tooth--2/" },
    ],
    photo: "/speakers/wang-4x5.jpg",
    links: [{ kind: "lab", url: "https://www.nycu.edu.tw/cod/ch/app/artwebsite/view?module=artwebsite&id=38864&serno=ba5b7a81-845a-4b15-9a3d-d724ce886532" }],
    initial: { zh: "王", en: "W" },
    eyebrow: "Clinician · OMIC · Sustainability Office",
    short: "Dentistry · OMIC · Sustainability",
    tags: { zh: ["牙醫副院長", "OMIC", "永續辦"], en: ["Dental deputy superintendent", "OMIC", "Sustainability Office"] },
    identities: [
      {
        title: { zh: "陽明交大牙醫學院副教授", en: "Associate Professor, College of Dentistry, NYCU" },
        detail: {
          zh: "研究顳顎關節組織工程、口腔微生物，以及人工智慧與延展實境（XR）在牙醫教育與臨床的應用。",
          en: "Research spans tissue engineering for TMJ arthritis, the oral microbiota, and AI and extended reality (XR) in dental education and clinical care.",
        },
      },
      {
        title: { zh: "牙醫副院長", en: "Dentist and deputy superintendent" },
        detail: {
          zh: "站在臨床第一線，管理一個高耗材、高能源的醫療場域。",
          en: "Works on the clinical front line, running a healthcare setting that consumes a great deal of material and energy.",
        },
      },
      {
        title: { zh: "OMIC", en: "OMIC" },
        detail: { zh: "陽明交大口腔醫學創新中心（OMIC）副主任（2022 年起），推動跨領域研究與創新。", en: "Deputy Director of NYCU’s Oral Medicine Innovation Center (OMIC) since 2022, driving interdisciplinary research and innovation." },
      },
      {
        title: { zh: "永續辦", en: "Sustainability Office" },
        detail: {
          zh: "陽明交大永續發展暨大學社會責任辦公室副執行長（2024 年起），把永續從口號變成制度。",
          en: "Associate Executive Director of NYCU’s Office of Sustainable Development and University Social Responsibility since 2024, turning sustainability from a slogan into policy.",
        },
      },
    ],
    disciplines: ["medicine", "hightech"],
    places: [
      { name: "Taiwan", lat: 24.2, lng: 120.9, approx: true, country: "TW" },
      { name: "Sendai", lat: 38.25, lng: 140.87, country: "JP" },
    ],
    orgs: ["nycu", "tohoku"],
    bio: {
      zh: `醫療是最少被放進永續討論的產業之一，卻是碳排與廢棄物的大戶。當一位牙醫同時要管診間、做研究、還要推永續政策，永續就不再是抽象概念，而是每天早上都要做的營運決策（<span class="en">operational decision</span>）。`,
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
