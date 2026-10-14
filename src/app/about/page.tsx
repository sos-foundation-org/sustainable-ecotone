import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import OrgLink from "@/components/OrgLink";
import Logo from "@/components/Logo";
import { CO_ORGANIZERS, ORGS } from "@/content/site";

export const metadata: Metadata = {
  title: "關於我們",
  description: "Ecotone 兼容並續由國立臺灣大學、國立陽明交通大學與 SOS Foundation 三方共同發起 — 為什麼是這三方，以及我們想做什麼。",
};

const ROLES: Record<string, { role: string; detail: string }> = {
  ntu: { role: "學術深度", detail: "從氣候變遷到生態學，帶來扎實的科學研究與跨院系的學術網絡。" },
  nycu: { role: "醫療與科技", detail: "把醫學、生命科學與科技工程帶進永續對話 — 那些最少被討論、卻影響巨大的場域。" },
  sos: { role: "跨界行動", detail: "以藝術、自然數位化與開放知識基礎建設串起學術與公眾，負責讓對話走出校園、持續發生。" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About · 關於我們"
        title={
          <>
            兩所大學、一個基金會，
            <br />
            一個<em>長期</em>的約定。
          </>
        }
        lead={
          <>
            Ecotone 兼容並續是一個由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起的跨領域永續論壇。我們想做的不是一場漂亮的活動，而是一個可以一直長下去的{" "}
            <span className="en">platform</span>。
          </>
        }
      />

      {/* STORY */}
      <section className="section">
        <div className="container split">
          <div className="reveal">
            <div className="eyebrow">Why We Started</div>
            <h2 className="h-section">
              永續的問題，
              <br />
              從來不只屬於一個學科。
            </h2>
          </div>
          <div className="reveal">
            <div className="accent-bar" />
            <p className="lead">
              氣候變遷是科學問題，也是語言問題；城市綠化是設計問題，也是生態問題；醫療院所的碳排，是管理問題，也是倫理問題。但大學的結構，往往讓這些人一輩子不會坐在同一張桌子前。
            </p>
            <p className="muted">
              Ecotone 就是那張桌子。兩所大學提供學術的深度與廣度，SOS Foundation 提供跨界與行動的能量 —
              我們一起定期邀請來自不同學科、甚至同時擁有多重身份的講者，讓永續的討論真正 <span className="en">cross-pollinate</span>。
            </p>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section section--paper2">
        <div className="container">
          <div className="reveal" style={{ marginBottom: "2.4rem" }}>
            <div className="eyebrow">Three Partners, Three Roles</div>
            <h2 className="h-section">三方合作，各自帶來什麼</h2>
          </div>
          <div className="partners reveal" style={{ background: "var(--c-surface)" }}>
            {CO_ORGANIZERS.map(({ key }) => {
              const o = ORGS[key];
              const r = ROLES[key];
              return (
                <OrgLink key={key} org={key} className="partner">
                  <div className="partner-logo">{o.logo && <Logo src={o.logo} alt={`${o.name} logo`} />}</div>
                  <div className="partner-name">{o.name}</div>
                  <div className="partner-en">{o.nameEn}</div>
                  <p>
                    <strong style={{ color: "var(--c-ink)" }}>{r.role}</strong> — {r.detail}
                  </p>
                  <span className="ext">{o.url ? "Visit website ↗" : "網址待補"}</span>
                </OrgLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="section section--dark">
        <div className="container">
          <div className="reveal">
            <div className="eyebrow">How We Work</div>
            <h2 className="h-section">我們的原則</h2>
          </div>
          <div className="grid grid-3" style={{ marginTop: "2.4rem" }}>
            <div className="pillar reveal">
              <div className="num">01</div>
              <h3>刻意混搭</h3>
              <span className="en">Mix on purpose</span>
              <p className="muted">每一場的講者組合，至少橫跨三個以上的學科領域。</p>
            </div>
            <div className="pillar reveal">
              <div className="num">02</div>
              <h3>對話優先</h3>
              <span className="en">Dialogue over monologue</span>
              <p className="muted">演講只是開場。真正的內容，發生在講者彼此回應的時候。</p>
            </div>
            <div className="pillar reveal">
              <div className="num">03</div>
              <h3>開放累積</h3>
              <span className="en">Open &amp; cumulative</span>
              <p className="muted">每場的內容與 Secret Slides 都會整理公開，成為下一場的起點。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container cta-band">
          <h2>想成為下一場的合作夥伴、講者，或只是想聊聊？</h2>
          <Link className="btn btn--dark" href="/contact">
            與我們聯絡 <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
