# AI-README：Ecotone｜兼容並續 網站維護指南（給 AI 代理）

> **給接手的 AI：** 修改任何東西之前，先讀完本檔的「0. 快速守則」與「4. 設計系統與不可違反的規則」。
> 這個網站的設計語言是客戶逐項確認過的，很多「看起來可以順手優化」的地方其實是刻意的決定。
> 不確定時，**先問人，不要猜**。本檔所有路徑、型別、欄位都對照過 `main` 分支的程式碼（最後一個 commit：`2e4c22e`）。
> 程式碼與本檔衝突時，以程式碼為準，並請順手更新本檔。

---

## 0. 快速守則（每次動手前看一遍）

1. **講者不是標本。** 講者卡片「看起來」像植物標本台紙，但中英文案都**不可**稱講者為「標本 / specimen」。
2. **講者照片永遠全彩**，4:5，放在 `public/speakers/<id>-4x5.jpg`。**絕不**加灰階、褐色（sepia）濾鏡：在臺灣，在世者的黑白照會被讀成遺照。
3. **網站上沒有任何「Secret Slide」。**
4. 「報名」＝**講者申請**（Google Form），不是觀眾報名。觀眾用另一份「追蹤未來活動」表單。
5. 「多元聲音 / Diverse Voices」是年齡、性別、族群、學歷、職業與生命經驗的多元，**不只是地理**；**絕不**寫成「海外聲音」。
6. 水線標題（waterline heading）**每頁最多一個**。
7. 種子袋（追蹤卡 `FollowCard`）**每頁最多一個完整版**。
8. 中文優先、英文點綴；破折號（——、—）少用；講者不用性別代名詞，用名字；論文只寫標題、期刊、年份。
9. 不要動 `tsconfig.json`（build 可能自動改它，改了就還原）。
10. 不要自行 push，除非使用者明確要求；push 到 `main` 會直接上線。

---

## 1. 專案概觀與技術棧

| 項目 | 內容 |
|---|---|
| 名稱 | Ecotone｜兼容並續，副標「跨領域永續論壇」（`SITE.subtitle`） |
| 主辦 | NTU × NYCU × SOS（國立臺灣大學、國立陽明交通大學、SOS Foundation） |
| 框架 | Next.js `16.1.0`（App Router）、React `19.2.3`、TypeScript（見 `package.json`） |
| 樣式 | 純 CSS，單一檔案 `src/app/globals.css`（約 1070 行），沒有 Tailwind、沒有 UI framework |
| 渲染 | 全部靜態產生（SSG）。事件頁用 `generateStaticParams` + `dynamicParams = false` |
| 部署 | Vercel，來源 GitHub `sos-foundation-org/sustainable-ecotone`，`main` 分支，**push 即自動部署** |
| 字型 | Google Fonts，在 `src/components/SiteShell.tsx` 的 `FONTS` 依語言載入：Noto Serif TC、Cormorant Garamond、IBM Plex Mono；英文頁再加 EB Garamond |

### 1.1 指令

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # next build
npm run start    # next start（跑 build 出來的版本）
npm run lint     # eslint（設定在 eslint.config.mjs，含 next core-web-vitals + typescript）
```

### 1.2 環境變數

| 變數 | 作用 | 位置 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 正式網域（無結尾斜線），用於 `metadataBase`、sitemap、robots、canonical。未設時預設 `https://sustainable-ecotone.vercel.app` | `src/content/site.ts` 的 `SITE.url` |
| `NEXT_PUBLIC_SHOW_DRAFTS=1` | 顯示機構的「暫代 / Placeholder」旗標（`ORGS[k].placeholder`） | `SHOW_DRAFTS`，用在 `Partners.tsx`、`Specimen.tsx` |
| `NEXT_DIST_DIR` | 改 build 輸出資料夾（預設 `.next`） | `next.config.ts` 的 `distDir` |

> 注意：`SHOW_DRAFTS` **只控制機構暫代旗標**。講者的 `draftNote`（「介紹為草稿，待講者確認」）在正式站上**一律顯示**（`Specimen.tsx` 沒有判斷 `SHOW_DRAFTS`）。

### 1.3 在 dev / start 跑著的時候做檢查 build（`NEXT_DIST_DIR` 技巧）

`next.config.ts`：`distDir: process.env.NEXT_DIST_DIR || ".next"`。這讓你可以另開一個輸出資料夾做檢查 build，不覆蓋正在跑的 `.next`：

```bash
# bash
NEXT_DIST_DIR=.next-check npm run build
```
```powershell
# PowerShell
$env:NEXT_DIST_DIR = ".next-check"; npm run build; Remove-Item Env:NEXT_DIST_DIR
```

- `.gitignore` 已忽略 `.next-*/`，`eslint.config.mjs` 也忽略 `.next-*/**`，所以不會汙染 lint 或 git。
- **Windows 特別注意：** 正在執行的 `next start`（或 `next dev`）會鎖住 `.next` 裡的檔案，這時直接 `npm run build` 會因檔案被占用而失敗。要嘛先停掉 server，要嘛用上面的 `NEXT_DIST_DIR`。
- Next 用不同的 distDir build 時，可能會把 `.next-check/types/**/*.ts` 之類的路徑加進 `tsconfig.json` 的 `include`。**build 完一定要 `git diff tsconfig.json`，有變就 `git checkout -- tsconfig.json` 還原。**

---

## 2. 樣式圖庫總覽（所有視覺資產住在哪裡）

> **有視覺預覽頁的只有一個：`/lab/fungi`**（菌類圖庫，`src/app/(zh)/lab/fungi/page.tsx`，`robots: noindex`，不在選單與 sitemap 中，只有中文路由）。
> 其他圖庫都沒有專屬預覽頁。`/about` 的「Legend · 學科線型圖例」會把所有線型以大尺寸（`Swatch size="lg"`，120×36）列出，可當線型的實際預覽，但它是正式頁面，不是 lab 頁。

| 圖庫 | 檔案位置 | 引用方式 | 如何預覽 | 如何新增 |
|---|---|---|---|---|
| **學科線型圖磚**（`lt-*`） | 圖案：`src/components/EngraveDefs.tsx` 的 `<pattern id="lt-<key>">`；資料：`src/content/disciplines.ts` 的 `DISCIPLINES` | `fill="url(#lt-<key>)"`。渲染處：`Swatch.tsx`（講者卡、首頁 mini 卡、關於頁圖例）、`CrossingAtlas.tsx`（28×16 圖磚）、`NextCrossing.tsx`（72×40）、`CallPage.tsx` 的「還空著的學科」（56×20） | `/about` 圖例區（全部線型）；講者卡右上角 | 見第 6 章 |
| **菌類 / 蘑菇物種** | 圖：`src/components/fungi/library.tsx`；資料：`src/content/fungi.ts` | `<Fungus species=… height=… x=… y=… />`（React 元件，用在 SVG 內）；另外 `FungusSymbols` 會在 `EngraveDefs` 產生 `<symbol id="fungus-<id>">`（目前沒有任何地方用 `<use href="#fungus-…">`） | **`/lab/fungi`**（唯一的預覽頁） | 見 8.2 |
| **活動圖版** | `src/components/plates/`：`index.tsx`（註冊表 `EVENT_PLATES`）、`MangrovePlate.tsx`（`"mangrove"`，水筆仔，目前**沒有任何活動使用**）、`UrbanParkPlate.tsx`（`"urbanpark"`，Vol. 01 使用） | `events.ts` 的 `plate: "<key>"`，`EventPage.tsx` 以 `EVENT_PLATES[e.plate]` 渲染 | 開使用該圖版的活動頁（`/events/<slug>`）。要看沒被使用的 `mangrove`，暫時把某活動的 `plate` 改成它（不要 commit），或建暫時 lab 頁 | 見 8.1 |
| **共用版畫符號與圖案** | `src/components/EngraveDefs.tsx`（由 `SiteShell` 在每頁 `<body>` 開頭渲染一次，隱藏的 `<svg>`） | `url(#id)` 或 `<use href="#id">` | 無預覽頁；用暫時 lab 頁（見下方） | 加在 `EngraveDefs` 的 `<defs>` 裡，id 不可與既有重複 |
| **青蛙** | `src/components/FrogLeap.tsx` 內的 `FrogDefs`：`#frog-sit`、`#frog-fly`、`#frog-land` | 只在 `FrogLeap` 的 SVG 內用 `<use>` 切換姿勢 | 首頁、活動頁的蛙跳分隔線（`MareyDivider`） | 改 `FrogDefs`；三個姿勢共用腳點 (60, 64) |
| **水筆仔胎生苗 / 種子袋** | `src/components/Follow.tsx` 內的 `Propagule()` | `FollowCard`（完整種子袋 `.seed-packet`）與 `FollowCard compact`（頁尾迷你種子袋 `.seed-mini`） | 首頁 Pl. IV、`/events`、活動頁、`/call-for-speakers` | 改 `Propagule()` |
| **連結圖示**（實驗室 / 個人網頁） | `src/components/Specimen.tsx` 內的 `LinkGlyph({ kind })`：`"lab"` 燒瓶長出幼苗、`"personal"` 葉枝框起的肖像浮雕 | 講者 `links[].kind`；若 `links[].icon` 有填則改用該圖檔 | 任一活動頁講者卡的機構列 | 在 `LinkGlyph` 加分支，並擴充 `Speaker.links[].kind` 型別與 `T` 的標籤 |
| **鯨與海** | `src/components/WhaleSea.tsx` 自帶 `#sea-whale`、`#sea-dolphin`、`#sea-fish` | 只在 `WhaleSea` 內使用 | `/voices` | 改 `WhaleSea.tsx` |
| **城市公園圖版內的符號** | `UrbanParkPlate.tsx`：`#urbanpark-moth`、`#urbanpark-beetle`、patterns `#urbanpark-win`、`#urbanpark-floor`、clipPath `#urbanpark-pave`、`#urbanpark-pond` | 圖版內部 | 活動頁 | 新圖版請用自己的 id 前綴 |
| **機構 Logo** | `public/logos/`（見下表） | `ORGS[key].logo`（`src/content/site.ts`），由 `Logo.tsx`（純 `<img>`）渲染 | 關於頁、首頁共同主辦、講者卡機構列 | 放檔案 → 在 `ORGS` 填 `logo` |
| **講者肖像** | `public/speakers/<id>-4x5.jpg`（目前：`sun`、`chan`、`yen`、`yuhan`、`wang`） | `Speaker.photo`，`Specimen.tsx` 的 `Portrait`；`CrossingAtlas` 的圓形小頭像 | 活動頁講者卡 | 見 5.3 |
| **網站圖示** | `src/app/icon.svg`（32×32 favicon，簡化版標誌）、`src/app/apple-icon.png`（180×180） | Next.js 檔案慣例自動產生 `<link rel="icon">` | 直接開檔；PNG 用圖片檢視器 | 見 8.7 |
| **關於頁圖：兩棵樹，一片菌絲**（取代舊的三圓 TriplePoint） | `src/components/about/`：`geometry.ts`（決定性幾何：大王椰子、竹叢與竹鞭、菌絲、珊瑚菌 `coral()`）、`PartnerMycorrhiza.tsx`（伺服器元件，畫 SVG）、`PartnerTips.tsx`（客戶端：熱區與 tooltip） | `AboutPage.tsx` 的 `PageTitle aside={<PartnerMycorrhiza lang={lang} />}` | `/about`、`/en/about` 標題區右側（≤900px 時在標題下方） | 改 `geometry.ts`；標籤位置要同步改 `LABEL_BOXES`（圖形會避開）與 `PartnerMycorrhiza` 的 `SPOTS` 熱區。手機（≤480px）以 `.pmf-fine` 隱藏土壤點描與地層線 |
| **設計 tokens** | `src/app/globals.css` 的 `:root` | `var(--token)` | 無 | 見 4.2 |

