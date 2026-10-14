import HomePage, { homeMetadata } from "@/components/pages/HomePage";

export const metadata = homeMetadata("zh");

export default function Home() {
  return <HomePage lang="zh" />;
}
