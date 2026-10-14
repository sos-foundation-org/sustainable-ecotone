import Link from "next/link";
import PageHero from "@/components/PageHero";
import EventCard from "@/components/EventCard";
import SpeakerCard from "@/components/SpeakerCard";
import SectionHead from "@/components/SectionHead";
import OrgLink from "@/components/OrgLink";
import Logo from "@/components/Logo";
import { EVENTS, upcomingEvents } from "@/content/events";
import { speakerById } from "@/content/speakers";
import { CO_ORGANIZERS, ORGS, type OrgKey } from "@/content/site";

const NETWORK: OrgKey[] = ["ntu", "nycu", "ndhu", "sos", "salad"];

export default function Home() {
  const featured = upcomingEvents()[0] ?? EVENTS[0];
  const lineup = featured.speakers.map(speakerById).filter((s) => s !== undefined);
  const identityCount = lineup.reduce((n, s) => n + s.identities.length, 0);

  return (
    <>
      <PageHero
        full
        eyebrow="NTU × NYCU × SOS Foundation"
        title={
          <>
            在學科的交界處，
            <br />
            永續才真正開始 <em className="en">cross-pollinate</em>。
          </>
        }
        lead={
          <>
            Ecotone 兼容並續是一個長期經營的跨領域永續論壇。我們把氣候科學家、文學研究者、地景建築師、牙醫、生物學家放進同一個房間 —
            不是為了達成共識，而是為了看見彼此學科裡那些 <span className="en">unexpected connections</span>。
          </>
        }
      >
        <div className="hero-actions">
          <Link className="btn btn--gold" href={`/events/${featured.slug}`}>
            {featured.dateShort} {featured.title} <span className="arrow">→</span>
          </Link>
          <Link className="btn btn--ghost" href="/about">
            關於論壇
          </Link>
        </div>
        <div className="hero-meta">
          <div>
            <strong>
              Vol. {String(featured.vol).padStart(2, "0")} — {featured.title}
            </strong>
            {featured.dateLabel}
          </div>
          <div>
            <strong>{lineup.length} 位講者</strong>
            {identityCount} 種身份
          </div>
          <div>
            <strong>{lineup.length} 張 Secret Slide</strong>
            每位講者都藏了一張
          </div>
        </div>
      </PageHero>

      {/* WHY ECOTONE */}
      <section className="section">
        <div className="container split">
          <div className="reveal">
            <div className="eyebrow">Why &ldquo;Ecotone&rdquo;</div>
            <h2 className="h-section">
              生態交會帶：
              <br />
              兩個生態系相遇的地方。
            </h2>
          </div>
          <div className="reveal">
            <div className="accent-bar" />
            <p className="lead">
              在生態學裡，<span className="en">ecotone</span> 是森林與草原、淡水與海水交界的過渡帶。這裡的環境條件最不穩定，卻往往也是物種最豐富、最有生命力的地方 —
              所謂的 <span className="en">edge effect</span>。
            </p>
            <p className="muted">
              知識也是這樣。最有意思的想法很少誕生在學科的正中央，而是在邊界：當氣候模型遇上詩、當牙科診間遇上碳足跡、當昆蟲翅膀的結構色遇上建築立面。Ecotone
              想做的，就是刻意製造這種邊界，然後定期、長期地讓它發生。
            </p>
            <p className="muted">
              中文名「兼容並續」改自「兼容並蓄」— <strong>兼容</strong>不同的學科與身份，<strong>並續</strong>，讓永續真的能延續下去。
            </p>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="section section--dark">
        <div className="container">
          <div className="reveal">
            <div className="eyebrow">Vision</div>
            <h2 className="h-section" style={{ maxWidth: "18em" }}>
              永續不是一個學科，
              <br />
              而是一種跨越的 <span className="en">mindset</span>。
            </h2>
          </div>
          <div className="grid grid-3" style={{ marginTop: "3.2rem" }}>
            <div className="pillar reveal">
              <div className="num">01</div>
              <h3>跨域對話</h3>
              <span className="en">Dialogue across disciplines</span>
              <p className="muted">每一場都刻意混搭 — 自然科學、人文、設計、醫學、產業。不講給同溫層聽，講給「隔壁系」聽。</p>
            </div>
            <div className="pillar reveal">
              <div className="num">02</div>
              <h3>多重身份</h3>
              <span className="en">People with plural identities</span>
              <p className="muted">
                我們邀請的講者大多同時活在好幾個世界裡。他們本身就是 <span className="en">ecotone</span>，是最好的翻譯者。
              </p>
            </div>
            <div className="pillar reveal">
              <div className="num">03</div>
              <h3>長期累積</h3>
              <span className="en">A forum that compounds</span>
              <p className="muted">不是一次性的活動，而是一個定期舉辦、逐場累積的平台 — 講者、聽眾與想法，都會在下一場再次相遇。</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENT */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Upcoming" title="近期活動" href="/events" linkLabel="所有活動" />
          <EventCard e={featured} />
        </div>
      </section>

      {/* SPEAKERS */}
      <section className="section section--paper2">
        <div className="container">
          <SectionHead eyebrow={`Speakers · Vol. ${String(featured.vol).padStart(2, "0")}`} title="講者陣容" href="/speakers" linkLabel="認識講者" />
          <div className="speaker-grid">
            {lineup.map((s) => (
              <SpeakerCard key={s.id} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* CO-ORGANIZERS */}
      <section className="section">
        <div className="container">
          <div className="reveal" style={{ marginBottom: "2.4rem" }}>
            <div className="eyebrow">Co-organized by</div>
            <h2 className="h-section">三方共同發起</h2>
            <p className="lead">兩所大學、一個基金會。學術的深度，加上把知識帶出校園的行動力。</p>
          </div>
          <div className="partners reveal">
            {CO_ORGANIZERS.map(({ key, blurb }) => {
              const o = ORGS[key];
              return (
                <OrgLink key={key} org={key} className="partner">
                  <div className="partner-logo">{o.logo && <Logo src={o.logo} alt={`${o.name} logo`} />}</div>
                  <div className="partner-name">{o.name}</div>
                  <div className="partner-en">{o.nameEn}</div>
                  <p>{blurb}</p>
                  <span className="ext">{o.url ? new URL(o.url).hostname.replace(/^www\./, "") + " ↗" : "網址待補"}</span>
                </OrgLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* NETWORK */}
      <section className="section--tight" style={{ borderTop: "1px solid var(--c-line)" }}>
        <div className="container">
          <p className="eyebrow" style={{ display: "flex", justifyContent: "center" }}>
            Vol. 01 Network · 講者所屬機構
          </p>
          <div className="logo-row reveal">
            {NETWORK.map((k) => (
              <OrgLink key={k} org={k}>
                {ORGS[k].logo && <Logo src={ORGS[k].logo} />}
                {ORGS[k].name}
                {ORGS[k].placeholder && <span className="placeholder-flag">PLACEHOLDER</span>}
              </OrgLink>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section--tight section--dark">
        <div className="container cta-band">
          <h2>
            想在 11 月的 <span className="en">Cross-Pollination</span> 現場，親眼看見那張 Secret Slide？
          </h2>
          <Link className="btn btn--gold" href="/contact">
            報名 / 聯絡 <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