### 2.1 `EngraveDefs.tsx` 內的實際 id 一覽

| id | 種類 | 說明 / 使用處 |
|---|---|---|
| `hatch` | pattern | 38° 細斜線（墨色 .5）。最常用的陰影：葉背、蝗蟲、魚、榕樹陰影面等 |
| `hatchW` | pattern | -42° 較疏斜線。遠景、樹冠暗部、關於頁圖的椰子冠莖 |
| `hatchC` | pattern | 45° 朱紅斜線。EdgeEffectFigure 交會帶 |
| `hatchL` | pattern | 淺色（`#E9EEF0`）斜線，給深底使用。目前**未被引用** |
| `stip` | pattern | 點描。`Fungi.tsx`（Genet 土壤）、圖版 |
| `lt-literature` … `lt-design` | pattern ×19 | 學科線型，與 `DISCIPLINES` 的 `key` 一一對應 |
| `leaf` | `<g>` | 紅樹林 / 榕樹葉（原點在葉柄），`<use href="#leaf">` 用於兩張圖版 |
| `grasshopper` | symbol（viewBox 0 0 210 110，腳在 y≈99） | 全站唯一的蝗蟲畫法：首頁 hero、`LeapStage`、`Saltator`、青蛙舌頭帶走的那隻。後腿脛節跟著 CSS 變數 `--kick` 轉 |
| `fish` | symbol | 虱目魚，`MangrovePlate` |
| `mudskipper` | symbol | 彈塗魚，`MangrovePlate`、404 頁 |
| `whale` | symbol | 座頭鯨（線稿）。目前**未被引用**（`/voices` 用的是 `WhaleSea` 自己的 `#sea-whale`） |
| `crab` | symbol | 招潮蟹，`MangrovePlate` |
| `fungus-<id>` | symbol ×11 | 由 `FungusSymbols` 產生，目前**未被引用** |
| `mark` / `mark-clip` | symbol / clipPath | 品牌標誌（見 8.7），`BrandMark.tsx` 用 `<use href="#mark">` |

### 2.2 `public/logos/` 狀態

| 檔案 | 用於 | 狀態 |
|---|---|---|
| `ntu.svg` | `ORGS.ntu` | 取自 Wikipedia（非自由授權、合理使用檔）。**正式上線前需取得校方授權** |
| `nycu.svg` | `ORGS.nycu` | 同上，需授權 |
| `ndhu.svg` | `ORGS.ndhu` | 同上，需授權 |
| `tohoku.svg` | `ORGS.tohoku` | 後來加入（Illustrator 匯出檔），來源未記錄；同樣視為需向校方確認授權 |
| `sos.svg` | `ORGS.sos` | SOS Foundation 自有 |
| `sos-icon.svg` | 無 | 目前**未被引用** |
| `salad-placeholder.svg` | `ORGS.salad` | **自製佔位圖**（`placeholder: true`），待換成 SALAD Dressing 正式 logo |
| （無） | `ORGS.harvard`、`ORGS.bionarr` | 沒有 logo，`CollectorStamp` 會改顯示文字；`bionarr` 的 `url` 為空、`placeholder: true` |

> Logo 在 `.affil img`、`.affil-list img` 會被套 `grayscale` 濾鏡。**這只適用於 logo，絕不可套在講者照片上。**

### 2.3 沒有預覽頁的圖庫怎麼看

1. **暫時 lab 頁**（建議）：仿照 `src/app/(zh)/lab/fungi/page.tsx` 建 `src/app/(zh)/lab/<name>/page.tsx`，加 `metadata.robots = { index: false, follow: false }`。因為 `EngraveDefs` 已在每頁渲染，頁內可直接 `<svg><use href="#grasshopper" …/></svg>` 或 `<rect fill="url(#lt-music)" />`。看完**刪除，不要 commit**（除非使用者要求保留成正式 lab 頁）。
2. **sharp 單檔點陣化**（看獨立的 SVG，如 `icon.svg`、logo）：`sharp` 是 Next.js 的相依套件，已在 `node_modules/sharp`（不在 `package.json` 裡）。輸出放到暫存資料夾，不要放進 repo：
   ```bash
   node -e "require('sharp')('src/app/icon.svg',{density:576}).resize(256).png().toFile(process.env.TEMP+'/icon-preview.png')"
   ```
   注意：`EngraveDefs` 裡的 symbol 不是獨立檔，sharp 無法直接讀；請用方法 1。

---

## 3. 架構地圖

### 3.1 路由與雙語

- **兩個根 layout，沒有 `src/app/layout.tsx`。** 用 route group 分語言：
  - `src/app/(zh)/…`：中文，原網址（`/`、`/events`…），`<html lang="zh-Hant-TW">`
  - `src/app/(en)/en/…`：英文，在 `/en` 底下，`<html lang="en">`
  - 兩者都只 `return <SiteShell lang="…">`（`SiteShell.tsx`：`<head>` 字型、跳到主內容、`EngraveDefs`、`Header`、`<main id="main">`、`Footer`、`RevealObserver`）。
- **路由檔都很薄**：只 import 共用頁面元件並傳 `lang`。例如 `src/app/(zh)/page.tsx` 只有 `<HomePage lang="zh" />` 與 `export const metadata = homeMetadata("zh")`。

| 網址（中 / 英） | 路由檔 | 共用頁面元件（`src/components/pages/`） | metadata 函式 |
|---|---|---|---|
| `/`、`/en` | `(zh)/page.tsx`、`(en)/en/page.tsx` | `HomePage` | `homeMetadata` |
| `/events` | `(zh)/events/page.tsx`… | `EventsPage` | `eventsMetadata` |
| `/events/[slug]` | `(zh)/events/[slug]/page.tsx`… | `EventPage`（props `lang`, `e`） | `eventMetadata(lang, e)` |
| `/speakers` | … | `SpeakersPage`（歷屆講者） | `speakersMetadata` |
| `/voices` | … | `VoicesPage`（多元聲音） | `voicesMetadata` |
| `/about` | … | `AboutPage` | `aboutMetadata` |
| `/call-for-speakers` | … | `CallPage` | `callMetadata` |
| 404 | `(zh)/not-found.tsx`、`(en)/en/not-found.tsx`，加上 catch-all `(zh)/[...missing]/page.tsx`、`(en)/en/[...missing]/page.tsx`（呼叫 `notFound()`，讓未知網址落到該語言的 404） | `NotFoundPage` | `notFoundMetadata` |
| `/lab/fungi`（僅中文、內部） | `(zh)/lab/fungi/page.tsx` | （頁面自己寫） | 內建，`noindex` |

- **i18n 工具**（`src/lib/i18n.ts`）：
  - `type Lang = "zh" | "en"`、`LANGS`
  - `type L10n<T = string> = Record<Lang, T>`：所有可翻譯欄位寫成 `{ zh, en }`
  - `pick(lang, v)`（＝`v[lang]`；程式中多半直接寫 `x[lang]`）
  - `localePath(lang, path)`：`"/events"` → `"/en/events"`（中文不變，`#hash` 不變）
  - `splitPath`、`switchPath`：給 `LangSwitch` 用（「中｜EN」，用純 `<a>` 整頁載入，因為兩語言是不同根 layout）
  - `HTML_LANG`（`zh-Hant-TW` / `en`）、`OG_LOCALE`
  - 頁面內固定文案慣例：元件頂端放 `const T = { zh: {…}, en: {…} } satisfies Record<Lang, unknown>`，或直接 `zh ? … : …`。
- **meta**（`src/lib/meta.ts`）：`rootMetadata(lang)`（根 layout 預設、title template）、`pageMetadata({ lang, path, title, description, ogTitle?, absoluteTitle? })`（canonical、hreflang `zh-Hant-TW` / `en` / `x-default`→中文、OG locale）。`SITE_NAME`。
- **sitemap**（`src/app/sitemap.ts`）：固定六頁 + 每個 `EVENTS` 的 `/events/<slug>`，每頁兩種語言並列 hreflang。新增活動會自動進 sitemap。`/lab/*` 不在其中。
- **robots**（`src/app/robots.ts`）：全站允許，指向 `${SITE.url}/sitemap.xml`。
- **轉址**（`next.config.ts` 的 `redirects()`）：
  - `/contact` → `/call-for-speakers`、`/en/contact` → `/en/call-for-speakers`（`permanent: false`）
  - `/events/cross-pollination-2026` → `/events/sustainable-urbanization-rewilding-2026`（中英各一，`permanent: true`；Vol. 01 舊名 "Cross-Pollination"）

### 3.2 內容檔各自控制什麼（`src/content/`）

改內容原則上只動這裡，不碰頁面程式碼。

