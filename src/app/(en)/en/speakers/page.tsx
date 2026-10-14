import SpeakersPage, { speakersMetadata } from "@/components/pages/SpeakersPage";

export const metadata = speakersMetadata("en");

export default function PastSpeakers() {
  return <SpeakersPage lang="en" />;
}
