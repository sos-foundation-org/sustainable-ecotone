import EventsPage, { eventsMetadata } from "@/components/pages/EventsPage";

export const metadata = eventsMetadata("zh");

export default function Events() {
  return <EventsPage lang="zh" />;
}