| 檔案 | 主要匯出 | 控制 |
|---|---|---|
| `site.ts` | `SITE`、`SHOW_DRAFTS`、`OrgKey`、`Org`、`ORGS`、`CO_ORGANIZERS`、`PRINCIPLES`、`NAV`、`CALL_NAV`、`FAQ`、`CALL_FIELDS` | 站名、副標、tagline、網域、兩個表單網址、聯絡信箱、IG；機構（名稱、英文描述、網址、logo、暫代旗標）；三個共同主辦的介紹（首頁 `blurb`、關於頁 `role`/`detail`）；關於頁原則；主選單（`label` + 博物館式小標 `sub`）；「成為講者」按鈕；講者招募頁 FAQ；講者表單欄位（空白標籤 `BlankLabel`） |
| `events.ts` | `EventStatus`、`EventPlate`、`ProgramItem`、`ForumEvent`、`EVENTS`、`eventBySlug`、`upcomingEvents`、`pastEvents` | 每一冊活動（見第 5 章） |
| `speakers.ts` | `Identity`、`Place`、`CountryCode`、`COUNTRIES`、`Speaker`、`SPEAKERS`、`speakerById`、`catalogNo`、`LABEL_KINDS` | 講者資料、國家節點、講者編號 `ECO-S-NN`、身份標籤編號 |
| `disciplines.ts` | `DisciplineKey`、`Discipline`、`DISCIPLINES`、`disciplineByKey` | 交會圖譜的學科：名稱、兩字母代碼、線型名稱 |
| `crossings.ts` | `Desideratum`、`DESIDERATA` | 「下一跳 / Desiderata」學科配對與提問（首頁 hero 卡、活動頁、講者招募頁） |
| `voices.ts` | `Voice`、`VOICES` | 多元聲音影片（見第 7 章） |
| `fungi.ts` | `FungusId`、`FungusMeta`、`FUNGI`、`fungusMeta` | 菌類圖庫的名稱、學名、外形說明（圖在 `fungi/library.tsx`） |

### 3.3 主要元件（一行說明）

| 元件 | 說明 |
|---|---|
| `SiteShell.tsx` | 兩個根 layout 共用的 `<html>` 外殼 |
| `Header.tsx` | 標頭：品牌、「成為講者」CTA、選單（手機版含焦點鎖、Esc）、`LangSwitch` |
| `Footer.tsx` | 頁尾：簡介、迷你種子袋 `FollowCard compact`、目錄、共同主辦 |
| `LangSwitch.tsx` | 「中｜EN」切換，連到同頁另一語言 |
| `EngraveDefs.tsx` | 全站共用的隱藏 SVG defs（線型、陰影、符號、標誌） |
| `BrandMark.tsx` | `<use href="#mark">` 的品牌標誌 |
| `Typography.tsx` | `PlateHead`（Plate + 羅馬數字的區塊標題，h2）、`PageTitle`（內頁 h1 標題區，可選 `waterline`） |
| `WaterlineHeading.tsx` | 水線標題（簽名元素，每頁最多一個） |
| `Dividers.tsx` | `MareyDivider`（＝`FrogLeap` 蛙跳分隔線）、`PlateEdge`（兩種底色之間的版畫交界帶，`mode` `"lace"`/`"fingers"`） |
| `FrogLeap.tsx` | 青蛙跳躍圖（Fig. Saltatio ranae）與舌頭捕蝗蟲 |
| `LeapStage.tsx` | 「下一跳」小舞台：兩個棲點間跳的蝗蟲；`prey` 時提供給青蛙 |
| `Saltator.tsx` | 圖版內可點擊的蝗蟲（目前只在 `MangrovePlate`） |
| `mycorrhiza/MycorrhizaHero.tsx` + `engine.ts` | 首頁地上 / 地下 hero：樹、菇、蝗蟲、canvas 菌絲網 |
| `CrossingAtlas.tsx` | 交會圖譜（藍曬圖風格）：上方學科、中間講者根莖、下方地點；寬 / 窄兩版 |
| `NextCrossing.tsx` | Desiderata 卡（活動頁、講者招募頁） |
| `Specimen.tsx` | 講者台紙 `SpecimenSheet`、`Portrait`、`LabelStack`（身份標籤）、`Barcode`、`LinkGlyph` |
| `Fungi.tsx` | `Genet`：一個菌絲體、多個子實體（每朵菇＝一個身份）；講者卡右下角小菇（`corner`）與招募頁 |
| `fungi/library.tsx` | 菌類繪圖庫 |
| `Swatch.tsx` | 學科線型色票（`tip` 模式：hover / focus 顯示 tooltip） |
| `Loupe.tsx` | 圖版放大鏡（滑鼠跟隨；觸控 / 鍵盤用編號按鈕） |
| `plates/*` | 活動銅版畫圖版與註冊表 |
| `Volume.tsx` | `VolumeEmblem`（依 slug 產生的年輪徽記）、`ProgrammeToc`（目次式流程） |
| `Follow.tsx` | `FollowButton`、`FollowCard`（種子袋，追蹤未來活動表單） |
| `SpeakerCall.tsx` | `SpeakerFormButton`（講者表單）、`CallLink`、`BlankLabel`（空白標籤） |
| `about/PartnerMycorrhiza.tsx` + `PartnerTips.tsx` + `geometry.ts` | 關於頁標題區的圖：NTU 大王椰子、NYCU 竹叢、SOS 菌絲網，三者在地下朱紅節點交會，地上長出珊瑚菌（兼容並續）。標籤只寫縮寫，全名在 tooltip（見 8.9） |
| `Partners.tsx` | `CoOrganizers`（大印章）、`SpeakerAffiliations`（歷屆講者單位，自動彙整）、`allAffiliations()` |
| `CollectorStamp.tsx` | 藏書章式機構 logo（官方 logo 不重畫，外圈刻名） |
| `OrgLink.tsx` | 機構外連；`url` 為空時變成無效 `#` 加提示 |
| `EdgeEffectFigure.tsx` | 首頁 Pl. II 邊緣效應圖，可手動換學科組合 |
| `WhaleSea.tsx` | `/voices` 的水線海：海豚、座頭鯨、魚群、歌聲線 |
| `VideoCard.tsx` | 多元聲音舷窗卡（點擊才載入影片）、`TaipeiClock` |
| `RevealObserver.tsx` | `.reveal` 捲動淡入；有 `#hash` 時整頁關閉淡入 |
| `Rich.tsx` | 以 `dangerouslySetInnerHTML` 渲染 repo 內自己寫的含標記文案（`<span class="en">`、`<em>`、`<i>`） |
| `Logo.tsx` | logo `<img>` |

### 3.4 `src/lib/`

| 檔案 | 內容 |
|---|---|
| `i18n.ts` | 見 3.1 |
| `meta.ts` | 見 3.1 |
| `engrave.ts` | 決定性（seeded）產生器：`mulberry32`、`seedFrom`、`r2`、`roman`、`pad2`、`waterLines`、`stipple`、`leafClusters`、`edgeBand`、`emblemRings`、`greatCircle`、`project`、`arcPath`、`fmtCoord`、`hypha`、`hyphaLink`。同輸入同輸出，避免 hydration 不一致 |
| `mycelium.ts` | `rng`、`mushroom`、`grass`、`tree`、`hyphaPath`、`walker`、`toPath`、`measure`、`pointAt` |
| `leap.ts` | `leap()` 全站唯一的跳躍曲線、`prefersReducedMotion()` |
| `prey.ts` | 蝗蟲與青蛙之間的小 store：`registerPrey`、`getPrey`、事件 `ecotone:grasshopper-snatched` / `ecotone:grasshopper-respawn` |

---

## 4. 設計系統與不可違反的規則

> 本章是客戶決定，**逐條照做**。任何改動若碰到這些規則，先停下來問使用者。

### 4.1 品牌

- 品牌名：**「Ecotone｜兼容並續」**（全形直線 `｜`）。副標：**跨領域永續論壇**（英文 Interdisciplinary Sustainability Forum）。
- 「兼容並續」改自成語「兼容並蓄」：以「續」代「蓄」，兼容不同學科，並讓永續延續下去。
- 合作夥伴的 × 字樣一律寫 **「NTU × NYCU × SOS」**。× 字樣中**不加「Foundation」**。（機構全名或單獨提到時可寫「SOS Foundation」，例如共同主辦清單、關於頁。）

### 4.2 視覺語言與色彩 tokens

- 視覺語言：**銅版雕刻 / 精裝私家版（fine-press）博物學線畫**。鐵膽墨線在羊皮紙上、朱紅標出邊界與編目記號、藍曬（cyanotype）用於水與圖譜。
- 客戶指定的核心色：墨 `#1C1A17`、紙 `#F2ECDF`、朱紅 `#A8321F`、藍曬藍 `#3B6D96`，再加上青藍區塊底色。
- **`globals.css` `:root` 的實際 tokens：**

| token | 值 | 用途 |
|---|---|---|
| `--paper` | `#F2ECDF` | 主要紙色（也是 `themeColor`） |
| `--paper-2` | `#E8DFCB` | 較深的紙（`.sec--folio`） |
| `--card` | `#FAF6EC` | 卡片、標籤、線型圖磚底 |
| `--sheet` | `#FBF8F1` | 台紙 |
| `--ink` | `#1C1A17` | 墨 |
| `--ink-2` | `#3A352D` | 次墨（內文、bio） |
| `--sepia` | `#5E5141` | 次要文字、muted（這是**文字色**，不是照片濾鏡） |
| `--rule` | `#C9BCA2` | 細線 |
| `--cinnabar` | `#A8321F` | 朱紅：邊界、編目號、焦點框 |
| `--cin-light` | `#F2B8A4` | 深底上的朱紅（圖譜高亮） |
| `--gilt` | `#A9822F` | 金 |
| `--cyan` | `#173A5E` | **青藍區塊底色**（`.sec--cyan`，交會圖譜所在區） |
| `--cyan-ink` | `#E9EEF0` | 青藍底上的淺色線 / 字 |
| `--cyan-mute` | `#B4C6D4` | 青藍底上的次要字 |
| `--humus` | `#15120E` | 首頁地下（腐植土） |
| `--hypha` / `--hypha-2` | `#E9DFC6` / `#B3AA94` | 菌絲 |
| `--spore` | `#D8B25A` | 孢子金 |
| `--glow` | `#8FD3C1` | 生物螢光 / 海中歌聲線 |
| `--tide` / `--abyss` | `#14303A` / `#0A1820` | `/voices` 海水漸層 |
| `--fillp` | `var(--paper)` | SVG `.pf` 填色（版畫「紙」填色，深底區會改寫） |

