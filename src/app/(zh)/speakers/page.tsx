import SpeakersPage, { speakersMetadata } from "@/components/pages/SpeakersPage";

export const metadata = speakersMetadata("zh");

export default function PastSpeakers() {
  return <SpeakersPage lang="zh" />;
}
