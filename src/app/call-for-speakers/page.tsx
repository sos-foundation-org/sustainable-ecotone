import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle, PlateHead } from "@/components/Typography";
import { PlateEdge } from "@/components/Dividers";
import { BlankLabel, SpeakerFormButton } from "@/components/SpeakerCall";
import FollowCard from "@/components/Follow";
import { Genet } from "@/components/Fungi";
import NextCrossing from "@/components/NextCrossing";
import { CALL_FIELDS, FAQ, SITE } from "@/content/site";
import { DESIDERATA } from "@/content/crossings";
import { DISCIPLINES } from "@/content/disciplines";
import { EVENTS } from "@/content/events";
import { SPEAKERS } from "@/content/speakers";

export const metadata: Metadata = {
  title: "成為講者",
  description: "Ecotone 兼容並續講者招募：我們在找同時活在好幾個學科、好幾個國家裡，而且工作與永續或自然有實質連結的人。告訴我們你的學科與身份，以及你想帶來的題目。",
};

const WANTED = [
  { t: "好幾張標籤", en: "Plural identities", d: "你同時是研究者與創業者、醫師與行政者、設計師與田野工作者……一個人，好幾種身份。" },
  { t: "與永續或自然相連", en: "Rooted in sustainability or nature", d: "這是必要條件：你的研究、實踐、產品、政策、創作或教學，與永續或自然有實質的關係。" },
  { t: "一道邊界", en: "A border you live on", d: "你的工作本身就在兩個學科之間：你常常需要把一邊的語言，翻譯給另一邊聽。" },
  { t: "一個跨海的視角", en: "Across countries", d: "你在臺灣以外的地方生活或工作過，或正把兩個國家的經驗接在一起。（不是必要條件，但我們很想聽。）" },
];

const STEPS = [
  { t: "填寫表單", d: "大約 5 分鐘、中英雙語：你的學科與身份、所在地、你與永續或自然的連結，以及你想帶來的題目。" },
  { t: "配對交會", d: "我們會依每一冊的主題，把不同學科、不同地方的講者放進同一張圖版。" },
  { t: "主動聯繫", d: "合適的時候，我們會與你聯絡，一起討論講題與形式。" },
];