- **藍曬藍 `#3B6D96` 不是 token**：它寫死在 `.wl-below`（水線標題水下的字色）與 `UrbanParkPlate.tsx` 的 `CYAN`（池水線）。新用途若需要它，請沿用這個值，或與使用者討論是否升成 token。
- 交會圖譜「空缺學科」用的近背景藍也是寫死值：`#1D4468`（圖磚底）、`#2C5479`（框與字，`--vac`）。
- 字型 tokens：`--f-zh`（Noto Serif TC）、`--f-lat`（Cormorant Garamond）、`--f-mono`（IBM Plex Mono）、`--f-cjk`。`--t-xs: 12px` 是任何標籤的**最小字級**。版面：`--max: 1320px`、`--m`（邊距 `clamp(16px, 5vw, 72px)`）、`--sec`、`--mast-h: 68px`。
- 英文頁的樣式覆寫集中在 `globals.css` 後段的 `html:lang(en) …` 區塊，不影響中文版。

### 4.3 講者台紙：看起來像標本，但不是標本

- 講者卡（`SpecimenSheet`）**可以看起來像**植物標本台紙：膠帶、肖像窗、身份標籤（I. / II. … `LABEL_KINDS`）、條碼、編號 `ECO-S-NN`、角落小菇。
- **文案絕不可稱講者為「標本」或 specimen**，中英皆然。現有的 `LABEL_KINDS` 都寫「身份 / Identity」。元件名 `SpecimenSheet`、檔名 `Specimen.tsx` 是程式識別字，不是文案，保留即可。
- 資料裡出現「標本」「specimens」是在描述**博物館館藏**（詹偉平的研究），不是指講者，這是允許的。

### 4.4 講者照片：永遠全彩

- **絕不**把講者肖像做成灰階、黑白或 sepia（含 CSS `filter: grayscale()` / `sepia()`、hover 去色、圖片本身去色）。在臺灣，在世者的黑白肖像會被讀成**遺照**。
- 規格：全彩、裁成 **4:5**、檔案 `public/speakers/<id>-4x5.jpg`，在 `speakers.ts` 填 `photo: "/speakers/<id>-4x5.jpg"`。`speakers.ts` 註解建議至少 1200×1500。焦點不在中央時用 `photoPos`（CSS `object-position`，如 `"72% 30%"`）。
- `globals.css` 裡 `.mounted img` 上方的註解就是這條規則的提醒，不要刪。
- 沒有照片時 `Portrait` 會顯示有「PHOTO PLACEHOLDER」標記的版畫佔位卡。

### 4.5 禁止的內容

- 全站**沒有、也不可加入**任何「Secret Slide」。

### 4.6 「報名」的意思與兩份表單

- 「報名」＝**講者申請**未來活動（Google Form），**不是**觀眾報名。觀眾想知道下一冊消息，用另一份「**追蹤未來活動**」表單（只收 e-mail 與選填欄位）。
- 兩份表單都是**中英雙語**，兩種語言頁面連到同一個網址（`src/content/site.ts`）：

| 表單 | 欄位 | 網址 | 渲染元件 |
|---|---|---|---|
| 講者招募 | `SITE.speakerFormUrl` | `https://forms.gle/BBCC85ocLYbZUs5G8` | `SpeakerFormButton`（`SpeakerCall.tsx`） |
| 追蹤未來活動 | `SITE.followFormUrl` | `https://forms.gle/HaViaLhxS1P4wGwFA` | `FollowButton` / `FollowCard`（`Follow.tsx`） |

- 欄位留空時按鈕會變成不可點的「表單即將開放」狀態。
- 表單是用 `scripts/create-google-forms.gs`（Google Apps Script，執行一次 `createEcotoneForms()`）建立的。注意：該腳本的 `DISCIPLINES` 清單是**表單用的分類**，和網站 `disciplines.ts` 不同，不會自動同步。

### 4.7 講者標準

- **跨領域，且與永續或自然有連結**（interdisciplinary AND connected to sustainability OR nature）。永續 / 自然的連結是必要條件（`CallPage.tsx` 的 `WANTED`：「這是必要條件」）；「不一樣的人生」不是必要條件。

### 4.8 文案風格

1. **繁體中文優先**，英文輕點綴（斜體 `<i>` 或中文頁裡的 `<span class="en">`）。
2. **中文介紹（bio）裡不混英文**，除了專有名詞：email、計畫名、公司、機構（例如 SOS Foundation、BioNarr、Salad Dressing、OMIC）。其他英文放在中文之後的括號裡，例如「營運決策（<span class="en">operational decision</span>）」。
3. **破折號（——、—）少用**。用句號、冒號、逗號改寫。
4. 講者**不用性別代名詞**（他 / 她 / he / she），用名字（例如「孫老師」「Yu Han」「Wei-Ping Chan」）。
5. **著作只寫標題、期刊、年份**。不寫第一作者、通訊作者、共同通訊、資深作者等標註。格式照現有資料：中文 `<i>標題</i>，期刊（年份）`；英文 `<i>Title</i>. Journal (Year)`。
6. 中文頁的英文名字行：`SpecimenSheet` 在中文頁顯示 `nameEn`（與 `name.zh` 相同時不重複），英文頁顯示 `short`。

### 4.9 多元聲音（Diverse Voices）

- 是**年齡、性別、族群、學歷、職業與生命經驗**的多元，不只是地理位置。
- **絕不**稱為「海外聲音」（舊名，已在 commit `2154c13` 改掉；`README.md` 仍有舊字，見第 10 章）。

### 4.10 水線標題（簽名元素，每頁最多一個）

目前使用位置（不要再加）：

| 頁面 | 位置 | 實作 |
|---|---|---|
| 首頁 | hero 的「兼容並續」 | `HomePage.tsx` 直接寫 `<span className="zh wl wl--hero">`（`.wl-above` / `.wl-below` / `.wl-line`），**不是**用 `WaterlineHeading` 元件；位於 `h1#hero-title` 內 |
| 活動頁 | 活動英文主標 | `EventPage.tsx` 的 `WaterlineHeading`（h1）；有圖版時 `contained` + `align="start"`，無圖版時置中 |
| 多元聲音 | 頁面標題「鯨歌越過海盆，聲音越過身份。」 | `VoicesPage.tsx` 的 `PageTitle waterline` |
| 歷屆講者 | **只在空狀態**（還沒有任何 past 活動）的「歷屆講者名錄，還在等第一批講者。」 | `SpeakersPage.tsx` 的 `WaterlineHeading as="h2" contained` |
| 404 | 「你越過了一條還不存在的邊界。」 | `NotFoundPage.tsx` 的 `WaterlineHeading`（h1） |

其他頁（`/events`、`/about`、`/call-for-speakers`、有 past 活動後的 `/speakers`）**沒有**水線標題，這是刻意的。

### 4.11 必須保留的「被喜愛的元素」

不可移除、簡化或「優化」掉：

- 首頁**菌絲 hero（地上 / 地下）**：`MycorrhizaHero` + `engine.ts`。
- `/voices` 的**鯨之海**：`WhaleSea`。
- **講者台紙**與**身份標籤**：`SpecimenSheet`、`LabelStack`。
- **學科線型**：`lt-*` patterns。
- **放大鏡**：`Loupe`。
- **種子袋追蹤卡**：每頁只一個完整的 `FollowCard`；頁尾迷你種子袋（`.seed-mini`）靠 CSS `body:has(main .seed-packet) .seed-mini { display: none; }` 自動隱藏。目前有完整種子袋的頁面：首頁（Pl. IV）、`/events`、活動頁、`/call-for-speakers`（「兩種參與方式」）。其他頁由頁尾迷你版負責。新頁面若放完整版，**不要**另外處理頁尾，`:has()` 會自動隱藏。
- **蝗蟲的跳躍**（`lib/leap.ts`、`LeapStage`、hero 兩隻蝗蟲）。
- **青蛙跳躍與舌頭捕食**（`FrogLeap`）。
- **菌類圖庫**（`fungi/library.tsx`、`/lab/fungi`）。

### 4.12 交會圖譜的空缺學科

- 沒有任何講者連到的學科，在 `CrossingAtlas` 裡畫成**接近背景的藍**（`.atlas-d.vacant`：底 `#1D4468`、框與字 `#2C5479`、虛線框、線型 `opacity .18`），像沉進圖版裡。不要改回醒目色。首頁 hero 的 canvas 中，空缺節點用虛線、較低透明度（`engine.ts`）。
- 繪製順序：空缺學科**最先畫**（在根系 `atlas-roots` 之下），有連結的學科、地點、講者在其上，空缺項目永遠不會遮住真正的連結。新增圖層時保持這個順序。

### 4.13 Logo 授權

- NTU / NYCU / NDHU 的校徽取自 Wikipedia（非自由授權、合理使用），**正式上線前需取得各校許可**。Tohoku 同樣需確認。
- 暫代 logo / 網址以 `ORGS[k].placeholder: true` 標記，設 `NEXT_PUBLIC_SHOW_DRAFTS=1` 時顯示「暫代」旗標。

---

## 5. 新增下一冊（下一冊 checklist）

### 5.1 `events.ts` 的 `ForumEvent` 欄位

在 `EVENTS` 陣列加一筆。可翻譯欄位寫 `{ zh, en }`。

