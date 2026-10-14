import Link from "next/link";
import MycorrhizaHero, { type HeroPair, type HeroSpeaker } from "@/components/mycorrhiza/MycorrhizaHero";
import type { WebNode } from "@/components/mycorrhiza/engine";
import { MareyDivider, PlateEdge } from "@/components/Dividers";
import { PlateHead } from "@/components/Typography";
import EdgeEffectFigure from "@/components/EdgeEffectFigure";
import CrossingAtlas from "@/components/CrossingAtlas";
import { Portrait } from "@/components/Specimen";
import Swatch from "@/components/Swatch";
import { VolumeEmblem } from "@/components/Volume";
import CollectorStamp from "@/components/CollectorStamp";
import { BlankLabel, CallLink, SpeakerFormButton } from "@/components/SpeakerCall";
import OrgLink from "@/components/OrgLink";
import FollowCard from "@/components/Follow";
import Logo from "@/components/Logo";
import Rich from "@/components/Rich";
import { EVENTS, upcomingEvents } from "@/content/events";
import { COUNTRIES, SPEAKERS, catalogNo, speakerById, type CountryCode } from "@/content/speakers";
import type { MushroomKind } from "@/lib/mycelium";
import { DISCIPLINES, disciplineByKey } from "@/content/disciplines";
import { DESIDERATA } from "@/content/crossings";
import { VOICES } from "@/content/voices";
import { CO_ORGANIZERS, NETWORK, ORGS, SHOW_DRAFTS } from "@/content/site";
import { fmtCoord, pad2, roman } from "@/lib/engrave";

