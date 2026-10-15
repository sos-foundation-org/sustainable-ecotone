import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NEXT_DIST_DIR lets a check build run beside a live `next start` without overwriting its .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    // 「報名 / 聯絡」已改為講者招募頁（含一般聯絡）；英文版同樣轉址
    return [
      { source: "/contact", destination: "/call-for-speakers", permanent: false },
      { source: "/en/contact", destination: "/en/call-for-speakers", permanent: false },
      // Vol. 01 was renamed from "Cross-Pollination"; keep the old links working
      { source: "/events/cross-pollination-2026", destination: "/events/sustainable-urbanization-rewilding-2026", permanent: true },
      { source: "/en/events/cross-pollination-2026", destination: "/en/events/sustainable-urbanization-rewilding-2026", permanent: true },
    ];
  },
};

export default nextConfig;
