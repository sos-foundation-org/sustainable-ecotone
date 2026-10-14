import EventsPage, { eventsMetadata } from "@/components/pages/EventsPage";

export const metadata = eventsMetadata("en");

export default function Events() {
  return <EventsPage lang="en" />;
}
