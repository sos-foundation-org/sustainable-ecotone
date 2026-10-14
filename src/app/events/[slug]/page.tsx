import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import SpeakerCard from "@/components/SpeakerCard";
import SectionHead from "@/components/SectionHead";
import SecretSlide from "@/components/SecretSlide";
import RegisterButton from "@/components/RegisterButton";
import Rich from "@/components/Rich";
import { EVENTS, eventBySlug } from "@/content/events";
import { speakerById } from "@/content/speakers";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = eventBySlug((await params).slug);
  if (!e) return {};
  const desc = `ECOTONE Vol. ${String(e.vol).padStart(2, "0")} — ${e.title} ${e.kind}，${e.dateLabel}。`;
  return {
    title: `${e.title} ${e.dateShort}`,
    description: desc,
    openGraph: { title: `${e.title}｜ECOTONE Vol. ${String(e.vol).padStart(2, "0")}`, description: desc },
  };
}

export default async function EventPage({ params }: Props) {
  const e = eventBySlug((await params).slug);
  if (!e) notFound();
  const lineup = e.speakers.map(speakerById).filter((s) => s !== undefined);
  const vol = String(e.vol).padStart(2, "0");

  return (
    <>
      <PageHero
        full
        eyebrow={`ECOTONE Vol. ${vol} · ${e.dateShort}`}
        title={
          <>
            <span className="en">{e.title}</span>
            <br />
            {e.titleZh}。
          </>
        }
        lead={<Rich html={e.intro[0]} />}
      >
        <div className="hero-actions">
          <RegisterButton />
          {e.hasSecretSlide && (
            <a className="btn btn--ghost" href="#secret-slide">
              Secret Slide 是什麼？
            </a>
          )}
        </div>
        <div className="hero-meta">
          <div>
            <strong>{e.dateLabel}</strong>
            {e.dateNote}
          </div>
          <div>
            <strong>{e.venue}</strong>
            {e.venueNote}
          </div>
          <div>
            <strong>
              {lineup.length} Talks{e.hasSecretSlide ? ` + ${lineup.length} Secret Slides` : ""}
            </strong>
            {e.language}，{e.languageNote}
          </div>
        </div>
      </PageHero>

      {/* FACTS */}
      <section className="section--tight">
        <div className="container">
          <div className="facts reveal">
            <div className="fact">
              <div className="label">Date</div>
              <div className="value">{e.dateLabel}</div>
              <div className="note">{e.dateNote}</div>
            </div>
            <div className="fact">
              <div className="label">Venue</div>
              <div className="value">{e.venue}</div>
              <div className="note">{e.venueNote}</div>
            </div>
            <div className="fact">
              <div className="label">Format</div>
              <div className="value">{e.format}</div>
              <div className="note">{e.formatNote}</div>
            </div>
            <div className="fact">
              <div className="label">Language</div>
              <div className="value">{e.language}</div>
              <div className="note">{e.languageNote}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" style={{ paddingTop: "clamp(32px,5vw,64px)" }}>
        <div className="container split">
          <div className="reveal">
            <div className="eyebrow">About the Series</div>
            <h2 className="h-section">
              不是 {lineup.length} 場演講，
              <br />
              是一場授粉實驗。
            </h2>
          </div>
          <div className="reveal">
            <div className="accent-bar" />
            <p className="lead">
              一般的論壇是「輪流發言」：每個人講完自己的，聽眾各取所需。<span className="en">Cross-Pollination</span>{" "}
              想做的不一樣 — 我們要求每位講者，在講自己專業的同時，也要冒一點險，把手伸進別人的領域。
            </p>
            <p className="muted">
              氣候科學家會被文學研究者追問「你怎麼描述一個你看不到的未來？」；景觀建築師會被牙醫問「你的設計怎麼算碳？」。我們相信，真正有意思的永續方案，都長在這些{" "}
              <span className="en">awkward but productive</span> 的對話裡。
            </p>
          </div>
        </div>
      </section>

      {e.hasSecretSlide && <SecretSlide />}

      {/* LINE-UP */}
      <section className="section section--paper2">
        <div className="container">
          <SectionHead eyebrow="Line-up" title="講者陣容" href="/speakers" linkLabel="完整介紹" />
          <div className="speaker-grid">
            {lineup.map((s) => (
              <SpeakerCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="section">
        <div className="container split">
          <div className="reveal">
            <div className="eyebrow">Program (Tentative)</div>
            <h2 className="h-section">活動流程</h2>
            <p className="muted">流程為暫定版本，正式時間將於日期確認後公布。</p>
          </div>
          <ol className="timeline reveal">
            {e.program.map((p) => (
              <li key={p.time + p.title}>
                <span className="t">{p.time}</span>
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* VOICES TEASER */}
      <section className="section section--dark">
        <div className="container split">
          <div className="reveal">
            <div className="eyebrow">Voices from Abroad</div>
            <h2 className="h-section">來自海外的聲音</h2>
          </div>
          <div className="reveal">
            <p className="lead">
              永續從來不是一個國家的事。我們邀請海外的研究者、設計師與實踐者錄製短片，回應這次論壇的主題 — 在現場播放，也會收錄在網站上。
            </p>
            <Link className="btn btn--ghost" href="/voices" style={{ marginTop: "1rem" }}>
              前往海外聲音 <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section--tight">
        <div className="container cta-band">
          <h2>
            名額有限。想親眼看見那 {lineup.length} 張 <span className="en">Secret Slides</span>？
          </h2>
          <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
            <RegisterButton variant="dark" />
            <Link className="btn btn--ghost" href="/contact">
              聯絡我們
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
