import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NEXT_DIST_DIR lets a check build run beside a live `next start` without overwriting its .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    // 「報名 / 聯絡」已改為講者招募頁（含一般聯絡）
    return [{ source: "/contact", destination: "/call-for-speakers", permanent: false }];
  },
};

export default nextConfig;
