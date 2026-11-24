// 活動現場紀錄（Field notes）：每一冊活動頁上的照片與短片。
//
// 版面概念：把現場排成一條「樣線」（transect）的三種棲地：講台、觀眾席、兩者交會的地方（交會帶，ecotone）。
// 這是空間的分類，不是時間順序。圖說只寫照片裡看得到的（投影片標題、場景），不推測時序或人物。
// 每一段（movement）有自己的圖例線型（`pattern`，沿用 EngraveDefs 的 hatch / stip / hatchC），
// 頁首的樣線圖例會依各段的張數自動分配寬度。
//
// 照片：用 `node scripts/field-notes.mjs <原始照片資料夾>` 產生 public/field/<dir>/ 下的 WebP（裁切、
// 調整亮度對比、模糊白板上的 WiFi 密碼等）。`w` / `h` 是設計裁切的尺寸。照片不提供放大。
// 短片：`kind: "video"`，mp4 放 public/field/<dir>/，見 AI-README「活動現場紀錄」。
//
// 文案守則：描述場景，不必逐一點名；講者照片與現場照片一律全彩，不加去色濾鏡（AI-README 4.4）。
import type { L10n } from "@/lib/i18n";
import type { FungusId } from "./fungi";

export type FieldShape = "wide" | "tall" | "pano" | "plate";

export type FieldShot = {
  /** 檔名主幹：照片 → /field/<dir>/<id>-<寬>.webp；短片 → /field/<dir>/<id>.mp4（封面 <id>-poster.webp） */
  id: string;
  kind?: "photo" | "video";
  /** wide 3:2（佔 4/6 欄）、tall 3:4（佔 2/6 欄，與 wide 成對）、pano 全寬橫幅、plate 全寬收尾大圖 */
  shape: FieldShape;
  w: number;
  h: number;
  /** 對應流程的位置，例如「Talk 1」 */
  cue?: L10n;
  caption: L10n;
  alt: L10n;
  /** 短片長度（秒），顯示在影片標籤上 */
  seconds?: number;
};

export type FieldMovement = {
  key: string;
  title: L10n;
  gloss: L10n;
  note: L10n;
  /** 樣線圖例的線型：EngraveDefs 內的 pattern id */
  pattern: "hatch" | "stip" | "hatchC" | "hatchW";
  time?: string;
  /** 側欄的小版畫（FieldVignette）：路燈與蛾、埋葬蟲、交會的菌絲與子實體 */
  vignette?: "lamp" | "beetle" | "fungi";
  /** 菌絲層（FieldHyphae）在照片上緣長出的子實體種類 */
  species: FungusId[];
  /** 交會帶：第二條朱紅菌絲與墨色菌絲交纏 */
  braid?: boolean;
  shots: FieldShot[];
};

export type FieldNotes = {
  dir: string;
  side: string;
  intro: L10n;
  movements: FieldMovement[];
};

const T3x2 = { w: 2000, h: 1333 };

