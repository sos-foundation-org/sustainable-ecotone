import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle, PlateHead } from "@/components/Typography";
import { PlateEdge } from "@/components/Dividers";
import CollectorStamp from "@/components/CollectorStamp";
import { VolumeEmblem } from "@/components/Volume";
import OrgLink from "@/components/OrgLink";
import Logo from "@/components/Logo";
import { CO_ORGANIZERS, NETWORK, ORGS, PRINCIPLES, SHOW_DRAFTS } from "@/content/site";
import { EVENTS } from "@/content/events";
import { DISCIPLINES } from "@/content/disciplines";
import Swatch from "@/components/Swatch";
import { pad2, roman } from "@/lib/engrave";

export const metadata: Metadata = {
  title: "關於",
  description: "Ecotone 兼容並續由國立臺灣大學、國立陽明交通大學與 SOS Foundation 三方共同發起 — 名字的由來、三方的角色，以及我們想長期做的事。",
};

/** Three hatched circles (Euler diagram): the triple overlap is 兼容並續. */
function TriplePoint() {
  const C = [
    { cx: 150, cy: 120, label: "NTU", sub: "學術深度", pat: "hatch" },
    { cx: 250, cy: 120, label: "NYCU", sub: "醫療與科技", pat: "hatchW" },
    { cx: 200, cy: 205, label: "SOS", sub: "跨界行動", pat: "lt-mech" },
  ];
  return (
    <svg className="triple" viewBox="-40 -10 480 360" role="img" aria-labelledby="triple-t">
      <title id="triple-t">三個圓分別代表臺大、陽明交大與 SOS Foundation；三者重疊之處，就是兼容並續。</title>
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
      <text x="200" y="153" textAnchor="middle" className="svg-zh svg-zh--lg" fill="#A8321F">兼容並續</text>
    </svg>
  );
}