export default function CallForSpeakersPage() {
  const folio = SPEAKERS.filter((s) => EVENTS.some((e) => e.speakers.includes(s.id)));
  const covered = new Set(folio.flatMap((s) => s.disciplines));
  const desiderata = [...DESIDERATA].sort((x, y) => Number(covered.has(x.a)) + Number(covered.has(x.b)) - (Number(covered.has(y.a)) + Number(covered.has(y.b))));
  const vacant = DISCIPLINES.filter((d) => !covered.has(d.key));

  return (
    <>
      <PageTitle
        catalog={["Call for Speakers · 講者招募", "Desiderata", "ECO-S-??"]}
        title={
          <>
            成為講者：
            <br />
            下一位講者，也許是你。
          </>
        }
        en="We are looking for people who live on more than one edge."
        lead={
          <p>
            Ecotone 兼容並續相信，最有意思的想法長在學科的交界處。所以我們找的講者，往往本身就是一個 <i>ecotone</i>：同時活在好幾個學科、好幾種身份、甚至好幾個國家之間，而且他們的工作都與<b>永續</b>或<b>自然</b>有實質的連結。如果你也是，歡迎告訴我們 — 你帶著哪幾張標籤，以及你想把什麼問題帶到交界處。
          </p>
        }
      />

      <section className="sec sec--tight" aria-labelledby="wanted">
        <div className="wrap call-spread">
          <div className="reveal">
            <h2 id="wanted" className="h-sec">
              我們在找的人 <i>Desiderata</i>
            </h2>
            <ol className="wanted">
              {WANTED.map((w, i) => (
                <li key={w.t}>
                  <span className="num">{["i.", "ii.", "iii.", "iv."][i]}</span>
                  <div>
                    <b>
                      {w.t} <i>{w.en}</i>
                    </b>
                    <p className="muted">{w.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="actions">
              <SpeakerFormButton />
              {!SITE.speakerFormUrl && <span className="muted small">表單開放後，這裡會直接連到申請表（Google Form，另開新視窗）。</span>}
            </div>
          </div>
          <div className="reveal">
            <BlankLabel />
            <div className="you-genet">
              <Genet seed="you-the-next-specimen" count={3} names={["你的第一個身份", "你的第二個身份", "你的第三個身份"]} />
            </div>
          </div>
        </div>
      </section>

      <PlateEdge from="var(--paper)" to="var(--paper-2)" mode="fingers" seed={987} />

      <section className="sec sec--folio" aria-labelledby="expect">
        <div className="wrap">
          <PlateHead no="§" label="Procedure" id="expect" title="表單會問什麼、接下來會發生什麼" en="What to expect" />
          <div className="spread">
            <div className="reveal">
              <h3 className="toc-head">
                表單欄位 <i>The form asks</i>
              </h3>
              <ul className="ask">
                {CALL_FIELDS.map((f) => (
                  <li key={f.abbr + f.zh}>
                    <span className="mono cin">{f.abbr}</span>
                    <span>
                      {f.zh} <i>{f.en}</i>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gutter" aria-hidden="true" />
            <div className="reveal">
              <h3 className="toc-head">
                流程 <i>Procedure</i>
              </h3>
              <ol className="steps">
                {STEPS.map((s, i) => (
                  <li key={s.t}>
                    <span className="num">{i + 1}</span>
                    <div>
                      <b>{s.t}</b>
                      <p className="muted">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <PlateEdge from="var(--paper-2)" to="var(--cyan)" mode="lace" seed={1597} />

      <section className="sec sec--cyan" aria-labelledby="vacant">
        <div className="wrap atlas-grid">
          <div className="reveal">
            <PlateHead no="§" label="Vacant" id="vacant" title="還空著的學科" en="Fields still waiting" />
            <p className="lead">圖譜裡還有 {vacant.length} 個學科，沒有任何一位講者觸及。如果你來自這些領域，我們特別想認識你。</p>
            <ul className="vacant-list">
              {vacant.map((d) => (
                <li key={d.key}>
                  <svg viewBox="0 0 56 20" aria-hidden="true">
                    <rect width="56" height="20" fill="#FAF6EC" />
                    <rect width="56" height="20" fill={`url(#lt-${d.key})`} />
                  </svg>
                  <span className="mono">{d.code}</span> {d.zh} <i>{d.en}</i>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <NextCrossing items={desiderata} disciplines={DISCIPLINES} />
          </div>
        </div>
      </section>

      <PlateEdge from="var(--cyan)" to="var(--paper-2)" mode="lace" seed={2584} />

      <section className="sec sec--folio" aria-labelledby="faq">
        <div className="wrap spread">
          <div className="reveal">
            <p className="catno mono">
              <span>Marginalia · FAQ</span>
            </p>
            <h2 id="faq" className="h-sec">
              常見問題
            </h2>
          </div>
          <div className="gutter" aria-hidden="true" />
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

      <section className="sec sec--tight" aria-labelledby="two-ways">
        <div className="wrap">
          <h2 id="two-ways" className="h-sec reveal">
            兩種參與方式 <i>Two ways in</i>
          </h2>
          <div className="two-ways">
            <article className="way reveal" aria-labelledby="way-speak">
              <p className="mono cin">I · 想上台</p>
              <h3 id="way-speak">成為講者 <i>Call for Speakers</i></h3>
              <p className="muted">你想站上講台，把你的學科與身份帶到交界處。表單會問你的學科、身份、所在地、你與永續或自然的連結，以及想帶來的題目。</p>
              <BlankLabel compact />
              <SpeakerFormButton />
            </article>
            <div className="way reveal">
              <p className="mono cin">II · 想來聽</p>
              <FollowCard headingId="way-follow" note="你想知道下一冊什麼時候、在哪裡舉行。只要留下 e-mail，新的一冊公布時我們會通知你。" />
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec--tight" id="contact" aria-labelledby="contact-h">
        <div className="wrap">
          <article className="accession reveal">
            <header className="accession-head mono">
              <span>Correspondence · 一般聯絡</span>
            </header>
            <h2 id="contact-h">其他事情，也歡迎來信</h2>
            <p className="muted">合作提案、海外聲音、媒體採訪，或只是想打個招呼。</p>
            <dl className="fields">
              <div>
                <dt>Email</dt>
                <dd>{SITE.contactEmail ? <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> : "待公布"}</dd>
              </div>
              <div>
                <dt>Organizers</dt>
                <dd>NTU × NYCU × SOS Foundation</dd>
              </div>
              {SITE.instagram && (
                <div>
                  <dt>Instagram</dt>
                  <dd>
                    <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
                      {SITE.instagram.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt>Voices</dt>
                <dd>
                  <Link href="/voices">海外聲音 · 錄一段短片給臺灣的聽眾</Link>
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
    </>
  );
}
