# ECOTONE · 跨領域永續論壇

NTU × NYCU × SOS Foundation 共同發起的跨領域永續論壇平台。
第一場：**Cross-Pollination** 系列演講（2026 年 11 月）。

> **Ecotone**（生態交會帶）是兩個生態系交界的過渡帶，往往也是物種最豐富的地方。論壇取這個名字，是因為我們相信學科的交界處也是想法最多元的地方。

## Tech

- Next.js 16 (App Router) + TypeScript，與 SOS 網站同一個技術棧
- 純 CSS 設計系統（`src/app/globals.css`），沒有 UI framework
- 所有頁面在 build 時預先產生成靜態頁面，部署到 Vercel 後即可直接加上 API route、表單等動態功能

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## 內容怎麼改

改內容不用碰頁面程式碼，只要編輯 `src/content/`：

| 檔案 | 內容 |
|---|---|
| `site.ts` | 報名網址 `registrationUrl`、聯絡信箱 `contactEmail`、合作單位官網與 logo（`ORGS`） |
| `events.ts` | 活動列表。**新增一場活動 = 加一筆**，`/events/<slug>` 會自動產生 |
| `speakers.ts` | 講者、多重身份 (`identities`)、介紹、照片 |
| `voices.ts` | 海外聲音影片。填 `youtubeId` 或 `src`（mp4 放 `public/voices/`）就會上線 |

- 講者照片：放 `public/speakers/<id>.jpg`，在 `speakers.ts` 填 `photo: "/speakers/<id>.jpg"`
- Logo：在 `public/logos/`

## 待補 / Placeholder 清單

- [ ] 活動確切日期、地點（`events.ts`）
- [ ] 報名表單網址、聯絡信箱（`site.ts`）
- [ ] SALAD Dressing 官網與正式 logo（目前暫用 ArchDaily 頁面與自製佔位圖 `salad-placeholder.svg`）
- [ ] BioNarr 官網
- [ ] 講者照片、講題、英文姓名確認，以及標記「草稿」的介紹內容
- [ ] Secret Slide 規則定案
- [ ] 海外聲音影片與名單
- [ ] 校徽使用授權：NTU / NYCU / NDHU 校徽取自 Wikipedia（非自由授權的合理使用檔案），正式上線前請向各校公關確認

## 部署（Vercel）

1. 到 [vercel.com/new](https://vercel.com/new) 匯入這個 GitHub repo（Framework 會自動偵測為 Next.js，不需要額外設定）
2. 環境變數：`NEXT_PUBLIC_SITE_URL` = 正式網域（例如 `https://forum.<sos-domain>`），用於 sitemap、OG 與 canonical
3. 自訂網域：Vercel → Project → Settings → Domains 加入網域，例如 SOS 網域的子網域 `forum.xxx`，再依指示到 DNS 加一筆 CNAME 指向 `cname.vercel-dns.com`

之後每次 push 到 `main` 都會自動部署。
