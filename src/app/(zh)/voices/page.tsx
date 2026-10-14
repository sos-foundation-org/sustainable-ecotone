import VoicesPage, { voicesMetadata } from "@/components/pages/VoicesPage";

export const metadata = voicesMetadata("zh");

export default function Voices() {
  return <VoicesPage lang="zh" />;
}
