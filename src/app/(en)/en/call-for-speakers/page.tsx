import CallPage, { callMetadata } from "@/components/pages/CallPage";

export const metadata = callMetadata("en");

export default function CallForSpeakers() {
  return <CallPage lang="en" />;
}
