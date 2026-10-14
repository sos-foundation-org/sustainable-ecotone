import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RegisterButton from "@/components/RegisterButton";
import { SITE } from "@/content/site";
import { upcomingEvents } from "@/content/events";

export const metadata: Metadata = {
  title: "報名 / 聯絡",
  description: "報名 Ecotone 兼容並續跨領域永續論壇，或與我們聯絡合作、講者推薦與媒體事宜。",
};

const FAQ = [
  { q: "活動需要付費嗎？", a: "收費方式將與報名表單一併公布。" },
  { q: "不是相關科系的人也可以參加嗎？", a: "當然。Ecotone 本來就是為「隔壁系」設計的 — 歡迎任何對永續有好奇心的人。" },
  { q: "會有線上直播或錄影嗎？", a: "目前以實體為主。部分內容（包含 Secret Slides）會在活動後整理公開。" },
  { q: "可以推薦下一場的講者嗎？", a: "非常歡迎。請來信告訴我們講者是誰、以及他/她的哪些身份最有意思。" },
];

export default function ContactPage() {
  const next = upcomingEvents()[0];
  return (
    <>
      <PageHero
        eyebrow="Register & Contact · 報名 / 聯絡"
        title={
          <>
            來交界處，
            <br />
            <em>一起授粉</em>。
          </>
        }
        lead="報名活動、推薦講者、洽談合作，或只是想打個招呼 — 都從這裡開始。"
      />

      <section className="section">
        <div className="container grid grid-2">
          <div className="contact-card reveal" id="register" style={{ scrollMarginTop: "100px" }}>
            <div className="eyebrow">Register</div>
            <h3>活動報名</h3>
            {next ? (
              <>
                <p className="muted">
                  {next.title}（Vol. {String(next.vol).padStart(2, "0")}）· {next.dateLabel}
                </p>
                <p className="muted">
                  {SITE.registrationUrl ? "點擊下方按鈕前往報名表單。" : "報名表單即將開放，確切日期與地點公布後會同步更新。"}
                </p>
                <div style={{ marginTop: "1.4rem" }}>
                  <RegisterButton />
                </div>
              </>
            ) : (
              <p className="muted">目前沒有開放報名的活動，敬請期待下一場。</p>
            )}
          </div>

          <div className="contact-card reveal">
            <div className="eyebrow">Contact</div>
            <h3>聯絡我們</h3>
            <p className="muted">合作提案、講者推薦、媒體採訪，請來信。</p>
            <ul className="contact-list">
              <li>
                <span>Email</span>
                <span>{SITE.contactEmail ? <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> : "待公布"}</span>
              </li>
              <li>
                <span>Organizers</span>
                <span>NTU × NYCU × SOS Foundation</span>
              </li>
              {SITE.instagram && (
                <li>
                  <span>Instagram</span>
                  <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
                    {SITE.instagram.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--paper2">
        <div className="container split">
          <div className="reveal">
            <div className="eyebrow">FAQ</div>
            <h2 className="h-section">常見問題</h2>
          </div>
          <div className="faq reveal">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