export const FIELD_NOTES: Record<string, FieldNotes> = {
  "sustainable-urbanization-rewilding-2026": {
    dir: "vol01",
    side: "Vol. 01",
    intro: {
      zh: "現場照片依三種棲地排成一條樣線：講台、觀眾席，以及兩者交會的地方。",
      en: "The photographs are arranged as a transect across three habitats: the lectern, the audience, and the place where the two meet.",
    },
    movements: [
      {
        key: "lectern",
        title: { zh: "講台", en: "The lectern" },
        gloss: { zh: "The lectern", en: "講台" },
        note: {
          zh: "四段演講，四個學科，回應同一組問題。",
          en: "Four talks from four fields, each answering the same pair of questions.",
        },
        pattern: "hatch",
        vignette: "lamp",
        species: ["mycena", "coprinus", "macrolepiota"],
        shots: [
          {
            id: "opening",
            shape: "wide",
            ...T3x2,
            caption: {
              zh: "來聽聽跨領域演講、見見不同學校的老師、成為未來的講者。",
              en: "Come for talks across disciplines, meet teachers from other universities, become a future speaker.",
            },
            alt: {
              zh: "講者拿著麥克風站在投影幕前，幕上是 Ecotone 網站第一冊的頁面與五位講者。",
              en: "A speaker with a microphone in front of the screen, which shows the Ecotone website’s page for Volume I and its five speakers.",
            },
          },
          {
            id: "talk1",
            shape: "tall",
            w: 800,
            h: 1067,
            caption: {
              zh: "〈環境變遷下的育兒策略：從行為可塑性到環境適應〉",
              en: "Raising the Next Generation under Environmental Change: Behavioural Plasticity and Adaptation",
            },
            alt: {
              zh: "穿黑色西裝的講者站在投影幕旁，幕上是〈環境變遷下的育兒策略〉與一隻埋葬蟲。",
              en: "A speaker in a black suit beside the screen, which shows the talk title over a burying beetle.",
            },
          },
          {
            id: "talk2",
            shape: "tall",
            w: 840,
            h: 1120,
            caption: { zh: "講台上的分享。", en: "At the lectern." },
            alt: {
              zh: "講者舉起一隻手說明，身後的投影幕是一片藍紫色的影像。",
              en: "A speaker raises a hand to explain; behind, the screen shows a blue and violet image.",
            },
          },
          {
            id: "talk3",
            shape: "wide",
            w: 2000,
            h: 1333,
            caption: {
              zh: "〈人類眼中的自然：理解、對待與記錄〉",
              en: "Nature through Human Eyes: How We Understand, Treat and Record It",
            },
            alt: {
              zh: "穿格紋西裝外套的講者指向投影幕，幕上寫著「人類眼中的自然：理解、對待與記錄」。",
              en: "A speaker in a checked blazer gestures to the screen, which reads “Nature through Human Eyes: How We Understand, Treat and Record It”.",
            },
          },
          {
            id: "talk3-sea",
            shape: "wide",
            ...T3x2,
            caption: { zh: "Ways of Knowing the Sea：認識海的方式。", en: "Ways of Knowing the Sea." },
            alt: {
              zh: "講者拿著麥克風，旁邊的投影幕是目錄：非生物環境、初級生產力、海洋棲地、人類的影響。",
              en: "A speaker with a microphone beside a slide listing the abiotic environment, primary productivity, ocean habitats and human effects.",
            },
          },
          {
            id: "talk4",
            shape: "tall",
            w: 900,
            h: 1200,
            caption: {
              zh: "不悅之美（The Unpleasant Necessity）：樹洞、水窪、落葉、單寧、泥浴、礦物鹽地。",
              en: "The Unpleasant Necessity: hollows and burrows, puddles, leaf litter, tannin, mud baths, mineral licks.",
            },
            alt: {
              zh: "講者手持講稿與麥克風，投影幕上是「THE UNPLEASANT NECESSITY 不悅之美」與六張野地照片。",
              en: "A speaker holding notes and a microphone; the slide reads “The Unpleasant Necessity” above six photographs of wild places.",
            },
          },
        ],
      },
      {
        key: "audience",
        title: { zh: "觀眾席", en: "The audience" },
        gloss: { zh: "The audience", en: "觀眾席" },
        note: {
          zh: "聽的人，也帶著自己的學科走進教室。",
          en: "The people listening brought their own fields into the room too.",
        },
        pattern: "stip",
        vignette: "beetle",
        species: ["boletus", "mycena"],
        shots: [
          {
            id: "seats",
            shape: "pano",
            w: 2000,
            h: 857,
            caption: { zh: "觀眾席。", en: "The audience." },
            alt: {
              zh: "觀眾坐在長桌後看向前方，牆上掛著幾張研究海報。",
              en: "Audience members at long tables look towards the front; research posters hang on the wall behind them.",
            },
          },
        ],
      },
      {
        key: "ecotone",
        title: { zh: "交會帶", en: "The ecotone" },
        gloss: { zh: "The ecotone", en: "交會帶" },
        note: {
          zh: "兩種棲地相遇的地方，生命最豐富。講台和觀眾席，在這裡混在一起。",
          en: "Where two habitats meet, life is richest. Here the lectern and the audience run together.",
        },
        pattern: "hatchC",
        vignette: "fungi",
        species: ["amanita", "cantharellus", "mycena", "morchella"],
        braid: true,
        shots: [
          {
            id: "after",
            shape: "wide",
            w: 1800,
            h: 1200,
            caption: { zh: "講者與觀眾交流。", en: "Speakers and audience in conversation." },
            alt: {
              zh: "幾個人圍成一圈站著交談。",
              en: "A few people stand in a circle, talking.",
            },
          },
          {
            id: "mingle",
            shape: "tall",
            w: 800,
            h: 1067,
            caption: { zh: "交流。", en: "In conversation." },
            alt: {
              zh: "兩個人在教室裡面對面聊天，後方還有其他人在交談。",
              en: "Two people chat face to face in the classroom, with others talking behind them.",
            },
          },
          {
            id: "together",
            shape: "plate",
            w: 2000,
            h: 1157,
            caption: { zh: "合影", en: "Group photo" },
            alt: {
              zh: "講者與觀眾在投影幕前排成兩排合影。",
              en: "Speakers and audience pose in two rows in front of the screen.",
            },
          },
        ],
      },
    ],
  },
};