export default function AboutPage() {
  const sorted = [...EVENTS].sort((a, b) => a.vol - b.vol);
  const nextVol = Math.max(...EVENTS.map((e) => e.vol)) + 1;

  return (
    <>
      <PageTitle
        catalog={["Colophon · 關於", "Collectors & provenance", "ECO-001"]}
        title={
          <>
            兩所大學、一個基金會，
            <br />
            一個長期的約定。
          </>
        }
        lead={
          <p>
            Ecotone 兼容並續是一個由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起的跨領域永續論壇。我們想做的不是一場漂亮的活動，而是一部可以一直增補下去的圖譜 — 一個長期的 <i>platform</i>。
          </p>
        }
        aside={<TriplePoint />}
      />

      {/* name */}
      <section className="sec sec--tight" aria-labelledby="name">
        <div className="wrap spread">
          <div className="reveal">
            <p className="catno mono">
              <span>On the name · 名字</span>
            </p>
            <h2 id="name" className="h-sec name-swap">
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
            <p className="lead">
              「兼容並蓄」說的是把各種不同的事物一起收納進來。我們把「蓄」換成「續」— 兼容不同的學科與身份，並且讓永續本身可以延續下去。
            </p>
            <p className="muted">
              英文名 <i>Ecotone</i> 是生態學名詞：兩個生態系交會的過渡帶，例如河岸、潮間帶、林緣。這裡的環境最不穩定，卻往往也是物種最豐富的地方 — 所謂的 <i>edge effect</i>。知識也是這樣：最有意思的想法，很少誕生在學科的正中央。
            </p>
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
              永續的問題，
              <br />
              從來不只屬於一個學科。
            </h2>
          </div>
          <div className="gutter" aria-hidden="true" />
          <div className="reveal prose">
            <p>
              氣候變遷是科學問題，也是語言問題；城市綠化是設計問題，也是生態問題；醫療院所的碳排，是管理問題，也是倫理問題。但大學的結構，往往讓這些人一輩子不會坐在同一張桌子前。
            </p>
            <p className="muted">
              Ecotone 就是那張桌子。兩所大學提供學術的深度與廣度，SOS Foundation 提供跨界與行動的能量 — 我們一起定期邀請來自不同學科、甚至同時擁有多重身份的講者，讓永續的討論真正 <i>cross-pollinate</i>。
            </p>
          </div>
        </div>
      </section>

      <PlateEdge from="var(--paper)" to="var(--paper-2)" mode="fingers" seed={377} />

      {/* collectors */}
      <section className="sec sec--folio" aria-labelledby="collectors">
        <div className="wrap">
          <PlateHead no="§" label="Collectors" id="collectors" title="三方合作，各自帶來什麼" en="Three collectors, three roles" />
          <ul className="collector-cards">
            {CO_ORGANIZERS.map(({ key, role, detail }, i) => {
              const o = ORGS[key];
              return (
                <li key={key} className="reveal">
                  <CollectorStamp org={key} tilt={[-6, 4, -2][i]} />
                  <p className="mono cin">Collector {pad2(i + 1)}</p>
                  <h3>{o.name}</h3>
                  <i className="muted">{o.nameEn}</i>
                  <p>
                    <b>{role}</b> — {detail}
                  </p>
                  <OrgLink org={key} className="txtlink">
                    {o.url ? "官方網站" : "網址待補"} <i>Visit</i> <span aria-hidden="true">↗</span>
                  </OrgLink>
                </li>
              );
            })}
          </ul>
          <p className="mono network-h">Network · 講者所屬機構</p>
          <ul className="logo-row">
            {NETWORK.map((k) => (
              <li key={k}>
                <OrgLink org={k}>
                  {ORGS[k].logo && <Logo src={ORGS[k].logo} />}
                  {ORGS[k].name}
                  {SHOW_DRAFTS && ORGS[k].placeholder && <span className="flag">暫代</span>}
                </OrgLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PlateEdge from="var(--paper-2)" to="var(--paper)" mode="fingers" seed={610} />

      {/* principles + provenance */}
      <section className="sec" aria-labelledby="principles">
        <div className="wrap">
          <PlateHead no="§" label="Principles" id="principles" title="我們的原則" en="How we work" />
          <ol className="principles">
            {PRINCIPLES.map((p, i) => (
              <li key={p.zh} className="reveal">
                <span className="num">{roman(i + 1)}.</span>
                <h3>
                  {p.zh} <i>{p.en}</i>
                </h3>
                <p className="muted">{p.detail}</p>
              </li>
            ))}
          </ol>

          <div className="provenance reveal">
            <h3 className="mono colo-h">Provenance · 圖譜的增補紀錄</h3>
            <ol>
              {sorted.map((e) => (
                <li key={e.slug}>
                  <Link href={`/events/${e.slug}`}>
                    <VolumeEmblem e={e} size={72} />
                    <span className="mono">Vol. {pad2(e.vol)}</span>
                    <b lang="en">{e.title}</b>
                    <span className="muted small">{e.dateLabel}</span>
                  </Link>
                </li>
              ))}
              <li className="future" aria-label={`Vol. ${pad2(nextVol)} 籌備中`}>
                <span className="emblem-blank" aria-hidden="true" />
                <span className="mono">Vol. {pad2(nextVol)}</span>
                <b>籌備中</b>
              </li>
            </ol>
          </div>

          <div className="legend reveal">
            <h3 className="mono colo-h">Legend · 學科線型圖例</h3>
            <p className="muted small">圖譜裡的學科不用顏色區分，而用製圖線型 — 像地圖用不同的線分辨道路與河流。兩種線型相遇的地方，就是一個 ecotone。</p>
            <ul>
              {DISCIPLINES.map((d) => (
                <li key={d.key}>
                  <Swatch k={d.key} size="lg" />
                  <span className="muted small">
                    {d.linetype} · <i>{d.en}</i>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-band" aria-labelledby="ab-cta">
        <div className="wrap cta-row">
          <h2 id="ab-cta">想成為下一冊的合作夥伴、講者，或只是想聊聊？</h2>
          <Link className="btn btn--ink" href="/call-for-speakers#contact">
            與我們聯絡 <small>CONTACT</small>
            <span className="mani" aria-hidden="true">
              ☞
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