| 欄位 | 型別 | 驅動什麼 |
|---|---|---|
| `slug` | `string` | 網址 `/events/<slug>`、`/en/events/<slug>`、sitemap；`VolumeEmblem` 年輪徽記由 slug 決定（`emblemRings(slug)`）。**上線後不要改**；要改就在 `next.config.ts` 加中英兩條 `permanent: true` 轉址 |
| `vol` | `number` | 冊號：`Vol. NN`（`pad2`）、`Pl. <羅馬數字>`（`roman`）、圖版上的 `PL. I`、`PlateEdge` 的 seed（`vol*13`、`vol*17`）、排序 |
| `title` | `string` | 英文主標，**兩種語言共用**；活動頁水線標題、首頁 hero 樹標籤、卡片 |
| `subtitle` | `L10n` | 副標（水線標題下方的 `en` 行、列表） |
| `kind` | `L10n` | 活動形式（「系列演講」），活動頁 vol 行與 meta description |
| `dateLabel` | `L10n` | 顯示用日期（「2026 年 11 月」） |
| `dateShort` | `string` | 卡片大字「2026.11」；頁面 `<title>`；首頁 hero 樹標籤 meta |
| `dateNote` | `L10n` | 日期補充（「確切日期確認中」） |
| `isoDate?` | `string` | `YYYY-MM-DD`。**目前沒有任何程式讀取**（預留給排序 / 結構化資料） |
| `venue` / `venueNote` | `L10n` | 地點 / 補充。`venueNote[lang].split(" · ")[0]` 會被首頁 hero 取為城市名，**請保持「城市 · 說明」格式** |
| `format` / `formatNote` | `L10n` | 形式與補充（活動頁資訊卡） |
| `language` | `L10n` | 語言，例如 `中文 + 英文` / `Mandarin + English` |
| `languageNote` | `L10n` | 語言補充；空字串則不顯示 |
| `talkLanguages?` | `L10n` | **已不再渲染**（舊的「講者區塊上方語言標籤」，CSS `.lang-tag` 也已無人使用）。可填可不填 |
| `status` | `"upcoming" \| "past" \| "planning"` | 見 5.2 |
| `statusLabel` | `L10n` | 顯示用狀態（「Vol. 01 · 籌備中」），在 `/events` 列表與首頁 Pl. IV 側標。**不會隨 `status` 自動改**，要手動改 |
| `summary` | `L10n` | 摘要（首頁 Pl. IV、`/events` 列表），可含 Rich 標記 |
| `intro` | `L10n<string[]>` | 活動頁標題下的段落 |
| `premise?` | `{ title, body }` | **仍在資料中但目前不渲染** |
| `speakers` | `string[]` | 講者 id，順序就是活動頁、首頁、hero 菇的順序 |
| `plate?` | `EventPlate` | 活動頁標題旁的圖版（`"mangrove"` / `"urbanpark"`） |
| `attendance` | `L10n` | 參加方式（活動頁、首頁 Pl. IV） |
| `program` | `ProgramItem[]` | 目次：`{ time?, title, detail }`。`time` 可省略（開場、對談），可放「Talk 1」或「19:00」。**`title.zh` 在同一冊內必須唯一**（當 React key） |

`eventBySlug(slug)`、`upcomingEvents()`（`status !== "past"`，所以 `planning` 也算 upcoming）、`pastEvents()`。

### 5.2 past / upcoming 邏輯與歷屆講者

- **首頁「最新一冊」**：`upcomingEvents()[0]`（**依 `EVENTS` 陣列順序**取第一個非 past），沒有則取 `vol` 最大者。所以：新冊上線時，**舊冊要改成 `past`**，否則首頁仍顯示舊冊（或把新冊放在陣列較前面，但建議以 status 控制）。
- **`/speakers` 歷屆講者**：只收 `status: "past"` 的活動講者，依冊號新到舊分區，每區是完整講者台紙，下面再加一張只含歷屆講者的交會圖譜。**沒有任何 past 活動時**顯示空狀態（空台紙插畫 + 水線標題 + 「待收錄」名單，名單取最小 vol 的 upcoming）。
- 所以**把 Vol. 01 改為 `status: "past"`，它的講者就自動出現在 /speakers**，空狀態與其水線標題同時消失。
- 首頁交會圖譜與「歷屆講者單位」則收**所有活動**（含 upcoming）的講者。

把上一冊轉為 past 時：
- [ ] `status: "past"`
- [ ] `statusLabel` 改成例如 `{ zh: "Vol. 01 · 已舉辦", en: "Vol. 01 · Held" }`（文字與使用者確認）
- [ ] `dateLabel`、`dateNote`、`venue`、`venueNote`、`attendance` 改成確定 / 已舉辦的描述
- [ ] 活動頁有寫死「尚未公布」的文案（見 5.7），past 活動看起來會不對，需改程式加條件

### 5.3 新增講者（`speakers.ts` 的 `Speaker`）

在 `SPEAKERS` **最後面**加（`catalogNo` 依陣列索引產生 `ECO-S-NN`，插在中間會讓既有講者編號全部位移）。然後在活動的 `speakers` 引用 `id`。

| 欄位 | 說明 |
|---|---|
| `id` | 小寫短代號，也是照片檔名、活動頁錨點 `#<id>` |
| `name` | `L10n`：中文頁 / 英文頁的顯示名 |
| `nameEn` | 中文頁名字下的羅馬拼音行（與 `name.zh` 相同時不顯示） |
| `initial` | `L10n`：無照片時的佔位字、圖譜頭像的後備字 |
| `eyebrow` | `string`：**目前不渲染** |
| `short` | 英文短描述（兩語共用）：英文頁名字下、首頁 mini 卡、hero 無障礙標籤 |
| `tags` | `L10n<string[]>`：**目前不渲染** |
| `identities` | `Identity[]`（`{ title: L10n, detail: L10n }`）：身份標籤，一張一個；數量會出現在「N 種身份」計數、hero、Genet 小菇數量。`title.zh` 需唯一 |
| `disciplines` | `DisciplineKey[]`：交會圖譜、hero 菌絲、講者卡線型色票。目前標註「待講者確認」 |
| `places` | `Place[]`：`{ name, lat, lng, approx?, country }`。`name` 是圖譜的地點 key，**同一地點在不同講者間要拼法一致**（如 `"Taipei"`）才會合併。`approx: true` 時卡片不顯示座標、圖譜顯示「≈」 |
| `orgs` | `OrgKey[]`：講者卡機構列、「歷屆講者單位」（`allAffiliations()` 自動彙整） |
| `bio` | `L10n`：中文可含 `<span class="en">…</span>`、英文用 `<em>…</em>`。遵守 4.8 |
| `talk?` | `L10n`：講題；沒有則顯示「講題確認中」 |
| `highlights?` | `{ zh, en, source? }[]`：亮點。`source` **不顯示**，僅供查核（可為網址或備註，如 `"wpc_website"`）。`zh` 需唯一 |
| `publications?` | `{ zh, en, source? }[]`：重要著作，可含 `<i>標題</i>`。**只寫標題、期刊、年份** |
| `photo?` | `/speakers/<id>-4x5.jpg`（全彩 4:5） |
| `photoPos?` | 裁切焦點 |
| `links?` | `{ kind: "lab" \| "personal", url, icon? }[]`：實驗室 / 個人網頁 chip（`LinkGlyph`） |
| `linkedOrgs?` | `OrgKey[]`：這些機構在卡片上保留超連結，其餘只顯示名稱 |
| `draftNote?` | `L10n`：卡片底部「†」註記，**正式站也會顯示**；確認後刪掉 |

新機構：在 `site.ts` 的 `OrgKey` 聯集與 `ORGS` 各加一筆（`name`、`nameEn`、`url`、`logo?`、`placeholder?`），logo 放 `public/logos/`。

新國家：在 `speakers.ts` 的 `CountryCode` 聯集與 `COUNTRIES` 加一筆（`{ zh, en }`）。首頁 hero 地下網絡只會畫出至少有一位講者在該國的國家節點。

### 5.4 首頁會自動改變的部分

- **hero 樹與冊標籤**（桌機才顯示）：`Vol. NN <title>`、`<dateShort> · <城市>`；旁邊的幽靈樹標籤「`Vol. ${EVENTS.length + 1}` · 籌備中」。
- **菇的數量與種類**：最新一冊每位講者一朵，種類 `HERO_SPECIES[i % 9]`（`HomePage.tsx`：`mycena, amanita, morchella, macrolepiota, coprinus, cantharellus, boletus, clathrus, geastrum`）。`MycorrhizaHero` 的位置與高度只為 **≤5 位**精心排過（`xs`、`hs`），超過 5 位會平均散開，請實際檢查構圖。
- **地下菌絲節點與連線**：所有 `DISCIPLINES`（空缺者標記 vacant）+ 用到的國家；每位講者連到自己的學科與國家。
- **「下一跳」配對**：`DESIDERATA` 依「還沒被講者碰過的學科」優先排序。
- **交會圖譜**（Pl. III）、側標 `N speakers · x/y fields`、圖說計數。
- **歷屆講者單位**（`SpeakerAffiliations`）。
- **Pl. IV 最新一冊**、mini 講者卡。
- 活動頁的計數（`speakers · identities · fields · places`）、`/events` 列表、關於頁 Provenance、下一冊空白圖版（`max(vol)+1`）都自動更新。

### 5.5 需要人工檢查的寫死文案（`grep` 找得到）

```bash
grep -rn "Vol\. 01\|ECO-001\|2026\|第一場\|第一冊\|第一批\|First volume\|first volume\|November\|11 月" src --include=*.tsx --include=*.ts
```

目前的清單：

| 檔案 | 內容 | 要做什麼 |
|---|---|---|
| `src/components/pages/HomePage.tsx` `homeMetadata` | 中英 description「第一場：2026 年 11 月 Sustainable Urbanization? Rewilding? 系列演講」/「First volume: … November 2026.」 | 改成新一冊或通用描述 |
| `src/components/pages/SpeakersPage.tsx` 空狀態 | `en="The collection begins after Vol. 01, November 2026."`、「第一冊」、fallback 字串 | 只在沒有 past 活動時出現；若仍會出現就改 |
| `src/components/Specimen.tsx` | `vol` 預設值 `"Vol. 01 · Sustainable Urbanization? Rewilding?"`（呼叫端都有傳，實際不會用到）；`Barcode code={\`ECO-001-${…}\`}` | `ECO-001` 看起來是系列編號，所有冊都一樣；要不要按冊變，先問使用者 |
| `EventsPage.tsx`、`AboutPage.tsx`、`HomePage.tsx`（Pl. II 側標） | `"ECO-001"` 編目字樣 | 同上，裝飾性 |
| `src/components/pages/EventPage.tsx` | 「流程為暫定版本，正式時間將於日期確認後公布。」；FollowCard 的 note「…的確切日期與地點尚未公布」；交會圖說「學科標註待講者確認」 | 日期確定 / 活動結束後必須改（可加條件判斷 `e.status` 或 `e.isoDate`） |
| `src/components/pages/HomePage.tsx` | `draft-note`「† 學科標註依講者目前公開的身份整理，待講者確認。」 | 講者確認後刪 |
| `src/content/events.ts` | `summary`「五位講者、十二種身份」、`intro`「五位」、對談「五位講者」 | 屬該冊內容，新冊自己寫；人數變動要同步 |
| `src/components/EdgeEffectFigure.tsx` | `PAIRS` 含「臺北 / 新加坡」 | 視需要調整 |
| `src/content/site.ts` `FAQ` | 「詳細的時程與安排，將於表單開放時一併說明」 | 表單已開放，文字可能需更新（問使用者） |
| `src/components/pages/VoicesPage.tsx` | 「† 影片陸續上線中；名單、地點與題目為暫定。」 | 見第 7 章 |

