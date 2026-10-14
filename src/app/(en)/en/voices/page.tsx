import VoicesPage, { voicesMetadata } from "@/components/pages/VoicesPage";

export const metadata = voicesMetadata("en");

export default function Voices() {
  return <VoicesPage lang="en" />;
}
