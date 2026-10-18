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
import { localePath, type L10n, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import JsonLd from "@/components/JsonLd";
import { faqGraph } from "@/lib/jsonld";

export function callMetadata(lang: Lang) {
  return pageMetadata({
    lang,
    path: "/call-for-speakers",
    ...(lang === "zh"
      ? {
          title: "成為講者",
          description: "Ecotone 兼容並續講者招募：我們在找同時活在好幾個學科、好幾個國家裡，而且工作與永續或自然有實質連結的人。告訴我們你的學科與身份，以及你想帶來的題目。",
        }
      : {
          title: "Call for Speakers",
          description:
            "Become a speaker at Ecotone. We are looking for people who live across several disciplines and countries, and whose work has a real connection to sustainability or nature. Tell us your fields and identities, and the topic you would bring.",
        }),
  });
}

/** What we look for. The criteria: interdisciplinary AND connected to sustainability OR nature. */
const WANTED: { t: L10n; d: L10n }[] = [
  {
    t: { zh: "好幾張標籤", en: "Plural identities" },
    d: {
      zh: "你同時是研究者與創業者、醫師與行政者、設計師與田野工作者……一個人，好幾種身份。",
      en: "You are a researcher and a founder, a physician and an administrator, a designer and a fieldworker: one person, several identities.",
    },
  },
  {
    t: { zh: "與永續或自然相連", en: "Rooted in sustainability or nature" },
    d: {
      zh: "這是必要條件：你的研究、實踐、產品、政策、創作或教學，與永續或自然有實質的關係。",
      en: "This one is essential: your research, practice, product, policy, creative work or teaching has a real connection to sustainability or nature.",
    },
  },
  {
    t: { zh: "一道邊界", en: "A border you live on" },
    d: {
      zh: "你的工作本身就在兩個學科之間：你常常需要把一邊的語言，翻譯給另一邊聽。",
      en: "Your work sits between two disciplines, and you often find yourself translating one side’s language for the other.",
    },
  },
  {
    t: { zh: "一段不一樣的人生", en: "A different life experience" },
    d: {
      zh: "你帶著不同的國家、世代、族群、職業或成長背景而來，看見的永續也因此不一樣。（不是必要條件，但我們很想聽。）",
      en: "You bring a different country, generation, ethnicity, occupation or upbringing, and so you see sustainability differently. (Not required, but we would love to hear from you.)",
    },
  },
];

const STEPS: { t: L10n; d: L10n }[] = [
  {
    t: { zh: "填寫表單", en: "Fill in the form" },
    d: {
      zh: "大約 5 分鐘、中英雙語：你的學科與身份、所在地、你與永續或自然的連結，以及你想帶來的題目。",
      en: "About five minutes, in Chinese or English: your fields and identities, where you are based, your connection to sustainability or nature, and the topic you would bring.",
    },
  },
  {
    t: { zh: "配對交會", en: "We find the crossings" },
    d: {
      zh: "我們會依每一冊的主題，把不同學科、不同地方的講者放進同一張圖版。",
      en: "Around each volume’s theme, we bring speakers from different disciplines and places onto the same plate.",
    },
  },
  {
    t: { zh: "主動聯繫", en: "We get in touch" },
    d: {
      zh: "合適的時候，我們會與你聯絡，一起討論講題與形式。",
      en: "When there is a good fit, we will contact you to shape the topic and format together.",
    },
  },
];

export default function CallPage({ lang }: { lang: Lang }) {
  const zh = lang === "zh";
  const folio = SPEAKERS.filter((s) => EVENTS.some((e) => e.speakers.includes(s.id)));
  const covered = new Set(folio.flatMap((s) => s.disciplines));
  const desiderata = [...DESIDERATA].sort((x, y) => Number(covered.has(x.a)) + Number(covered.has(x.b)) - (Number(covered.has(y.a)) + Number(covered.has(y.b))));
  const vacant = DISCIPLINES.filter((d) => !covered.has(d.key));

  return (
    <>
      <JsonLd data={faqGraph(lang)} />
      <PageTitle
        catalog={[zh ? "Call for Speakers · 講者招募" : "Call for Speakers", "Desiderata", "ECO-S-??"]}
        title={
          zh ? (
            <>
              成為講者：
              <br />
              下一位講者，也許是你。
            </>
          ) : (
            <>
              Become a speaker.
              <br />
              The next one could be you.
            </>
          )
        }
        en="We are looking for people who live on more than one edge."
        lead={
          zh ? (
            <p>
              Ecotone 兼容並續相信，最有意思的想法長在學科的交界處。所以我們找的講者，往往本身就是一個 <i>ecotone</i>：同時活在好幾個學科、好幾種身份、甚至好幾個國家之間，而且他們的工作都與<b>永續</b>或<b>自然</b>有實質的連結。如果你也是，歡迎告訴我們：你帶著哪幾張標籤，以及你想把什麼問題帶到交界處。
            </p>
          ) : (
            <p>
              Ecotone believes the most interesting ideas grow where disciplines meet. So the speakers we look for are often ecotones themselves: living between several disciplines, several identities, sometimes several countries, and doing work with a real connection to <b>sustainability</b> or <b>nature</b>. If that sounds like you, tell us which labels you carry, and what question you would bring to the edge.
            </p>
          )
        }
      />

      <section className="sec sec--tight" aria-labelledby="wanted">
        <div className="wrap call-spread">
          <div className="reveal">
            <h2 id="wanted" className="h-sec">
              {zh ? "我們在找的人" : "Who we are looking for"} <i>Desiderata</i>
            </h2>
            <ol className="wanted">
              {WANTED.map((w, i) => (
                <li key={w.t.zh}>
                  <span className="num">{["i.", "ii.", "iii.", "iv."][i]}</span>
                  <div>
                    <b>
                      {zh ? (
                        <>
                          {w.t.zh} <i>{w.t.en}</i>
                        </>
                      ) : (
                        w.t.en
                      )}
                    </b>
                    <p className="muted">{w.d[lang]}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="actions">
              <SpeakerFormButton lang={lang} />
              {!SITE.speakerFormUrl && (
                <span className="muted small">
                  {zh ? "表單開放後，這裡會直接連到申請表（Google Form，另開新視窗）。" : "Once the form opens, this button will link straight to it (a Google Form, in a new tab)."}
                </span>
              )}
            </div>
          </div>
          <div className="reveal">
            <BlankLabel lang={lang} />
            <div className="you-genet">
              <Genet
                seed="you-the-next-specimen"
                count={3}
                lang={lang}
                names={zh ? ["你的第一個身份", "你的第二個身份", "你的第三個身份"] : ["your first identity", "your second identity", "your third identity"]}
              />
            </div>
          </div>
        </div>
      </section>

      <PlateEdge from="var(--paper)" to="var(--paper-2)" mode="fingers" seed={987} />

      <section className="sec sec--folio" aria-labelledby="expect">
        <div className="wrap">
          <PlateHead
            lang={lang}
            no="§"
            label="Procedure"
            id="expect"
            title={zh ? "表單會問什麼、接下來會發生什麼" : "What the form asks, and what happens next"}
            en={zh ? "What to expect" : undefined}
          />
          <div className="spread">
            <div className="reveal">
              <h3 className="toc-head">
                {zh ? (
                  <>
                    表單欄位 <i>The form asks</i>
                  </>
                ) : (
                  "The form asks"
                )}
              </h3>
              <ul className="ask">
                {CALL_FIELDS.map((f) => (
                  <li key={f.abbr}>
                    <span className="mono cin">{f.abbr}</span>
                    <span>
                      {zh ? (
                        <>
                          {f.label.zh} <i>{f.label.en}</i>
                        </>
                      ) : (
                        f.label.en
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gutter" aria-hidden="true" />
            <div className="reveal">
              <h3 className="toc-head">
                {zh ? (
                  <>
                    流程 <i>Procedure</i>
                  </>
                ) : (
                  "What happens next"
                )}
              </h3>
              <ol className="steps">
                {STEPS.map((s, i) => (
                  <li key={s.t.zh}>
                    <span className="num">{i + 1}</span>
                    <div>
                      <b>{s.t[lang]}</b>
                      <p className="muted">{s.d[lang]}</p>
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
            <PlateHead lang={lang} no="§" label="Vacant" id="vacant" title={zh ? "還空著的學科" : "Fields still waiting"} en={zh ? "Fields still waiting" : undefined} />
            <p className="lead">
              {zh
                ? `圖譜裡還有 ${vacant.length} 個學科，沒有任何一位講者觸及。如果你來自這些領域，我們特別想認識你。`
                : `${vacant.length} fields in the atlas have not yet been touched by a single speaker. If you come from one of them, we would especially like to meet you.`}
            </p>
            <ul className="vacant-list">
              {vacant.map((d) => (
                <li key={d.key}>
                  <svg viewBox="0 0 56 20" aria-hidden="true">
                    <rect width="56" height="20" fill="#FAF6EC" />
                    <rect width="56" height="20" fill={`url(#lt-${d.key})`} />
                  </svg>
                  <span className="mono">{d.code}</span>{" "}
                  {zh ? (
                    <>
                      {d.name.zh} <i>{d.name.en}</i>
                    </>
                  ) : (
                    d.name.en
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <NextCrossing items={desiderata} disciplines={DISCIPLINES} lang={lang} />
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
              {zh ? "常見問題" : "Common questions"}
            </h2>
          </div>
          <div className="gutter" aria-hidden="true" />
          <div className="faq reveal">
            {FAQ.map((f) => (
              <details key={f.q.zh}>
                <summary>{f.q[lang]}</summary>
                <p>{f.a[lang]}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--tight" aria-labelledby="two-ways">
        <div className="wrap">
          <h2 id="two-ways" className="h-sec reveal">
            {zh ? (
              <>
                兩種參與方式 <i>Two ways in</i>
              </>
            ) : (
              "Two ways in"
            )}
          </h2>
          <div className="two-ways">
            <article className="way reveal" aria-labelledby="way-speak">
              <p className="mono cin">{zh ? "I · 想上台" : "I · To speak"}</p>
              <h3 id="way-speak">
                {zh ? (
                  <>
                    成為講者 <i>Call for Speakers</i>
                  </>
                ) : (
                  "Become a speaker"
                )}
              </h3>
              <p className="muted">
                {zh
                  ? "你想站上講台，把你的學科與身份帶到交界處。表單會問你的學科、身份、所在地、你與永續或自然的連結，以及想帶來的題目。"
                  : "You want to take the stage and bring your fields and identities to the edge. The form asks for your discipline, your identities, where you are based, your connection to sustainability or nature, and the topic you would bring."}
              </p>
              <BlankLabel compact lang={lang} />
              <SpeakerFormButton lang={lang} />
            </article>
            <div className="way reveal">
              <p className="mono cin">{zh ? "II · 想來聽" : "II · To listen"}</p>
              <FollowCard
                lang={lang}
                headingId="way-follow"
                note={
                  zh
                    ? "你想知道下一冊什麼時候、在哪裡舉行。只要留下 e-mail，新的一冊公布時我們會通知你。"
                    : "You want to know when and where the next volume will take place. Just leave your email, and we will let you know when it is announced."
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec--tight" id="contact" aria-labelledby="contact-h">
        <div className="wrap">
          <article className="accession reveal">
            <header className="accession-head mono">
              <span>{zh ? "Correspondence · 一般聯絡" : "Correspondence · General enquiries"}</span>
            </header>
            <h2 id="contact-h">{SITE.contactEmail ? (zh ? "其他事情，也歡迎來信" : "For anything else, write to us") : zh ? "其他事情，也歡迎聯絡我們" : "For anything else, get in touch"}</h2>
            <p className="muted">{zh ? "合作提案、為多元聲音錄一段你對跨領域永續的期待、媒體採訪，或只是想打個招呼。" : "Partnership proposals, a film for Diverse Voices about your hopes for interdisciplinary sustainability, press enquiries, or simply to say hello."}</p>
            <dl className="fields">
              {SITE.contactEmail ? (
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
                  </dd>
                </div>
              ) : (
                // no public inbox yet: the two forms above are the way in
                <div>
                  <dt>Forms</dt>
                  <dd>
                    <a href="#two-ways">{zh ? "請透過上方的講者申請或追蹤表單與我們聯繫" : "Reach us through the speaker or follow form above"}</a>
                  </dd>
                </div>
              )}
              <div>
                <dt>Organizers</dt>
                <dd>NTU × NYCU × SOS</dd>
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
                  <Link href={localePath(lang, "/voices")}>{zh ? "多元聲音 · 錄一段短片，說出你對跨領域永續的期待" : "Diverse Voices · record a short film about your hopes for interdisciplinary sustainability"}</Link>
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
    </>
  );
}