另外人工檢查：
- [ ] 圖版選擇：沿用 `urbanpark` / `mangrove` 或畫新的（第 8.1 節）。圖版上的 `PL. {plateNo}` 自動等於該冊羅馬數字。
- [ ] `FAQ`、`PRINCIPLES`、`CALL_FIELDS` 是否仍符合。
- [ ] `DESIDERATA` 是否要加入新學科的配對。
- [ ] 新講者文案符合 4.3、4.8。
- [ ] 手機版 hero：菇與標題是否重疊（`MycorrhizaHero` 依標題高度算樹高）。

### 5.6 舊冊需要轉址嗎？

- **不需要。** 舊冊保留在 `EVENTS`，`/events/<舊slug>` 永遠存在（`generateStaticParams` 產生所有冊）。
- 只有**改 slug** 時才加轉址，中英各一條，`permanent: true`，照 `next.config.ts` 現有 cross-pollination 的寫法。
- 不要從 `EVENTS` 刪除舊冊（`dynamicParams = false`，刪了就 404，而且會從歷屆講者消失）。

### 5.7 完整步驟（照順序）

1. [ ] `speakers.ts`：新講者 append 到 `SPEAKERS` 最後；照片 → `public/speakers/<id>-4x5.jpg`（全彩 4:5）。
2. [ ] `site.ts`：新機構加進 `OrgKey` + `ORGS`；logo → `public/logos/`（授權狀態寫 `placeholder` 與註解）。
3. [ ] `speakers.ts`：新國家加進 `CountryCode` + `COUNTRIES`。
4. [ ] `disciplines.ts` + `EngraveDefs.tsx`：如需新學科，照第 6 章。
5. [ ] `events.ts`：新增新冊；舊冊改 `status: "past"` 與 `statusLabel`。
6. [ ] 如需新圖版：`plates/` + `EventPlate` + `EVENT_PLATES`（第 8 章）。
7. [ ] 處理 5.5 的寫死文案。
8. [ ] 跑第 9 章 QA。

---

## 6. 新增學科（交會圖譜領域）

1. **`src/content/disciplines.ts`**
   - [ ] 在 `DisciplineKey` 聯集加 key（小寫英文）。
   - [ ] 在 `DISCIPLINES` 加 `{ key, name: { zh, en }, code, linetype: { zh, en } }`。`code` 是兩字母、像元素符號（首字大寫、次字小寫，如 `Ec`、`Tc`），**不可與既有重複**。`linetype` 是線型的名稱（例如「葉脈 / leaf venation」），會出現在關於頁圖例。
   - 陣列順序就是關於頁圖例、hero 節點放置的順序。
2. **`src/components/EngraveDefs.tsx`**
   - [ ] 在「discipline linetypes」區塊加 `<pattern id="lt-<key>" patternUnits="userSpaceOnUse" width=… height=…>`。**id 必須和 key 完全相同**，否則色票會是空白。
3. **線型繪製規則**（從現有 19 個 pattern 歸納）：
   - 墨色用常數 `INK`（`#1C1A17`）。朱紅最多當**一個小重點**（目前只有 `lt-education` 的紅色邊線）。不要用其他顏色：學科用**線型**區分，不用顏色。
   - 筆畫粗細 **0.35–0.8**，多數 0.4–0.6；實心小點、小橢圓可用。
   - 圖磚大小約 **5–24 單位**（`lt-medicine`、`lt-climate` 為 40 寬是特例）。最小顯示尺寸是圖譜的 **28×16** 與色票的 **36×18**：在這尺寸內必須至少看得到一個完整、可辨識的重複單元。
   - **不要畫背景填色**：底色由使用處提供（`#FAF6EC` 的 rect 疊在下面）。圖案要能疊在紙色、也能在交會圖譜被調成 `.18` 透明度。
   - 用 `patternTransform="rotate(…)"` 做斜向；用 `strokeDasharray` 做虛線類。
   - 要讓它跟既有 19 種在小尺寸下**明顯不同**（密度、方向、是否有點、是否有曲線）。檢查方式：`/about` 圖例，以及講者卡右上角。
4. **標註講者**：在講者的 `disciplines` 陣列加 key（客戶要求的標註都「待講者確認」）。
5. **自動產生的影響**：
   - 首頁 hero 地下網絡多一個節點（無講者時為虛線 vacant）。
   - 交會圖譜多一個學科；無講者時以近背景藍沉在圖中（4.12），窄版會列在「待連結的學科」文字中。
   - 講者卡的 `Swatch tip`：tooltip 顯示 `"<code> <name>"`，無障礙名稱中文頁為「中文 英文」。
   - `/call-for-speakers` 的「還空著的學科」清單。
   - `DESIDERATA`（`crossings.ts`）：如要讓新學科出現在「下一跳」，加 `{ a, b, question: { zh, en } }`；配對裡沒被碰過的學科越多，排序越前面。
   - 表單腳本 `scripts/create-google-forms.gs` 的分類**不會**跟著變（已建立的表單需在 Google Forms 手動改）。

---

## 7. 新增多元聲音影片

### 7.1 `voices.ts` 的 `Voice` 欄位

| 欄位 | 說明 |
|---|---|
| `id` | 唯一 id（`v1`…） |
| `name` | `L10n`：人名，或目前的佔位「多元聲音 01 / Voice 01」 |
| `role` | `L10n`：身份（高中生、護理師…）。用來呈現年齡、職業、生命經驗的多元，不只寫國家 |
| `location` | `string`：兩語共用的英文地名（`"Lanyu · Taiwan"`） |
| `prompt` | `L10n`：他回應的問題 |
| `youtubeId?` | YouTube 影片 id |
| `src?` | 自架 mp4，放 `public/voices/`（資料夾目前不存在，需建立） |
| `poster?` | 封面（16:9，建議 ≥1920×1080，放 `public/voices/`）。沒填而有 `youtubeId` 時用 `https://i.ytimg.com/vi/<id>/hqdefault.jpg` |
| `lat?` / `lng?` | 座標，顯示在舷窗卡與首頁預告；沒有則顯示「Loc. TBA / TBA」 |
| `approx?` | 地點僅區域示意，座標前加「≈」 |
| `tz?` | IANA 時區（`"Asia/Singapore"`）；有填才顯示「當地時間 · 臺北時間」時鐘 |

`youtubeId` 與 `src` 都空 → 卡片顯示「影片即將上線」，沒有播放鈕。

### 7.2 點擊才載入（click-to-load）

`VideoCard.tsx`：載入時只有封面圖（或羅盤佔位圖），**不嵌入任何第三方 iframe**。按下播放鈕後才換成 `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0` 的 iframe，或 `<video src controls autoPlay>`，舷窗打開成 16:9。不要改成預先載入 iframe（隱私與效能）。

### 7.3 出現在哪裡

- `/voices`：`WhaleSea` 裡的所有 `VOICES`，依陣列順序編「Sheet 01…」；`PageTitle` 目錄行顯示總數。
- 首頁「多元聲音」預告：`VOICES.slice(0, 4)`，只顯示前 4 筆的地點與座標。**排在前 4 的會被首頁看到**。
- 活動頁的多元聲音區塊只是文字 + 連結，不列影片。
- `CrossingAtlas` 有可選的 `voices` prop（把聲音畫成海那端的地點），但首頁已在 commit `4e61c1d` 刻意拿掉，**目前沒有地方傳入**。不要自行加回。

### 7.4 鯨之海

`WhaleSea` 是 `/voices` 的裝飾外框（全部 `aria-hidden`）：水線上方兩隻海豚跳躍、水花；水下座頭鯨沿歌聲線游過、魚群；影片卡是 children。動畫全是 CSS，在 `prefers-reduced-motion: reduce` 下海豚與水花隱藏。不要移除或簡化。

### 7.5 佔位變成真實聲音時要改的文案

- [ ] `voices.ts` 每筆的 `name`（從「多元聲音 0N」改成真名或對方同意的稱呼）、`role`、`location`、`prompt`、座標、`approx` 移除。
- [ ] `VoicesPage.tsx`：海中註記「† 影片陸續上線中；名單、地點與題目為暫定。」/ 英文版，全部到齊後刪除或改寫。
- [ ] `VoicesPage.tsx` 的 lead、`HomePage.tsx` 預告文字、`voicesMetadata` description 中列舉的身份（「高中生與退休教師、漁民與法官、原住民族部落與新住民家庭…」）是否與實際收錄相符。
- [ ] 文案永遠強調多元（年齡、性別、族群、學歷、職業、生命經驗），不寫「海外聲音」。

---

## 8. 插畫與動畫指南

### 8.1 新活動圖版（`src/components/plates/`）

參考 `UrbanParkPlate.tsx`（最新、最完整）與 `MangrovePlate.tsx`。

**註冊：**
1. [ ] 新檔 `src/components/plates/<Name>Plate.tsx`，預設匯出 `function <Name>Plate({ plateNo = "I", lang = "zh" }: { plateNo?: string; lang?: Lang })`。
2. [ ] `src/content/events.ts`：`EventPlate` 聯集加 key。
3. [ ] `src/components/plates/index.tsx`：`EVENT_PLATES` 加 `<key>: <Name>Plate`。
4. [ ] 活動的 `plate: "<key>"`。`EventPage` 會傳 `plateNo={roman(e.vol)}`，並把標題改成靠左 `contained` 的水線標題。

