import CallPage, { callMetadata } from "@/components/pages/CallPage";

export const metadata = callMetadata("zh");

export default function CallForSpeakers() {
  return <CallPage lang="zh" />;
}
