import type { Metadata, Viewport } from "next";
import SiteShell from "@/components/SiteShell";
import { rootMetadata } from "@/lib/meta";

// Root layout for the English site (/en, /en/events …): <html lang="en">.
export const metadata: Metadata = rootMetadata("en");

export const viewport: Viewport = {
  themeColor: "#F2ECDF",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