**結構（照現有圖版）：**
- 伺服器元件（沒有 `"use client"`），唯一的 client island 是 `Loupe`（Mangrove 另有 `Saltator`）。
- `<figure className="plate-fig plate-fig--portrait">` → `<Loupe artId="<key>-art" viewBox=… lang spots=[…]>` → `<svg className="art" viewBox=… role="img" aria-labelledby="<key>-title <key>-desc">`，內含 `<title id>` 與 `<desc id>`（中英文 `T` 物件，`desc` 要完整描述畫面）。
- 所有自訂 id（clipPath、pattern、symbol）加**圖版專屬前綴**（`urbanpark-…`），避免與全站或其他圖版撞名。
- 畫面主體包在 `<g id="<key>-art">`（Loupe 用 `<use href="#<key>-art">` 放大這一組）。
- **紙張 600×760**：`<rect width="600" height="760" fill={PAPER} />`；雙框 `x/y=12, 576×736, strokeWidth 1.6` 與 `x/y=20, 560×720, strokeWidth .5`。
- **頂部**：`PL. {plateNo}`（`svg-mono`、朱紅）於 (36, 48)；拉丁標題（`svg-mono`、sepia，如 `ECOTONUS · URBS ET SILVA`）；細線 y=58。
- **底部**：細線 y=716；斜體圖說（`svg-italic`，拉丁 / 英文）於 (36, 732)；右側座標 `svg-mono svg-mono--sm`（如 `25°02′N 121°32′E`）。
- **拉丁學名標註**：在畫面內以 `svg-italic`、sepia 標出（如 `Ficus microcarpa`）。
- **編號標註**（callouts）：`<g className="svg-key" fill={CIN} textAnchor="middle">`，朱紅細引線（.6）+ 紙色圓 `r=9`（朱紅框 .7）+ 數字。
- **Loupe spots**：`{ n, x, y, label }`，座標用 viewBox 單位，`label` 來自 `T[lang].spots`，與編號一致。
- **雙語圖例**：`<figcaption>` 內 `<span className="t"><b>Pl. {plateNo}</b>…</span>`、一句說明（含 `<span className="hint-fine">移動滑鼠以放大鏡觀察，</span>`，觸控裝置自動隱藏）、`<ol className="plate-key">` 每項 `<b>n</b>中文名 <i>學名</i> · 一句話`。中英各一份。
- **破框設計**（frame-breaking）：`UrbanParkPlate` 讓榕樹樹冠衝出畫框。做法是把 viewBox 往上、往右擴大（`VIEWBOX = "0 -46 654 806"`），紙張仍是 600×760，超出部分不被裁切；Loupe 的 `viewBox` 也要用同一個值。Mangrove 不破框。新圖版可選擇用一個元素破框，但每張最多一處。
- **上墨動畫**：外層 `<g className="plate-ink">`，主要輪廓加 `className="ink"` 與 `{...ink()}`（`pathLength: 1` + 交錯的 `animationDelay`）。其他動畫用既有 CSS class：`.sway`（葉子擺動）、`.orbit`（飛蛾繞燈）、`.drift`（落葉），全部只在 `prefers-reduced-motion: no-preference` 生效。
- 數值生成用 `lib/engrave.ts` 的決定性工具（`stipple`、`waterLines`、`leafClusters`、`mulberry32`），**不要用 `Math.random()`**（伺服器 / 客戶端會不一致）。

### 8.2 菌類圖庫

- **繪圖**：`src/components/fungi/library.tsx`。每個物種一個函式，回傳 `Drawing = { w, h, parts: Part[] }`；`Part = { d, k }`，`k` 為 `PartKind`：
  - `"body"`：填紙色 + 外框（筆畫 1）
  - `"cap"`：同 body，且可被高亮（class `fungus-cap`，hero hover 時填 `#E9D6A2`）
  - `"line"`：只有外框（1）
  - `"fine"`：細節線（.55，透明度 .75）
  - `"dot"`：實心墨點
- **座標慣例**：基點（土線）在 (0, 0)，往上長（y < 0），自然高度約 100 單位；**不可用隨機數**。
- **API**：`drawing(id)`（有快取）、`fungusWidth(id, height)`、`FungusParts`、`<Fungus species height x y className color />`（SVG 內使用，預設 `aria-hidden`，筆畫 `vector-effect: non-scaling-stroke`，縮放不變粗）、`FungusSymbols`、`speciesRow(n, seed, pool?)`（相鄰不重複的決定性選取）。
- **資料**：`src/content/fungi.ts` 的 `FungusId`、`FUNGI`（`name`、`latin`、`form`）。
- **新增物種**：`FungusId` 加 id → `FUNGI` 加 meta → `library.tsx` 寫函式並加進 `FUNGUS_DRAWINGS` → 到 `/lab/fungi` 檢查。若要出現在首頁 hero，加進 `HomePage.tsx` 的 `HERO_SPECIES`。
- **使用處**：首頁 hero 的菇（每位講者一朵）、講者卡右下角 `Genet corner`（每個身份一朵，`speciesRow`）、`/call-for-speakers` 的 Genet、`/speakers` 空狀態插畫。
- **`/lab/fungi`**：內部圖庫，未連結、不在 sitemap、`noindex`。

### 8.3 蝗蟲跳躍系統

- **一種蝗蟲、一種跳法。** 畫法只有 `EngraveDefs` 的 `#grasshopper`；跳躍曲線只有 `lib/leap.ts` 的 `leap({ x0, y0, x1, y1, peak, dur?, onFrame, onDone? })`：蹲（160ms）→ 起跳與飛行（`dur`，預設 800）→ 落地壓縮（140ms）。`onFrame` 收到 `LeapFrame { x, y, rot, squash, kick, flip }`，`kick` 寫進 `--kick` 讓後腿踢。`prefersReducedMotion()` 時直接瞬移到終點。
- **使用者**：
  - `MycorrhizaHero`：兩隻（大的同時是「長出新的連結」按鈕的跳躍者，小的約 0.72 峰高）；每 6–12 秒自動跳一或兩隻，只在畫面內、分頁可見時。
  - `LeapStage`：「下一跳」卡的小舞台，`trigger` 改變就跳；每 14–24 秒自動跳（`ambient`）；`prey` 時把自己註冊給青蛙。目前**只有首頁 hero 的下一跳卡**設 `prey`；`NextCrossing`（活動頁、招募頁）沒有。
  - `Saltator`：圖版內可點擊（Enter / Space）的蝗蟲，第一次看到時自動跳去再跳回。
- 新增蝗蟲請一律用 `<use href="#grasshopper">` + `leap()`，不要另畫、不要自寫曲線。

### 8.4 青蛙（`FrogLeap.tsx`、`lib/prey.ts`）

- 透過 `Dividers.tsx` 的 `MareyDivider` 使用：首頁（hero 之後，有圖說）與活動頁（講者之後，`caption={false}`）。
- 每次捲入畫面（≥50%）跑一趟：從左邊進、落地一或兩次、從右邊出，每趟隨機且與上一趟不同（`plan()`）。三個姿勢 `#frog-sit / fly / land`。**跳過不留軌跡**（`frog-trail`、ghost 群組保留但不再填入）。窄螢幕會放大青蛙、降低弧高。
- **舌頭**：每 **2–3 趟**（`gap()`）嘗試一次「狩獵」：強制兩次落地，第二次落地時若 `getPrey()?.available()`（蝗蟲在畫面內 ≥60%、靜止、分頁可見、沒被吃掉），就由 `snapTongue()` 在 `document.body` 畫一個固定定位的覆蓋 SVG（`.frog-tongue`）：出 90ms、停 40ms、收 130ms，把一隻 `#grasshopper` 帶回嘴裡，然後吞嚥（200ms）。被吃的蝗蟲 1 秒後淡入重生（按下一跳會立刻重生）。失敗就下一趟再試。
- 因為只有首頁有 prey，**舌頭只會在首頁發生**。
- `prefers-reduced-motion: reduce`：只顯示一隻靜止的青蛙，沒有跳躍與舌頭。

### 8.5 水線標題 API（`WaterlineHeading.tsx`）

```tsx
<WaterlineHeading
  as="h1"            // 或 "h2"，預設 h1
  id="ev-title"
  align="start"      // 或 "center"
  contained={false}  // true：水線只延伸到標題欄內（旁邊有插畫時）；false：全寬
  waterline={0.6}    // 選填：0–1 覆寫水線位置；預設自動對齊最後一行字身
  en="English line"  // 選填：下方 Cormorant 斜體一行
  className=""
>
  標題文字
</WaterlineHeading>
```
- 結構：`.wl-above`（墨色，可選取、可讀）、`.wl-below`（同文字的視覺複本，`aria-hidden`、不可選，藍曬藍、略偏斜，像在水下）、`.wl-line`（朱紅虛線，`wlbreath` 緩慢呼吸，減少動態時靜止）。
- 也可用 `PageTitle` 的 `waterline` prop。
- **每頁最多一個**（見 4.10）。

### 8.6 減少動態與效能規則

- 所有 CSS 動畫寫在 `@media (prefers-reduced-motion: no-preference)` 裡；`globals.css` 另有全域 `reduce` 規則把動畫與轉場縮到 .01ms。
- JS 動畫一律先檢查 `prefersReducedMotion()`（或 `matchMedia`），在 reduce 下改成靜態或瞬移（`leap`、`LeapStage`、`Saltator`、`FrogLeap`、hero、`engine.ts` 的 `reduced`）。
- 自動動畫只在**畫面內**（IntersectionObserver）且**分頁可見**（`!document.hidden`）時執行；離開時取消 `requestAnimationFrame`、清掉 timer、`disconnect` observer。
- 生成圖形用 seeded 產生器（`engrave.ts`、`mycelium.ts`），不用 `Math.random()`（`Math.random` 只用在客戶端的動作時機）。
- hero 的 canvas 以 `devicePixelRatio` 上限 2 繪製；寬度變化才重排（resize debounce 220ms）。
- 第三方影片點擊才載入。
- `.reveal` 淡入：只在有 JS（`html.js`）且允許動態時隱藏；帶 `#hash` 進頁會整頁關閉（`RevealObserver`）。

### 8.7 品牌標誌與網站圖示

- **`#mark`**（`EngraveDefs.tsx`，viewBox 40×40）：珊瑚菌從潮線升起，外側分枝捲成圓框，潮線（朱紅 `#A8321F`）以下主幹化為菌絲。墨色全部用 `currentColor`、**沒有紙色填色**，所以任何底色都能用。`BrandMark` 以 `<use href="#mark">` 使用（標頭 32px、頁尾 36px）。
  - 注意：`BrandMark.tsx` 的註解仍寫舊版「放大鏡 + 水筆仔胎生苗」，已過時；以 `EngraveDefs` 為準。
