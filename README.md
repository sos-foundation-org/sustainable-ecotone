# Ecotone｜兼容並續

> **AI / 維護者請先讀 [`AI-README.md`](./AI-README.md)**：網站架構、設計規則、新增一冊／領域／多元聲音影片的完整步驟，以及樣式圖庫位置。

NTU × NYCU × SOS Foundation 共同發起的跨領域永續論壇平台。
「兼容並續」改自「兼容並蓄」：兼容不同學科，並讓永續延續下去。
第一場：**Sustainable Urbanization? Rewilding?** 系列演講（2026 年 11 月）。

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
| `site.ts` | 講者招募表單 `speakerFormUrl`、追蹤未來活動表單 `followFormUrl`、聯絡信箱、合作單位（`ORGS`）、導覽、原則、FAQ |
| `events.ts` | 活動列表。**新增一場活動 = 加一筆**；`/events/<slug>`、圖版編號與年輪徽記會自動產生。`plate` 可選用一張銅版畫圖版（目前有 `"mangrove"`）。`status: "past"` 的活動，其講者會自動收錄到「歷屆講者」 |
| `speakers.ts` | 講者、多重身份 (`identities`)、學科 (`disciplines`)、地點 (`places`)、介紹、照片 |
| `disciplines.ts` | 學科與其製圖線型（新增學科需在 `EngraveDefs.tsx` 補一個 `lt-<key>` pattern） |
| `crossings.ts` | 首頁「交會圖版」與「下一跳 / Desiderata」提問 |
| `voices.ts` | 多元聲音影片：`youtubeId` 或 `src`、`poster`、`lat`/`lng`、時區 `tz` |

- 講者照片：裁成 4:5 後放 `public/speakers/<id>-4x5.jpg`，在 `speakers.ts` 填 `photo: "/speakers/<id>-4x5.jpg"`；**全彩，不可做灰階或褐色調**
- 兩個表單網址留空時，按鈕會顯示「表單即將開放」/「追蹤表單即將開放」
- `/contact` 會轉址到 `/call-for-speakers`（講者招募＋一般聯絡）

## 待補 / Placeholder 清單

- [ ] 活動確切日期、地點（`events.ts`）
- [ ] 講者招募表單、追蹤未來活動表單、聯絡信箱（`site.ts`）
- [ ] SALAD Dressing 官網與正式 logo（目前暫用 ArchDaily 頁面與自製佔位圖 `salad-placeholder.svg`）
- [ ] BioNarr 官網與 logo
- [ ] 講者照片、講題、英文姓名確認，以及標記「草稿」的介紹內容；學科標註 `disciplines` 待講者確認
- [ ] 多元聲音影片、封面、名單與地點
- [ ] 校徽使用授權：NTU / NYCU / NDHU 校徽取自 Wikipedia（非自由授權的合理使用檔案），正式上線前請向各校公關確認

## 部署（Vercel）

1. 到 [vercel.com/new](https://vercel.com/new) 匯入這個 GitHub repo（Framework 會自動偵測為 Next.js，不需要額外設定）
2. 環境變數：`NEXT_PUBLIC_SITE_URL` = 正式網域（例如 `https://forum.<sos-domain>`），用於 sitemap、OG 與 canonical
3. 自訂網域：Vercel → Project → Settings → Domains 加入網域，例如 SOS 網域的子網域 `forum.xxx`，再依指示到 DNS 加一筆 CNAME 指向 `cname.vercel-dns.com`

之後每次 push 到 `main` 都會自動部署。
