// Renders the 1200×630 share cards public/og/ecotone-zh.png and ecotone-en.png with sharp
// (a Next.js dependency, already in node_modules). Needs Noto Serif TC installed locally. Run from the repo root:
//   node scripts/og-image.mjs
import sharp from "sharp";

const INK = "#1C1A17", PAPER = "#F2ECDF", CIN = "#A8321F", CYAN = "#3B6D96", SEPIA = "#5E5141", RULE = "#C9BCA2";

const mark = `
<g fill="none" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6.92 6.92A18.5 18.5 0 1 0 33.08 6.92" stroke-width="1.5"/>
  <path d="M19.2 16.6C18.2 13.6 13.3 6.2 12.2 5.2C10.9 4.05 8.9 4.95 6.92 6.92" stroke-width="1.7"/>
  <path d="M20.8 16.6C21.8 13.6 26.7 6.2 27.8 5.2C29.1 4.05 31.1 4.95 33.08 6.92" stroke-width="1.7"/>
  <path d="M20 22C20.1 20 19.9 18.4 20 16.4V7.4" stroke-width="2.4"/>
  <path d="M16.6 11.2C16 9.8 15.8 8.6 16 7.4M23.4 11.2C24 9.8 24.2 8.6 24 7.4" stroke-width="1.3"/>
</g>
<g fill="${INK}"><circle cx="20" cy="6.4" r="1.6"/><circle cx="16" cy="7" r="1.05"/><circle cx="24" cy="7" r="1.05"/></g>
<g clip-path="url(#mc)" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 34.4C8 32 12.4 36.4 20 34.2C27.6 32 32 36.4 38 34.2" stroke="${INK}" stroke-width=".45"/>
  <path d="M19.3 22.2C18.6 26.6 13.6 27 9.6 28.6C6 30 3.4 32.4 1.6 35.6M20.7 22.2C21.4 26.6 26.4 27 30.4 28.6C34 30 36.6 32.4 38.4 35.6M20 22.6C20.2 27.2 19.4 31 20 39" stroke="${INK}" stroke-width=".9"/>
  <path d="M9.6 28.6C7.6 26.4 5 25.4 1.4 25.2M30.4 28.6C32.4 26.4 35 25.4 38.6 25.2M14 27.4C13.6 30.4 14.6 33.6 13.4 38.6M26 27.4C26.4 30.4 25.4 33.6 26.6 38.6" stroke="${INK}" stroke-width=".5"/>
  <path d="M1 21.4C8 18 12 24.4 20 21.4C28 18.4 32 24.8 39 21.4" stroke="${CIN}" stroke-width="1.2"/>
</g>`;

// fine engraved hatching for the right-hand roundel
const hatch = Array.from({ length: 70 }, (_, i) => `<path d="M${-40 + i * 8} 0 l-60 640" />`).join("");

function card(lang) {
  const zh = lang === "zh";
  const serif = "Noto Serif TC";
  const WL = 356; // waterline y through 兼容並續
  const big = `<text x="72" y="392" font-family="${serif}" font-weight="600" font-size="128" letter-spacing="10">兼容並續</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <clipPath id="mc"><circle cx="20" cy="20" r="18.5"/></clipPath>
    <clipPath id="above"><rect x="0" y="0" width="1200" height="${WL}"/></clipPath>
    <clipPath id="below"><rect x="0" y="${WL}" width="1200" height="400"/></clipPath>
    <clipPath id="round"><circle cx="1000" cy="300" r="150"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="18" y="18" width="1164" height="594" fill="none" stroke="${INK}" stroke-width="2"/>
  <rect x="28" y="28" width="1144" height="574" fill="none" stroke="${INK}" stroke-width=".7"/>

  <text x="72" y="96" font-family="Consolas, monospace" font-size="22" letter-spacing="5" fill="${CIN}">NTU × NYCU × SOS</text>
  <text x="72" y="176" font-family="Georgia, serif" font-style="italic" font-size="84" fill="${INK}">Ecotone</text>
  <text x="74" y="212" font-family="Consolas, monospace" font-size="17" letter-spacing="2" fill="${SEPIA}">/ˈɛkəˌtoʊn/ n. ${zh ? "生態交會帶" : "the edge where two ecosystems meet"}</text>

  <g clip-path="url(#above)" fill="${INK}">${big}</g>
  <g clip-path="url(#below)" fill="${CYAN}" transform="translate(3 4) skewX(-3)">${big}</g>
  <path d="M40 ${WL}H700" stroke="${CIN}" stroke-width="1.6" stroke-dasharray="9 6"/>

  <text x="72" y="466" font-family="${zh ? serif : "Georgia, serif"}" font-size="${zh ? 36 : 34}" letter-spacing="${zh ? 8 : 1}" fill="${INK}">${zh ? "跨領域永續論壇" : "Interdisciplinary Sustainability Forum"}</text>
  <text x="72" y="508" font-family="${zh ? serif : "Georgia, serif"}" ${zh ? "" : 'font-style="italic"'} font-size="25" fill="${SEPIA}">${zh ? "在學科的交界處，讓永續長出新的物種。" : "Where disciplines meet, sustainability grows new species."}</text>

  <path d="M72 546H1128" stroke="${RULE}" stroke-width="1"/>
  <text x="72" y="578" font-family="${zh ? serif : "Georgia, serif"}" font-size="21" fill="${INK}">${zh ? "國立臺灣大學 × 國立陽明交通大學 × SOS Foundation" : "National Taiwan University × NYCU × SOS Foundation"}</text>
  <text x="1128" y="578" text-anchor="end" font-family="Consolas, monospace" font-size="18" letter-spacing="2" fill="${CIN}">ECO-001</text>

  <circle cx="1000" cy="300" r="150" fill="#FAF6EC"/>
  <g clip-path="url(#round)" stroke="${INK}" stroke-width=".5" opacity=".18">${hatch}</g>
  <circle cx="1000" cy="300" r="150" fill="none" stroke="${INK}" stroke-width="1.4"/>
  <circle cx="1000" cy="300" r="160" fill="none" stroke="${INK}" stroke-width=".6"/>
  <g transform="translate(880 180) scale(6)">${mark}</g>
</svg>`;
}

{
  for (const [lang, out] of [["zh", "public/og/ecotone-zh.png"], ["en", "public/og/ecotone-en.png"]]) {
    await sharp(Buffer.from(card(lang)), { density: 96 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(out);
    console.log("wrote", out);
  }
}