- **`src/app/icon.svg`**：32×32 favicon，紙色圓角底 `#F2ECDF` + 簡化版標誌（線加粗、少分枝），檔內註解寫明對應 `#mark`。
- **`src/app/apple-icon.png`**：180×180 PNG，紙色底上的標誌。
- **生成方式**：PNG 是用 `sharp`（Next.js 相依套件，已在 `node_modules/sharp`）把 SVG 點陣化產生的；**repo 裡沒有提交生成腳本**。改標誌時：
  1. 改 `EngraveDefs` 的 `#mark`。
  2. 同步改 `icon.svg`（小尺寸要加粗筆畫、刪細節，確保 16px 可辨）。
  3. 做一個 180×180 的獨立 SVG（紙色底 + 標誌，放在暫存資料夾），用 sharp 輸出：
     ```bash
     node -e "require('sharp')(process.argv[1],{density:300}).resize(180,180).png().toFile('src/app/apple-icon.png')" "<暫存路徑>/apple-icon-180.svg"
     ```
  4. 用 Read / 圖片檢視器確認 PNG。

### 8.8 筆畫、排線、用色、SVG 文字

- **筆畫**：主要輪廓 0.9–1.2（圖版外框 1.6），一般細節 0.5–0.8，細紋 0.35–0.5。版畫符號在 symbol 內的筆畫隨縮放變化；需要固定粗細時用 `vectorEffect="non-scaling-stroke"`（菌類、`PlateEdge`）。
- **排線密度**：用既有 pattern：`hatch`（2.6 間距，主陰影）、`hatchW`（3.4，較淡的遠景）、`hatchC`（朱紅，只標「交會帶」）、`stip`（土壤、泥灘）。不要另造新的灰色陰影或漸層。
- **用色**：墨為主、紙為底；**朱紅節制使用**，只用在邊界線（潮線、鋪面盡頭、水線）、編目號、標註編號、少數重點（埋葬蟲斑紋、燈芯）。藍曬藍只用於水與圖譜。不使用其他彩度高的顏色（例外：hero 樹葉的淡綠 `#6F8A5B` 與地下的螢光色，屬既有設計）。
- **填色**：版畫形體用 class `pf`（`fill: var(--fillp)`），深底區會自動改紙色。
- **SVG 文字**用 `globals.css` 的 class，不要寫 inline font：
  - `svg-mono`（10px）、`svg-mono--sm`（8.5）、`svg-mono--xs`（9）、`svg-mono--ring`、`svg-mono--band`：編號、座標、標籤
  - `svg-italic`（Cormorant 斜體 12px）、`svg-italic--lg`、`svg-italic--emblem`：拉丁學名、圖說
  - `svg-zh`（13px）、`svg-zh--sm`、`svg-zh--cell`、`svg-zh--lg`：中文
  - `svg-label`（19px 斜體）：大型英文標籤
  - `svg-key`：標註編號
- HTML 標籤字級不低於 `--t-xs`（12px）。

### 8.9 Tooltip 模式

全站有兩種 tooltip，外觀一致：**墨底紙字、小字（約 .8rem）、無箭頭**。新 tooltip 請沿用其中一種，不要另做樣式。

1. **純 CSS（短標籤）**：`.swatch--tip::after` / `.affil--icon::after`，內容來自 `data-tip`，`:hover` 與 `:focus` 顯示。元素要有 `tabIndex={0}` 與 `aria-label`（或 `role="img"`）。適合單行、位置固定、不會碰到螢幕邊緣的情況。
2. **HTML 疊層（圖上的熱區）**：`about/PartnerTips.tsx`（`.pmf-layer` / `.pmf-spot` / `.pmf-tip`）。用在 SVG 插圖上：
   - SVG 本身維持 `role="img"` + `<title>` + `<desc>`（desc 寫出全名），**熱區不放在 SVG 裡**，而是疊在上方、以 viewBox 座標換算成百分比定位的 HTML 元素。
   - 每個對象**一個** `<button>`（Tab 停點），`aria-label` 為縮寫，`aria-describedby` 指向一個常駐的 `.sr-only` 全名；畫面上的 tooltip 是 `aria-hidden` 的視覺複本。其他熱區（例如椰子根、菌絲區）是 `aria-hidden` 的 `<span>`，只接 hover / tap。
   - 開啟方式：滑鼠 hover（`pointerType === "mouse"`）；鍵盤 focus（只在 `:focus-visible` 時）；觸控 tap 切換（`pointerType` 為 touch / pen）；鍵盤 Enter / Space 也切換。Esc、點外面、視窗 resize 會關閉。滑鼠點擊不切換（hover 已顯示）。
   - **不出畫面**：開啟後量測，太靠近頂端（含 sticky 標頭 `--mast-h`）就翻到錨點下方（`data-below="true"`），左右超出就以 `--dx` 夾回距視窗邊緣 8px 內。375px 手機上 NYCU 的長全名會被夾在右緣內。
   - 淡入動畫只在 `prefers-reduced-motion: no-preference`。
   - SOS 的全名在 tooltip 寫 **Sustainability of Sustainability Foundation**（中文頁前面加「SOS 基金會」）；圖上標籤只寫 NTU / NYCU / SOS。

---

## 9. Push 前的 QA checklist

- [ ] `npm run lint` 無錯誤。
- [ ] Build 成功：`npm run build`；若 dev / start 正在跑，用 `NEXT_DIST_DIR=.next-check npm run build`（Windows 上 `next start` 會鎖 `.next`）。
- [ ] `git diff tsconfig.json` 沒有變化；有就 `git checkout -- tsconfig.json`。
- [ ] 兩種語言都看過：`/…` 與 `/en/…`（含 `LangSwitch` 切換後是同一頁）。
- [ ] **375px 手機寬**與桌機寬度都檢查，**沒有水平捲軸**（`document.documentElement.scrollWidth <= innerWidth`）。
- [ ] 開啟 `prefers-reduced-motion: reduce` 檢查：沒有跳動、頁面內容完整可見。
- [ ] 每頁**只有一個 `<h1>`**。
- [ ] 每頁**最多一個水線標題**（`.wl` 元素數 ≤ 1）。
- [ ] 每頁最多一個完整種子袋 `.seed-packet`。
- [ ] 講者照片沒有任何去色濾鏡。
- [ ] 禁用字 grep（應只命中允許的地方）：
  ```bash
  grep -rn "標本\|specimen\|Secret\|海外聲音\|第一作者\|通訊作者" src
  ```
  目前允許的命中：程式識別字 `SpecimenSheet` / `Specimen.tsx` / `you-the-next-specimen`（seed 字串）、`Fungi.tsx` 與 `Specimen.tsx` / `speakers.ts` 中提醒「不可稱講者為標本」的**註解**、以及詹偉平資料中描述**博物館館藏**的「標本 3D 數位化」「museum specimens」。任何把講者稱為標本的文案都不允許。
- [ ] 破折號 grep：`grep -rn "—" src/content src/components/pages`，文案中盡量為零（註解不限）。
- [ ] 新增的連結 `target="_blank"` 都有 `rel="noopener noreferrer"`。
- [ ] Commit 訊息風格（照 `git log`）：英文、一行摘要用「區域: 做了什麼」，例如 `Atlas: vacant fields sink into the plate in a near-background blue`、`Follow: one seed packet per page`、`Chan: add lab website link (SOS research)`；需要時空一行寫說明；結尾加 `Co-Authored-By:` trailer（依當下環境指示）。
- [ ] **使用者明確要求才 push**（push 到 `main` 即自動部署上線）。

---

## 10. 已知的佔位與待辦

### 10.1 內容佔位

| 項目 | 位置 | 狀態 |
|---|---|---|
| Vol. 01 確切日期 | `events.ts`：`dateNote`「確切日期確認中」、`isoDate` 未填 | 待定 |
| Vol. 01 地點 | `events.ts`：`venue`「地點確認中」 | 待定 |
| 參加方式 | `events.ts`：`attendance`「活動資訊即將公布…」 | 待定 |
| 流程時間 | `EventPage.tsx`「流程為暫定版本…」 | 待定 |
| 聯絡信箱 | `site.ts`：`contactEmail: ""`（顯示「待公布」） | 待補 |
| Instagram | `site.ts`：`instagram: ""`（空則不顯示） | 待補 |
| SALAD Dressing logo | `public/logos/salad-placeholder.svg`，`ORGS.salad.placeholder: true` | 待換正式 logo |
| SALAD Dressing 網址 | `ORGS.salad.url` 已是 `https://www.saladlandscape.com/`，但註解仍寫「暫用 ArchDaily 頁面」，且仍標 `placeholder: true` | 需確認網址是否已正確，再更新註解與旗標 |
| BioNarr 網址與 logo | `ORGS.bionarr`：`url: ""`、無 logo、`placeholder: true` | 待補 |
| Harvard logo | `ORGS.harvard` 無 logo（印章顯示文字） | 視需要 |
| 校徽授權 | NTU / NYCU / NDHU（Wikipedia 合理使用）、Tohoku | 需各校許可 |
| 講者介紹草稿 | `draftNote`：孫烜駿、顏訥（`DRAFT`）、Goh Yu Han（含 SALAD logo / 網址暫代）、王鼎涵（所屬單位與職稱待確認） | 待講者確認；確認後刪 `draftNote` |
| Hank Wang（王鼎涵） | 英文名「Hank Wang」、職稱（如「牙醫副院長 / Dentist and deputy superintendent」）待確認 | 待確認 |
| 學科標註 | 所有講者 `disciplines`；首頁「† 學科標註…待講者確認」、活動頁圖說 | 待講者確認 |
| 多元聲音 | `voices.ts` 六筆全是佔位（無影片、名字為「多元聲音 0N」、部分 `approx`）；`VoicesPage` 暫定註記 | 待補 |

### 10.2 程式中的不一致 / 殘留（修之前先問）

- 未使用的資料 / 資產：`ForumEvent.talkLanguages`、`premise`、`isoDate`；`Speaker.eyebrow`、`tags`；CSS `.lang-tag`；`EngraveDefs` 的 `#whale`、`hatchL`、`fungus-<id>` symbols；`public/logos/sos-icon.svg`；`CrossingAtlas` 的 `voices` prop。
- 首頁幽靈冊號用 `EVENTS.length + 1`，`/events` 與 `/about` 用 `max(vol) + 1`；冊號連續時結果相同。
- 首頁最新一冊取 `upcomingEvents()[0]`，依陣列順序而非冊號（見 5.2）。
- `SHOW_DRAFTS` 不控制 `draftNote`（見 1.2）。
- `MangrovePlate` 目前沒有任何活動使用，但仍保留且可用。
- `/lab/fungi` 只有中文路由（`(zh)`），沒有 `/en/lab/fungi`。