export default function Home() {
  const latest = upcomingEvents()[0] ?? [...EVENTS].sort((a, b) => b.vol - a.vol)[0];
  const lineup = latest.speakers.map(speakerById).filter((s) => s !== undefined);
  // the platform's whole collection: everyone on any volume, upcoming or past
  const folio = SPEAKERS.filter((s) => EVENTS.some((e) => e.speakers.includes(s.id)));
  const covered = new Set(folio.flatMap((s) => s.disciplines));
  const desiderata = [...DESIDERATA].sort((x, y) => Number(covered.has(x.a)) + Number(covered.has(x.b)) - (Number(covered.has(y.a)) + Number(covered.has(y.b))));
  const vol = `Vol. ${pad2(latest.vol)}`;

  // ── the hero's above & below: this volume's speakers fruit above the soil;
  //    below, their hyphae reach the disciplines and countries they touch.
  const KINDS: MushroomKind[] = ["bell", "parasol", "bell", "parasol", "bolete"];
  const countriesOf = (s: (typeof SPEAKERS)[number]) => [...new Set(s.places.map((p) => p.country))];
  const usedCountries = new Set(folio.flatMap(countriesOf));
  const nodes: WebNode[] = [
    ...DISCIPLINES.map((d) => ({ id: `d:${d.key}`, code: d.code, zh: d.zh, type: "disc" as const, vacant: !covered.has(d.key) })),
    ...(Object.keys(COUNTRIES) as CountryCode[]).filter((c) => usedCountries.has(c)).map((c) => ({ id: `c:${c}`, code: c, zh: COUNTRIES[c].zh, type: "ctry" as const, vacant: false })),
  ];
  const heroSpeakers: HeroSpeaker[] = lineup.map((s, i) => ({
    id: s.id,
    name: s.name,
    sub: s.short,
    kind: KINDS[i % KINDS.length],
    links: [...s.disciplines.map((k) => `d:${k}`), ...countriesOf(s).map((c) => `c:${c}`)],
    linkNames: [...s.disciplines.map((k) => disciplineByKey(k).zh), ...countriesOf(s).map((c) => COUNTRIES[c].zh)],
  }));
  const heroPairs: HeroPair[] = desiderata.map((p) => {
    const A = disciplineByKey(p.a);
    const B = disciplineByKey(p.b);
    return { a: `d:${p.a}`, b: `d:${p.b}`, aLabel: [A.code, A.zh], bLabel: [B.code, B.zh], question: p.question };
  });

  return (
    <>
      {/* ───────── Above & below: the mycorrhizal hero ───────── */}
      <MycorrhizaHero
        speakers={heroSpeakers}
        nodes={nodes}
        pairs={heroPairs}
        volume={{
          title: `${vol} ${latest.title}`,
          meta: `${latest.dateShort} · ${latest.venueNote.split(" · ")[0]}`,
          href: `/events/${latest.slug}`,
          next: `Vol. ${pad2(EVENTS.length + 1)} · 籌備中`,
        }}
        title={
          <>
            <p className="myco-eyebrow mono">
              NTU × NYCU × SOS Foundation <span>｜ 跨領域永續論壇</span>
            </p>
            <h1 id="hero-title" className="myco-h1">
              <span className="lat" lang="en">
                Ecotone
              </span>
              <span className="pron">/ˈɛkəˌtoʊn/ n. 生態交會帶：兩個生態系相遇之處</span>
              <span className="zh">兼容並續</span>
            </h1>
            <p className="myco-kicker">
              地面上，是一場場講座；
              <br />
              地面下，是把它們<em>連起來的網</em>。
            </p>
          </>
        }
        lead={
          <>
            <p>
              森林裡最重要的交換，發生在看不見的地方。樹與樹之間靠菌根網絡（<i>the wood wide web</i>）傳遞養分與訊號，而且不同物種，也彼此相連。
            </p>
            <p className="sub">
              Ecotone 兼容並續想做的是同一件事：讓文學、法律、醫學、電機、漁業……在地表下接上線。把游標移到地上的菇（或用鍵盤聚焦），看看每位講者連到哪裡。
            </p>
            <div className="actions">
              <Link className="btn btn--spore" href={`/events/${latest.slug}`}>
                最新一冊 · <span lang="en">{latest.title}</span> <small>{vol}</small>
                <span className="mani" aria-hidden="true">
                  ☞
                </span>
              </Link>
              <Link className="btn btn--line" href="#crossings">
                交會圖譜 <small>ATLAS OF CROSSINGS</small>
              </Link>
            </div>
          </>
        }
      />

      <PlateEdge from="var(--humus)" to="var(--paper)" mode="fingers" seed={5} />

      <MareyDivider />

      {/* ───────── Pl. II · Why Ecotone ───────── */}
      <section className="sec" aria-labelledby="pl2">
        <div className="wrap">
          <PlateHead no="II" id="pl2" title="為什麼是 Ecotone" en="On the edge effect" side="ECO-001 / II" />
          <div className="spread">
            <dl className="lex reveal">
              <dt>兼容並續</dt>
              <dd className="pron">
                jiān róng bìng xù <span className="mono">〔名〕 n.</span>
              </dd>
              <dd>
                <ol>
                  <li>改自成語「兼容並蓄」— 把各種不同的事物，一起收納進來。</li>
                  <li>
                    以「續」代「蓄」：<b>兼容</b>不同的學科與身份，<b>並續</b> — 讓永續本身得以延續。
                  </li>
                  <li>
                    英名 <i>Ecotone</i>：兩個生態系交會的過渡帶，如河岸、潮間帶、林緣。這裡往往是物種最豐富的地方，謂之 <i>edge effect</i>。
                  </li>
                </ol>
                <p className="eg">例：當牙科診間遇上碳足跡，那裡便是一處 ecotone。</p>
              </dd>
            </dl>
            <div className="gutter" aria-hidden="true" />
            <div>
              <EdgeEffectFigure />
              <div className="after-fig reveal">
                <p className="big">把「森林」換成醫學，「草原」換成文學 — 曲線依然成立。</p>
                <p className="muted">
                  最有意思的想法，很少誕生在學科的正中央。Ecotone 刻意製造這種邊界，並且定期、長期地讓它發生：一冊一冊，把不同學科、不同國家的人放進同一張圖版裡。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlateEdge from="var(--paper)" to="var(--cyan)" mode="lace" seed={8} label="ECOTONE · Pl. II / Pl. III" />

      {/* ───────── Pl. IV · Atlas of Crossings (data-driven) ───────── */}
      <section className="sec sec--cyan" id="crossings" aria-labelledby="pl3">
        <div className="wrap">
          <PlateHead no="III" id="pl3" title="交會圖譜" en="Atlas of Crossings" side={`${folio.length} speakers · ${covered.size}/${DISCIPLINES.length} fields`} />
          <div className="atlas-solo reveal">
            <p className="lead">
              每位講者都站在一道邊界上：左邊是他們的學科，右邊是他們工作的地方。把滑鼠移到名字上（或用鍵盤聚焦、點一下固定），看看誰把哪些世界接在一起。每多一冊，這張圖譜就長大一點。
            </p>
            <CrossingAtlas
              idPrefix="home-atlas"
              speakers={folio.map((s) => ({ id: s.id, name: s.name, disciplines: s.disciplines, places: s.places }))}
              disciplines={DISCIPLINES}
              voices={VOICES}
              caption={`目前名錄中有 ${folio.length} 位講者，觸及 ${covered.size} / ${DISCIPLINES.length} 個學科。虛線的學科，等待下一位講者。`}
            />
          </div>
          <p className="draft-note light">† 學科標註依講者目前公開的身份整理，待講者確認。</p>
        </div>
      </section>

      <PlateEdge from="var(--cyan)" to="var(--paper-2)" mode="lace" seed={21} />

      {/* ───────── Pl. V · Latest volume ───────── */}
      <section className="sec sec--folio" aria-labelledby="pl4">
        <div className="wrap">
          <PlateHead no="IV" id="pl4" title="最新一冊" en={`Volume ${roman(latest.vol)} · ${latest.title}`} side={latest.statusLabel} />
          <div className="spread spread--vol">
            <div className="title-page reveal">
              <VolumeEmblem e={latest} />
              <p className="mono">Volume {roman(latest.vol)}</p>
              <h3>
                <span lang="en">{latest.title}</span>
                <small>{latest.titleZh}</small>
              </h3>
              <Rich as="p" className="muted" html={latest.summary} />
              <p className="attendance mono">{latest.attendance}</p>
              <Link className="btn btn--ink" href={`/events/${latest.slug}`}>
                翻開這一冊 <small>READ THE PLATE</small>
                <span className="mani" aria-hidden="true">
                  ☞
                </span>
              </Link>
            </div>
            <div className="gutter" aria-hidden="true" />
            <div className="reveal">
              <h3 className="toc-head">
                本冊講者 <i>Speakers in this volume</i>
              </h3>
              <ul className="lineup lineup--compact">
                {lineup.map((s) => (
                  <li key={s.id}>
                    <Link href={`/events/${latest.slug}#${s.id}`} className="mini-sheet">
                      <Portrait s={s} size="sm" />
                      <span className="mono cin">{catalogNo(s)}</span>
                      <b>{s.name}</b>
                      <i>{s.short}</i>
                      <span className="mini-swatches">
                        {s.disciplines.map((k) => (
                          <Swatch key={k} k={k} label={false} size="sm" />
                        ))}
                      </span>
                      <span className="lbls" aria-label={`${s.identities.length} 種身份`}>
                        {s.identities.map((id) => (
                          <span key={id.title} />
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="follow-row reveal">
            <FollowCard />
          </div>
        </div>
      </section>

      <PlateEdge from="var(--paper-2)" to="var(--paper)" mode="fingers" seed={34} />

      {/* ───────── Pl. VI · Call for speakers ───────── */}
      <section className="sec" aria-labelledby="pl5">
        <div className="wrap">
          <PlateHead no="V" id="pl5" title="徵求新講者" en="Call for Speakers" side="Desiderata" />
          <div className="call-spread">
            <div className="reveal">
              <p className="call-big">你身上，是不是也貼著好幾張標籤？</p>
              <p className="lead">
                我們在找跨領域、且與永續或自然有實質連結的講者：同時活在好幾個世界裡 — 在實驗室與田野之間、在診間與政策之間、在臺灣與另一個國家之間 — 而工作真正碰觸到土地、生態或永續轉型的人。如果你的工作本身就是一道邊界，我們想邀請你成為下一冊的講者。
              </p>
              <div className="actions">
                <CallLink />
                <SpeakerFormButton variant="light" />
              </div>
            </div>
            <div className="reveal">
              <BlankLabel />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Atlas teaser + collectors ───────── */}
      <section className="sec sec--folio sec--tight-top" aria-labelledby="voices-teaser">
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <p className="catno mono">
                <span>Atlas · 海外聲音</span>
              </p>
              <h2 id="voices-teaser" className="h-sec">
                跨過國界的聲音，
                <br />
                也是一種授粉。
              </h2>
              <p className="muted">海外的研究者、設計師與實踐者，各自錄一段短片，回應一個問題。不同國家的相遇，本身就是一種跨領域。</p>
              <Link className="txtlink" href="/voices">
                打開地圖集 <i>Open the Atlas</i> <span aria-hidden="true">☞</span>
              </Link>
            </div>
            <ul className="sheet-strip reveal">
              {VOICES.slice(0, 4).map((v, i) => (
                <li key={v.id}>
                  <span className="mono">Sheet {pad2(i + 1)}</span>
                  <i>{v.location}</i>
                  <span className="mono muted">{v.lat !== undefined && v.lng !== undefined ? `${v.approx ? "≈ " : ""}${fmtCoord(v.lat, v.lng)}` : "TBA"}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="collectors reveal">
            <h2 className="mono colo-h">Collectors · 三方共同發起</h2>
            <ul className="stamps">
              {CO_ORGANIZERS.map(({ key, blurb }, i) => (
                <li key={key}>
                  <CollectorStamp org={key} tilt={[-6, 4, -2][i]} />
                  <b>{ORGS[key].name}</b>
                  <span className="muted small">{blurb}</span>
                </li>
              ))}
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
        </div>
      </section>
    </>
  );
}
