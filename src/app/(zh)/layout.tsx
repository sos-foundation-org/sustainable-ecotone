import type { Metadata, Viewport } from "next";
import SiteShell from "@/components/SiteShell";
import { rootMetadata } from "@/lib/meta";

// Root layout for the Chinese site (/, /events …): <html lang="zh-Hant-TW">.
export const metadata: Metadata = rootMetadata("zh");

export const viewport: Viewport = {
  themeColor: "#F2ECDF",
};

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="zh">{children}</SiteShell>;
}
