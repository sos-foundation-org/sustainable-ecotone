import { notFound } from "next/navigation";
import EventPage, { eventMetadata } from "@/components/pages/EventPage";
import { EVENTS, eventBySlug } from "@/content/events";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const e = eventBySlug((await params).slug);
  return e ? eventMetadata("en", e) : {};
}

export default async function Event({ params }: Props) {
  const e = eventBySlug((await params).slug);
  if (!e) notFound();
  return <EventPage lang="en" e={e} />;
}
