import Link from "next/link";
import { PageTitle, PlateHead } from "@/components/Typography";
import { PlateEdge } from "@/components/Dividers";
import CollectorStamp from "@/components/CollectorStamp";
import { VolumeEmblem } from "@/components/Volume";
import OrgLink from "@/components/OrgLink";
import { SpeakerAffiliations } from "@/components/Partners";
import Swatch from "@/components/Swatch";
import { CO_ORGANIZERS, ORGS, PRINCIPLES } from "@/content/site";
import { EVENTS } from "@/content/events";
import { DISCIPLINES } from "@/content/disciplines";
import { pad2, roman } from "@/lib/engrave";
import { localePath, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";

export function aboutMetadata(lang: Lang) {
  return pageMetadata({
    lang,
    path: "/about",
    ...(lang === "zh"
      ? { title: "關於", description: "Ecotone 兼容並續由國立臺灣大學、國立陽明交通大學與 SOS Foundation 三方共同發起。這裡有名字的由來、三方的角色，以及我們想長期做的事。" }
      : {
          title: "About",
          description:
            "Ecotone was co-founded by National Taiwan University, National Yang Ming Chiao Tung University and SOS Foundation. The story behind the name, what each partner brings, and what we mean to build for the long term.",
        }),
  });
}

/** Three hatched circles (Euler diagram): the triple overlap is 兼容並續 / Ecotone. */
function TriplePoint({ lang }: { lang: Lang }) {
  const zh = lang === "zh";
  const C = [
    { cx: 150, cy: 120, pat: "hatch" },
    { cx: 250, cy: 120, pat: "hatchW" },
    { cx: 200, cy: 205, pat: "lt-mech" },
  ];
  return (
    <svg className="triple" viewBox="-40 -10 480 360" role="img" aria-labelledby="triple-t">
      <title id="triple-t">
        {zh
          ? "三個圓分別代表臺大、陽明交大與 SOS Foundation；三者重疊之處，就是兼容並續。"
          : "Three circles stand for NTU, NYCU and SOS Foundation. Where all three overlap is Ecotone."}
      </title>
      <defs>
        {C.map((c, i) => (
          <clipPath key={i} id={`tp-${i}`}>
            <circle cx={c.cx} cy={c.cy} r="92" />
          </clipPath>
        ))}
      </defs>
      {C.map((c, i) => (
        <rect key={`f${i}`} width="400" height="330" fill={`url(#${c.pat})`} opacity=".33" clipPath={`url(#tp-${i})`} />
      ))}
      <g clipPath="url(#tp-0)">
        <g clipPath="url(#tp-1)">
          <rect width="400" height="330" fill="url(#hatchC)" clipPath="url(#tp-2)" />
        </g>
      </g>
      {C.map((c, i) => (
        <circle key={`c${i}`} cx={c.cx} cy={c.cy} r="92" fill="none" stroke="#1C1A17" strokeWidth="1.1" />
      ))}
      <g stroke="#1C1A17" strokeWidth=".5">
        <path d="M12 26L85 55" />
        <path d="M388 26L315 55" />
        <path d="M200 318V298" />
      </g>
      <text x="-30" y="22" className="svg-label" fill="#1C1A17">NTU</text>
      <text x="430" y="22" textAnchor="end" className="svg-label" fill="#1C1A17">NYCU</text>
      <text x="200" y="340" textAnchor="middle" className="svg-label" fill="#1C1A17">SOS Foundation</text>
      <rect x="148" y="130" width="104" height="34" fill="#FAF6EC" stroke="#A8321F" strokeWidth=".8" />
      <text x="200" y="153" textAnchor="middle" className={zh ? "svg-zh svg-zh--lg" : "svg-label"} fill="#A8321F">
        {zh ? "兼容並續" : "Ecotone"}
      </text>
    </svg>
  );
}

export default function AboutPage({ lang }: { lang: Lang }) {
  const zh = lang === "zh";
  const href = (p: string) => localePath(lang, p);
  const sorted = [...EVENTS].sort((a, b) => a.vol - b.vol);
  const nextVol = Math.max(...EVENTS.map((e) => e.vol)) + 1;

  return (
    <>
      <PageTitle
        catalog={[zh ? "Colophon · 關於" : "Colophon · About", "Collectors & provenance", "ECO-001"]}
        title={
          zh ? (
            <>
              兩所大學、一個基金會，
              <br />
              一個長期的約定。
            </>
          ) : (
            <>
              Two universities, one foundation,
              <br />
              one long-term commitment.
            </>
          )
        }
        lead={
          zh ? (
            <p>
              Ecotone 兼容並續是一個由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起的跨領域永續論壇。我們想做的不是一場漂亮的活動，而是一部可以一直增補下去的圖譜，一個長期的 <i>platform</i>。
            </p>
          ) : (
            <p>
              Ecotone is an interdisciplinary sustainability forum co-founded by National Taiwan University, National Yang Ming Chiao Tung University and SOS Foundation. We are not out to stage one handsome event, but to build an atlas that can keep growing: a long-term <i>platform</i>.
            </p>
          )
        }
        aside={<TriplePoint lang={lang} />}
      />

      {/* name */}
      <section className="sec sec--tight" aria-labelledby="name">
        <div className="wrap spread">
          <div className="reveal">
            <p className="catno mono">
              <span>{zh ? "On the name · 名字" : "On the name"}</span>
            </p>
            <h2 id="name" className="h-sec name-swap" lang={zh ? undefined : "zh-Hant-TW"}>
              <span>
                兼容並<s>蓄</s>
              </span>
              <span className="arrow" aria-hidden="true">
                →
              </span>
              <span>
                兼容並<b>續</b>
              </span>
            </h2>
          </div>
          <div className="gutter" aria-hidden="true" />
          <div className="reveal prose">
            {zh ? (
              <>
                <p className="lead">
                  「兼容並蓄」說的是把各種不同的事物一起收納進來。我們把「蓄」換成「續」：兼容不同的學科與身份，並且讓永續本身可以延續下去。
                </p>
                <p className="muted">
                  英文名 <i>Ecotone</i> 是生態學名詞：兩個生態系交會的過渡帶，例如河岸、潮間帶、林緣。這裡的環境最不穩定，卻往往也是物種最豐富的地方，也就是所謂的 <i>edge effect</i>。知識也是這樣：最有意思的想法，很少誕生在學科的正中央。
                </p>
              </>
            ) : (
              <>
                <p className="lead">
                  The Chinese idiom <span lang="zh-Hant-TW">兼容並蓄</span> (<i>jiān róng bìng xù</i>) means to take in all manner of different things. We swapped its last character, <span lang="zh-Hant-TW">蓄</span> (“to store”), for the homophone <span lang="zh-Hant-TW">續</span> (“to continue”). The new name says what we set out to do: embracing every field, sustaining what lasts, so that sustainability itself can carry on.
                </p>
                <p className="muted">
                  Our English name, <i>Ecotone</i>, comes from ecology: the transition zone where two ecosystems meet, such as a riverbank, a tidal flat or a forest edge. Conditions there are the least stable, yet these are often the places richest in species, the so-called <i>edge effect</i>. Knowledge works the same way. The most interesting ideas are rarely born at the centre of a discipline.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* why */}
      <section className="sec sec--tight" aria-labelledby="why">
        <div className="wrap spread">
          <div className="reveal">
            <p className="catno mono">
              <span>Why we started</span>
            </p>
            <h2 id="why" className="h-sec">
              {zh ? (
                <>
                  永續的問題，
                  <br />
                  從來不只屬於一個學科。
                </>
              ) : (
                <>
                  Problems of sustainability
                  <br />
                  never belong to one discipline.
                </>
              )}
            </h2>
          </div>
          <div className="gutter" aria-hidden="true" />
          <div className="reveal prose">
            {zh ? (
              <>
                <p>
                  氣候變遷是科學問題，也是語言問題；城市綠化是設計問題，也是生態問題；醫療院所的碳排，是管理問題，也是倫理問題。但大學的結構，往往讓這些人一輩子不會坐在同一張桌子前。
                </p>
                <p className="muted">
                  Ecotone 就是那張桌子。兩所大學提供學術的深度與廣度，SOS Foundation 提供跨界與行動的能量。我們一起定期邀請來自不同學科、甚至同時擁有多重身份的講者，讓永續的討論真正 <i>cross-pollinate</i>。
                </p>
              </>
            ) : (
              <>
                <p>
                  Climate change is a scientific problem, and a problem of language. Urban greening is a question of design, and of ecology. A hospital’s carbon emissions are a matter of management, and of ethics. Yet the way universities are built often means these people never sit at the same table in their lives.
                </p>
                <p className="muted">
                  Ecotone is that table. The two universities bring academic depth and breadth; SOS Foundation brings the energy to cross borders and act. Together we regularly invite speakers from different disciplines, often people with several identities at once, so that conversations about sustainability truly <i>cross-pollinate</i>.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <PlateEdge from="var(--paper)" to="var(--paper-2)" mode="fingers" seed={377} />

      {/* collectors */}
      <section className="sec sec--folio" aria-labelledby="collectors">
        <div className="wrap">
          <PlateHead
            lang={lang}
            no="§"
            label="Co-organizers"
            id="collectors"
            title={zh ? "共同主辦：三方各自帶來什麼" : "Co-organizers: what each partner brings"}
            en={zh ? "Co-organizers" : undefined}
          />
          <p className="muted partners-note reveal">{zh ? "論壇由這三個單位共同發起與主辦。" : "The forum was founded and is run jointly by these three organisations."}</p>
          <ul className="collector-cards">
            {CO_ORGANIZERS.map(({ key, role, detail }, i) => {
              const o = ORGS[key];
              return (
                <li key={key} className="reveal">
                  <CollectorStamp org={key} tilt={[-6, 4, -2][i]} lang={lang} />
                  <p className="mono cin">{zh ? `共同主辦 ${pad2(i + 1)}` : `Co-organizer ${pad2(i + 1)}`}</p>
                  <h3>{o.name[lang]}</h3>
                  {(zh || o.nameEn !== o.name.en) && <i className="muted">{o.nameEn}</i>}
                  <p>
                    <b>{role[lang]}</b>
                    {zh ? "：" : ": "}
                    {detail[lang]}
                  </p>
                  <OrgLink org={key} className="txtlink" lang={lang}>
                    {zh ? (
                      <>
                        {o.url ? "官方網站" : "網址待補"} <i>Visit</i>
                      </>
                    ) : o.url ? (
                      "Visit the website"
                    ) : (
                      "Website to come"
                    )}{" "}
                    <span aria-hidden="true">↗</span>
                  </OrgLink>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <PlateEdge from="var(--paper-2)" to="var(--paper)" mode="fingers" seed={610} />

      {/* principles + provenance */}
      <section className="sec" aria-labelledby="principles">
        <div className="wrap">
          <PlateHead lang={lang} no="§" label="Principles" id="principles" title={zh ? "我們的原則" : "Our principles"} en="How we work" />
          <ol className="principles">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title.zh} className="reveal">
                <span className="num">{roman(i + 1)}.</span>
                <h3>
                  {zh ? (
                    <>
                      {p.title.zh} <i>{p.title.en}</i>
                    </>
                  ) : (
                    p.title.en
                  )}
                </h3>
                <p className="muted">{p.detail[lang]}</p>
              </li>
            ))}
          </ol>

          <div className="provenance reveal">
            <h3 className="mono colo-h">{zh ? "Provenance · 圖譜的增補紀錄" : "Provenance · How the atlas has grown"}</h3>
            <ol>
              {sorted.map((e) => (
                <li key={e.slug}>
                  <Link href={href(`/events/${e.slug}`)}>
                    <VolumeEmblem e={e} size={72} />
                    <span className="mono">Vol. {pad2(e.vol)}</span>
                    <b lang={zh ? "en" : undefined}>{e.title}</b>
                    <span className="muted small">{e.dateLabel[lang]}</span>
                  </Link>
                </li>
              ))}
              <li className="future" aria-label={`Vol. ${pad2(nextVol)} ${zh ? "籌備中" : "in preparation"}`}>
                <span className="emblem-blank" aria-hidden="true" />
                <span className="mono">Vol. {pad2(nextVol)}</span>
                <b>{zh ? "籌備中" : "In preparation"}</b>
              </li>
            </ol>
          </div>

          <div className="reveal">
            <SpeakerAffiliations lang={lang} id="about-affil" />
          </div>

          <div className="legend reveal">
            <h3 className="mono colo-h">{zh ? "Legend · 學科線型圖例" : "Legend · Discipline linetypes"}</h3>
            <p className="muted small">
              {zh
                ? "圖譜裡的學科不用顏色區分，而用製圖線型，就像地圖用不同的線分辨道路與河流。兩種線型相遇的地方，就是一個 ecotone。"
                : "The atlas tells disciplines apart not by colour but by cartographic linetype, just as a map uses different lines for roads and rivers. Wherever two linetypes meet, there is an ecotone."}
            </p>
            <ul>
              {DISCIPLINES.map((d) => (
                <li key={d.key}>
                  <Swatch k={d.key} size="lg" lang={lang} />
                  <span className="muted small">
                    {zh ? (
                      <>
                        {d.linetype.zh} · <i>{d.name.en}</i>
                      </>
                    ) : (
                      <i>{d.linetype.en}</i>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-band" aria-labelledby="ab-cta">
        <div className="wrap cta-row">
          <h2 id="ab-cta">{zh ? "想成為下一冊的合作夥伴、講者，或只是想聊聊？" : "Want to partner on the next volume, speak, or simply talk?"}</h2>
          <Link className="btn btn--ink" href={href("/call-for-speakers#contact")}>
            {zh ? "與我們聯絡" : "Get in touch"} <small>CONTACT</small>
            <span className="mani" aria-hidden="true">
              ☞
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
