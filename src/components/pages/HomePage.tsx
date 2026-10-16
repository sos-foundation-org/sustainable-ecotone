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
import { CoOrganizers, SpeakerAffiliations } from "@/components/Partners";
import { BlankLabel, CallLink, SpeakerFormButton } from "@/components/SpeakerCall";
import FollowCard from "@/components/Follow";
import { RegisterButton, SessionLine } from "@/components/Register";
import Rich from "@/components/Rich";
import { EVENTS, upcomingEvents } from "@/content/events";
import { COUNTRIES, SPEAKERS, catalogNo, speakerById, type CountryCode } from "@/content/speakers";
import type { FungusId } from "@/content/fungi";
import { DISCIPLINES, disciplineByKey } from "@/content/disciplines";
import { DESIDERATA } from "@/content/crossings";
import { VOICES } from "@/content/voices";
import { fmtCoord, pad2, roman } from "@/lib/engrave";
import { localePath, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";

export function homeMetadata(lang: Lang) {
  return lang === "zh"
    ? pageMetadata({
        lang,
        path: "/",
        absoluteTitle: true,
        title: "Ecotone｜兼容並續 · NTU × NYCU × SOS 跨領域永續論壇",
        ogTitle: "Ecotone｜兼容並續",
        description:
          "Ecotone 兼容並續是由國立臺灣大學、國立陽明交通大學與 SOS Foundation 共同發起的跨領域永續論壇：在學科的交界處，讓永續長出新的物種。第一場：2026 年 11 月 Sustainable Urbanization? Rewilding? 系列演講。",
      })
    : pageMetadata({
        lang,
        path: "/",
        absoluteTitle: true,
        title: "Ecotone · Interdisciplinary Sustainability Forum · NTU × NYCU × SOS",
        ogTitle: "Ecotone · Interdisciplinary Sustainability Forum",
        description:
          "Ecotone is an interdisciplinary sustainability forum co-founded by National Taiwan University, National Yang Ming Chiao Tung University and SOS Foundation. Where disciplines meet, sustainability grows new species. First volume: Sustainable Urbanization? Rewilding?, a lecture series in November 2026.",
      });
}

export default function HomePage({ lang }: { lang: Lang }) {
  const zh = lang === "zh";
  const href = (p: string) => localePath(lang, p);
  const latest = upcomingEvents()[0] ?? [...EVENTS].sort((a, b) => b.vol - a.vol)[0];
  const lineup = latest.speakers.map(speakerById).filter((s) => s !== undefined);
  // the platform's whole collection: everyone on any volume, upcoming or past
  const folio = SPEAKERS.filter((s) => EVENTS.some((e) => e.speakers.includes(s.id)));
  const covered = new Set(folio.flatMap((s) => s.disciplines));
  const desiderata = [...DESIDERATA].sort((x, y) => Number(covered.has(x.a)) + Number(covered.has(x.b)) - (Number(covered.has(y.a)) + Number(covered.has(y.b))));
  const vol = `Vol. ${pad2(latest.vol)}`;

  // ── the hero's above & below: this volume's speakers fruit above the soil;
  //    below, their hyphae reach the disciplines and countries they touch.
  // each speaker fruits as a different species (stable by lineup order, so server and client match)
  const HERO_SPECIES: FungusId[] = ["mycena", "amanita", "morchella", "macrolepiota", "coprinus", "cantharellus", "boletus", "clathrus", "geastrum"];
  const countriesOf = (s: (typeof SPEAKERS)[number]) => [...new Set(s.places.map((p) => p.country))];
  const usedCountries = new Set(folio.flatMap(countriesOf));
  const nodes: WebNode[] = [
    ...DISCIPLINES.map((d) => ({ id: `d:${d.key}`, code: d.code, label: d.name[lang], type: "disc" as const, vacant: !covered.has(d.key) })),
    ...(Object.keys(COUNTRIES) as CountryCode[]).filter((c) => usedCountries.has(c)).map((c) => ({ id: `c:${c}`, code: c, label: COUNTRIES[c][lang], type: "ctry" as const, vacant: false })),
  ];
  const heroSpeakers: HeroSpeaker[] = lineup.map((s, i) => ({
    id: s.id,
    name: s.name[lang],
    sub: s.short,
    species: HERO_SPECIES[i % HERO_SPECIES.length],
    links: [...s.disciplines.map((k) => `d:${k}`), ...countriesOf(s).map((c) => `c:${c}`)],
    linkNames: [...s.disciplines.map((k) => disciplineByKey(k).name[lang]), ...countriesOf(s).map((c) => COUNTRIES[c][lang])],
  }));
  const heroPairs: HeroPair[] = desiderata.map((p) => {
    const A = disciplineByKey(p.a);
    const B = disciplineByKey(p.b);
    return { a: `d:${p.a}`, b: `d:${p.b}`, aLabel: [A.code, A.name[lang]], bLabel: [B.code, B.name[lang]], question: p.question[lang] };
  });

  return (
    <>
      {/* ───────── Above & below: the mycorrhizal hero ───────── */}
      <MycorrhizaHero
        lang={lang}
        speakers={heroSpeakers}
        nodes={nodes}
        pairs={heroPairs}
        volume={{
          title: `${vol} ${latest.title}`,
          meta: `${latest.dateShort} · ${latest.venueNote[lang].split(" · ")[0]}`,
          href: href(`/events/${latest.slug}`),
          next: `Vol. ${pad2(EVENTS.length + 1)} · ${zh ? "籌備中" : "In preparation"}`,
        }}
        title={
          zh ? (
            <>
              <p className="myco-eyebrow mono">
                NTU × NYCU × SOS
              </p>
              <h1 id="hero-title" className="myco-h1">
                <span className="lat" lang="en">
                  Ecotone
                </span>
                <span className="pron">/ˈɛkəˌtoʊn/ n. 生態交會帶：兩個生態系相遇之處</span>
                {/* the same waterline treatment as the volume titles */}
                <span className="zh wl wl--hero">
                <span className="wl-above">兼容並續</span>
                <span className="wl-below" aria-hidden="true">
                  兼容並續
                </span>
                <span className="wl-line" aria-hidden="true" />
                </span>
              </h1>
              <p className="myco-kicker">
                地面上，是一場場講座；
                <br />
                地面下，是把它們<em>連起來的網</em>。
              </p>
            </>
          ) : (
            <>
              <p className="myco-eyebrow mono">
                NTU × NYCU × SOS
              </p>
              <h1 id="hero-title" className="myco-h1">
                <span className="lat">Ecotone</span>
                <span className="pron">/ˈɛkəˌtoʊn/ n. the zone where two ecosystems meet</span>
                <span className="zh wl wl--hero" lang="zh-Hant-TW">
                <span className="wl-above">兼容並續</span>
                <span className="wl-below" aria-hidden="true">
                  兼容並續
                </span>
                <span className="wl-line" aria-hidden="true" />
                </span>
              </h1>
              <p className="myco-kicker">
                Above ground, a series of talks.
                <br />
                Below it, <em>the web that joins them</em>.
              </p>
            </>
          )
        }
        lead={
          <>
            {zh ? (
              <>
                <p>
                  森林裡最重要的交換，發生在看不見的地方。樹與樹之間靠菌根網絡（<i>the wood wide web</i>）傳遞養分與訊號，而且不同物種，也彼此相連。
                </p>
                <p className="sub">
                  Ecotone 兼容並續想做的是同一件事：讓文學、法律、醫學、電機、漁業……在地表下接上線。把游標移到地上的菇（或用鍵盤聚焦），看看每位講者連到哪裡。
                </p>
              </>
            ) : (
              <>
                <p>
                  The most important exchanges in a forest happen out of sight. Trees pass nutrients and signals to one another through mycorrhizal networks (<i>the wood wide web</i>), and these networks connect different species too.
                </p>
                <p className="sub">
                  Ecotone sets out to do the same thing: to wire literature, law, medicine, electrical engineering, fisheries and more together beneath the surface. Hover over a mushroom above ground (or focus one with the keyboard) to see where each speaker connects.
                </p>
              </>
            )}
            <div className="actions">
              <Link className="btn btn--spore" href={href(`/events/${latest.slug}`)}>
                {zh ? "最新一冊" : "Latest volume"} · <span lang={zh ? "en" : undefined}>{latest.title}</span> <small>{vol}</small>
                <span className="mani" aria-hidden="true">
                  ☞
                </span>
              </Link>
              <Link className="btn btn--line" href="#crossings">
                {zh ? (
                  <>
                    交會圖譜 <small>ATLAS OF CROSSINGS</small>
                  </>
                ) : (
                  <>
                    Atlas of Crossings <small>PL. III</small>
                  </>
                )}
              </Link>
            </div>
          </>
        }
      />

      <PlateEdge from="var(--humus)" to="var(--paper)" mode="fingers" seed={5} />

      <MareyDivider lang={lang} />

      {/* ───────── Pl. II · Why Ecotone ───────── */}
      <section className="sec" aria-labelledby="pl2">
        <div className="wrap">
          <PlateHead lang={lang} no="II" id="pl2" title={zh ? "為什麼是 Ecotone" : "Why Ecotone"} en="On the edge effect" side="ECO-001 / II" />
          <div className="spread">
            {zh ? (
              <dl className="lex reveal">
                <dt>兼容並續</dt>
                <dd className="pron">
                  jiān róng bìng xù <span className="mono">〔名〕 n.</span>
                </dd>
                <dd>
                  <ol>
                    <li>改自成語「兼容並蓄」：把各種不同的事物，一起收納進來。</li>
                    <li>
                      以「續」代「蓄」：<b>兼容</b>不同的學科與身份，<b>並續</b>，讓永續本身得以延續。
                    </li>
                    <li>
                      英名 <i>Ecotone</i>：兩個生態系交會的過渡帶，如河岸、潮間帶、林緣。這裡往往是物種最豐富的地方，謂之 <i>edge effect</i>。
                    </li>
                  </ol>
                  <p className="eg">例：當牙科診間遇上碳足跡，那裡便是一處 ecotone。</p>
                </dd>
              </dl>
            ) : (
              <dl className="lex reveal">
                <dt lang="zh-Hant-TW">兼容並續</dt>
                <dd className="pron">
                  jiān róng bìng xù <span className="mono">n.</span>
                </dd>
                <dd>
                  <ol>
                    <li>
                      A play on the Chinese idiom <span lang="zh-Hant-TW">兼容並蓄</span>: to take in all manner of different things, side by side.
                    </li>
                    <li>
                      One character is swapped for its homophone, <span lang="zh-Hant-TW">蓄</span> (to store) for <span lang="zh-Hant-TW">續</span> (to continue):{" "}
                      <b>embracing every field</b> and identity, <b>sustaining what lasts</b>, so that sustainability itself can endure.
                    </li>
                    <li>
                      Its English name, <i>Ecotone</i>: the transition zone where two ecosystems meet, such as a riverbank, a tidal flat or a forest edge. These are often the places richest in species, a phenomenon known as the <i>edge effect</i>.
                    </li>
                  </ol>
                  <p className="eg">e.g. Where the dentist’s chair meets the carbon footprint, there is an ecotone.</p>
                </dd>
              </dl>
            )}
            <div className="gutter" aria-hidden="true" />
            <div>
              <EdgeEffectFigure lang={lang} />
              <div className="after-fig reveal">
                {zh ? (
                  <>
                    <p className="big">把「森林」換成醫學、「草原」換成文學，曲線依然成立。</p>
                    <p className="muted">
                      最有意思的想法，很少誕生在學科的正中央。Ecotone 刻意製造這種邊界，並且定期、長期地讓它發生：一冊一冊，把不同學科、不同國家的人放進同一張圖版裡。
                    </p>
                  </>
                ) : (
                  <>
                    <p className="big">Swap the forest for medicine and the grassland for literature, and the curve still holds.</p>
                    <p className="muted">
                      The most interesting ideas are rarely born at the centre of a discipline. Ecotone creates these edges on purpose, and keeps them coming, regularly and for the long term: volume by volume, it places people from different fields and countries on the same plate.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlateEdge from="var(--paper)" to="var(--cyan)" mode="lace" seed={8} label="ECOTONE · Pl. II / Pl. III" />

      {/* ───────── Pl. III · Atlas of Crossings (data-driven) ───────── */}
      <section className="sec sec--cyan" id="crossings" aria-labelledby="pl3">
        <div className="wrap">
          <PlateHead
            lang={lang}
            no="III"
            id="pl3"
            title={zh ? "交會圖譜" : "Atlas of Crossings"}
            en={zh ? "Atlas of Crossings" : undefined}
            side={`${folio.length} speakers · ${covered.size}/${DISCIPLINES.length} fields`}
          />
          <div className="atlas-solo reveal">
            <p className="lead">
              {zh
                ? "每位講者都站在一道邊界上：左邊是他們的學科，右邊是他們工作的地方。把滑鼠移到名字上（或用鍵盤聚焦、點一下固定），看看誰把哪些世界接在一起。每多一冊，這張圖譜就長大一點。"
                : "Every speaker stands on a border: on one side their discipline, on the other the places where they work. Hover over a name (or focus it with the keyboard, or tap to pin it) to see who joins which worlds together. With every volume, the atlas grows a little."}
            </p>
            <CrossingAtlas
              lang={lang}
              idPrefix="home-atlas"
              speakers={folio.map((s) => ({ id: s.id, name: s.name[lang], photo: s.photo, initial: s.initial[lang], disciplines: s.disciplines, places: s.places }))}
              disciplines={DISCIPLINES}
              caption={
                zh
                  ? `目前名錄中有 ${folio.length} 位講者，觸及 ${covered.size} / ${DISCIPLINES.length} 個學科。虛線的學科，等待下一位講者。`
                  : `The register now holds ${folio.length} speakers, touching ${covered.size} of ${DISCIPLINES.length} fields. Fields drawn in dashed lines are waiting for their first speaker.`
              }
            />
          </div>
          <div className="reveal">
            <SpeakerAffiliations lang={lang} id="home-affil" logos={false} note={false} />
          </div>
          <p className="draft-note light">
            {zh ? "† 學科標註依講者目前公開的身份整理，待講者確認。" : "† Discipline tags follow each speaker’s current public roles and are pending their confirmation."}
          </p>
        </div>
      </section>

      <PlateEdge from="var(--cyan)" to="var(--paper-2)" mode="lace" seed={21} />

      {/* ───────── Pl. IV · Latest volume ───────── */}
      <section className="sec sec--folio" aria-labelledby="pl4">
        <div className="wrap">
          <PlateHead
            lang={lang}
            no="IV"
            id="pl4"
            title={zh ? "最新一冊" : "Latest volume"}
            en={`Volume ${roman(latest.vol)} · ${latest.title}`}
            side={latest.statusLabel[lang]}
          />
          <div className="spread spread--vol">
            <div className="title-page reveal">
              <VolumeEmblem e={latest} />
              <p className="mono">Volume {roman(latest.vol)}</p>
              <h3>
                <span lang={zh ? "en" : undefined}>{latest.title}</span>
                <small>{latest.subtitle[lang]}</small>
              </h3>
              <Rich as="p" className="muted" html={latest.summary[lang]} />
              <p className="attendance mono">{latest.attendance[lang]}</p>
              <SessionLine e={latest} lang={lang} />
              <div className="actions actions--tight">
                <Link className="btn btn--ink" href={href(`/events/${latest.slug}`)}>
                  {zh ? (
                    <>
                      翻開這一冊 <small>READ THE PLATE</small>
                    </>
                  ) : (
                    <>
                      Open the volume <small>{vol}</small>
                    </>
                  )}
                  <span className="mani" aria-hidden="true">
                    ☞
                  </span>
                </Link>
                {/* goes straight to the Google Form (「報名參加活動」 pre-filled; sessions are ticked in the form) */}
                {latest.sessions && latest.sessions.length > 0 && (
                  <RegisterButton url={latest.registerUrl ?? ""} lang={lang} label={zh ? "報名參加" : "Register"} small={zh ? "REGISTER" : undefined} variant="line" />
                )}
              </div>
            </div>
            <div className="gutter" aria-hidden="true" />
            <div className="reveal">
              <h3 className="toc-head">
                {zh ? (
                  <>
                    本冊講者 <i>Speakers in this volume</i>
                  </>
                ) : (
                  "Speakers in this volume"
                )}
              </h3>
              <ul className="lineup lineup--compact">
                {lineup.map((s) => (
                  <li key={s.id}>
                    <Link href={href(`/events/${latest.slug}#${s.id}`)} className="mini-sheet">
                      <Portrait s={s} size="sm" lang={lang} />
                      <span className="mono cin">{catalogNo(s)}</span>
                      <b>{s.name[lang]}</b>
                      <i>{s.short}</i>
                      <span className="mini-swatches">
                        {s.disciplines.map((k) => (
                          <Swatch key={k} k={k} label={false} size="sm" lang={lang} />
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="follow-row reveal">
            <FollowCard lang={lang} />
          </div>
        </div>
      </section>

      <PlateEdge from="var(--paper-2)" to="var(--paper)" mode="fingers" seed={34} />

      {/* ───────── Pl. V · Call for speakers ───────── */}
      <section className="sec" aria-labelledby="pl5">
        <div className="wrap">
          <PlateHead lang={lang} no="V" id="pl5" title={zh ? "徵求新講者" : "Call for Speakers"} en={zh ? "Call for Speakers" : undefined} side="Desiderata" />
          <div className="call-spread">
            <div className="reveal">
              {zh ? (
                <>
                  <p className="call-big">你身上，是不是也貼著好幾張標籤？</p>
                  <p className="lead">
                    我們在找跨領域、且與永續或自然有實質連結的講者：同時活在好幾個世界裡（在實驗室與田野之間、在診間與政策之間、在臺灣與另一個國家之間），而工作真正碰觸到土地、生態或永續轉型的人。如果你的工作本身就是一道邊界，我們想邀請你成為下一冊的講者。
                  </p>
                </>
              ) : (
                <>
                  <p className="call-big">Do you, too, carry more than one label?</p>
                  <p className="lead">
                    We are looking for speakers who are interdisciplinary and have a real connection to sustainability or nature: people who live in several worlds at once (between the lab and the field, the clinic and policy, Taiwan and another country) and whose work genuinely touches the land, ecosystems or the transition to sustainability. If your work is itself a border, we would like to invite you to speak in the next volume.
                  </p>
                </>
              )}
              <div className="actions">
                <CallLink lang={lang} />
                <SpeakerFormButton variant="light" lang={lang} />
              </div>
            </div>
            <div className="reveal">
              <BlankLabel lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Voices teaser + collectors ───────── */}
      <section className="sec sec--folio sec--tight-top" aria-labelledby="voices-teaser">
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <p className="catno mono">
                <span>{zh ? "Atlas · 多元聲音" : "Atlas · Diverse Voices"}</span>
              </p>
              <h2 id="voices-teaser" className="h-sec">
                {zh ? (
                  <>
                    越過每一種邊界的願望，
                    <br />
                    也是一種授粉。
                  </>
                ) : (
                  <>
                    Hopes that cross every kind of border
                    <br />
                    are a kind of pollination, too.
                  </>
                )}
              </h2>
              <p className="muted">
                {zh
                  ? "高中生與退休教師、漁民與律師、部落與城市：我們請不同年齡、性別、族群、學歷、職業與地方的人，各錄一段短片，說出自己希望跨領域永續成為什麼、做到什麼、改變什麼。不同人生的期待放在一起，本身就是一種跨領域。"
                  : "High school students and retired teachers, fishers and lawyers, Indigenous villages and cities: we ask people of different ages, genders, ethnicities, schooling, occupations and places to each record a short film about what they hope interdisciplinary sustainability can become, do or change. Put side by side, the hopes of different lives are interdisciplinary in themselves."}
              </p>
              <Link className="txtlink" href={href("/voices")}>
                {zh ? (
                  <>
                    打開地圖集 <i>Open the Atlas</i>
                  </>
                ) : (
                  "Open the Atlas"
                )}{" "}
                <span aria-hidden="true">☞</span>
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
        </div>
      </section>

      <PlateEdge from="var(--paper-2)" to="var(--paper)" mode="fingers" seed={55} />

      {/* ───────── Co-organizers: the three who run the forum ───────── */}
      <section className="sec sec--tight" aria-labelledby="co-org">
        <div className="wrap reveal">
          <CoOrganizers lang={lang} id="co-org" />
        </div>
      </section>
    </>
  );
}
