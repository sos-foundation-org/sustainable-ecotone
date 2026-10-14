import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import EventCard from "@/components/EventCard";
import SectionHead from "@/components/SectionHead";
import { EVENTS } from "@/content/events";

export const metadata: Metadata = {
  title: "活動",
  description: "ECOTONE 跨領域永續論壇的所有活動 — 定期舉辦，逐場累積。",
};

export default function EventsPage() {
  const upcoming = EVENTS.filter((e) => e.status !== "past");
  const past = EVENTS.filter((e) => e.status === "past");
  const nextVol = Math.max(...EVENTS.map((e) => e.vol)) + 1;

  return (
    <>
      <PageHero
        eyebrow="Events · 活動"
        title={
          <>
            一場一場，
            <br />
            讓交界處<em>長出新東西</em>。
          </>
        }
        lead={
          <>
            ECOTONE 會定期舉辦系列演講、工作坊與跨域對談。每一場都有不同的主題與組合，但同一個 <span className="en">mindset</span>：把不同學科放在一起，看會發生什麼。
          </>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Upcoming" title="即將舉辦" />
          <div className="grid">
            {upcoming.map((e) => (
              <EventCard key={e.slug} e={e} />
            ))}
            <div className="event-card event-card--placeholder reveal" aria-hidden="true">
              <div className="event-date">
                Vol. {String(nextVol).padStart(2, "0")}
                <small>2027 · TBA</small>
              </div>
              <div>
                <span className="tag tag--soon">Coming next</span>
                <h3>下一場，籌備中</h3>
                <p>有想聽的主題、想推薦的講者？歡迎來信告訴我們。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {past.length > 0 && (
        <section className="section section--paper2">
          <div className="container">
            <SectionHead eyebrow="Archive" title="過去活動" />
            <div className="grid">
              {past.map((e) => (
                <EventCard key={e.slug} e={e} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
