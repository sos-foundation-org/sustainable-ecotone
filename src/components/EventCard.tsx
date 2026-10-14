import Link from "next/link";
import type { ForumEvent } from "@/content/events";
import Rich from "./Rich";

export default function EventCard({ e }: { e: ForumEvent }) {
  return (
    <Link className="event-card reveal" href={`/events/${e.slug}`}>
      <div className="event-date">
        {e.dateShort}
        <small>{e.dateNote}</small>
      </div>
      <div>
        <span className={`tag ${e.status === "past" ? "tag--soon" : "tag--live"}`}>{e.statusLabel}</span>
        <h3>
          <span className="en">{e.title}</span> {e.kind}
        </h3>
        <Rich as="p" html={e.summary} />
      </div>
      <span className="go" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
