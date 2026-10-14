import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Portrait } from "@/components/SpeakerCard";
import OrgLink from "@/components/OrgLink";
import Logo from "@/components/Logo";
import Rich from "@/components/Rich";
import { SPEAKERS } from "@/content/speakers";
import { ORGS } from "@/content/site";

export const metadata: Metadata = {
  title: "講者",
  description: "Cross-Pollination Vol. 01 講者：孫烜駿、詹偉平、顏訥、Yuhan、王鼎涵 — 每個人本身就是一個 ecotone。",
};

const ZH_NUM = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五"];

export default function SpeakersPage() {
  const identityCount = SPEAKERS.reduce((n, s) => n + s.identities.length, 0);

  return (
    <>
      <PageHero
        eyebrow="Speakers · Cross-Pollination Vol. 01"
        title={
          <>
            {ZH_NUM[SPEAKERS.length] ?? SPEAKERS.length} 位講者，
            <br />
            <em>{ZH_NUM[identityCount] ?? identityCount} 種</em>身份。
          </>
        }
        lead={
          <>
            我們刻意邀請「一個人就是一個 <span className="en">ecotone</span>」的講者 —
            他們同時在實驗室、診間、文學系、設計事務所與基金會之間來回。多重身份不是履歷上的裝飾，而是他們看見連結的方式。
          </>
        }
      >
        <nav className="speaker-jump" aria-label="講者快速導覽">
          {SPEAKERS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.name}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="section" style={{ paddingTop: "clamp(24px,4vw,48px)" }}>
        <div className="container">
          {SPEAKERS.map((s) => (
            <article className="profile" id={s.id} key={s.id}>
              <div>
                <Portrait s={s} className="portrait reveal" />
              </div>
              <div className="reveal">
                <div className="eyebrow">{s.eyebrow}</div>
                <h2>{s.name}</h2>
                <div className="en-name">{s.nameEn}</div>
                {s.orgs.length > 0 && (
                  <div className="affils">
                    {s.orgs.map((k) => (
                      <OrgLink key={k} org={k} className="affil">
                        {ORGS[k].logo && <Logo src={ORGS[k].logo} />}
                        {ORGS[k].name}
                      </OrgLink>
                    ))}
                  </div>
                )}
                <div className="identity-stack">
                  {s.identities.map((id, i) => (
                    <div className="identity" key={id.title}>
                      <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <strong>{id.title}</strong>
                        <span>{id.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Rich as="p" className="muted" html={s.bio} />
                <div className="talk-box">
                  <div className="label">Talk</div>
                  <p>{s.talk ?? "講題確認中"}</p>
                </div>
                {s.draftNote && (
                  <p className="draft-note" style={{ marginTop: "1.4rem" }}>
                    ＊{s.draftNote}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section--tight section--dark">
        <div className="container cta-band">
          <h2>
            每一位講者，各自藏著一張 <span className="en">Secret Slide</span>。
          </h2>
          <Link className="btn btn--gold" href="/events/cross-pollination-2026#secret-slide">
            什麼是 Secret Slide？ <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
