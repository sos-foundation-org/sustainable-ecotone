import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlateHead } from "@/components/Typography";
import WaterlineHeading from "@/components/WaterlineHeading";
import { PlateEdge, MareyDivider } from "@/components/Dividers";
import { ProgrammeToc, VolumeEmblem } from "@/components/Volume";
import CrossingAtlas from "@/components/CrossingAtlas";
import NextCrossing from "@/components/NextCrossing";
import SpecimenSheet from "@/components/Specimen";
import { CallLink } from "@/components/SpeakerCall";
import Rich from "@/components/Rich";
import FollowCard from "@/components/Follow";
import { EVENT_PLATES } from "@/components/plates";
import { EVENTS, eventBySlug } from "@/content/events";
import { catalogNo, speakerById } from "@/content/speakers";
import { DISCIPLINES } from "@/content/disciplines";
import { DESIDERATA } from "@/content/crossings";
import { pad2, roman } from "@/lib/engrave";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = eventBySlug((await params).slug);
  if (!e) return {};
  const desc = `Ecotone Vol. ${pad2(e.vol)} — ${e.title}「${e.titleZh}」${e.kind}，${e.dateLabel}，${e.venueNote}。`;
  return {
    title: `${e.title} ${e.dateShort}`,
    description: desc,
    openGraph: { title: `${e.title}｜Ecotone Vol. ${pad2(e.vol)}`, description: desc },
  };
}

export default async function EventPage({ params }: Props) {
  const e = eventBySlug((await params).slug);
  if (!e) notFound();
  const lineup = e.speakers.map(speakerById).filter((s) => s !== undefined);
  const vol = `Vol. ${pad2(e.vol)}`;
  const covered = new Set(lineup.flatMap((s) => s.disciplines));
  const identityCount = lineup.reduce((n, s) => n + s.identities.length, 0);
  const desiderata = [...DESIDERATA].sort((x, y) => Number(covered.has(x.a)) + Number(covered.has(x.b)) - (Number(covered.has(y.a)) + Number(covered.has(y.b))));
  const places = new Set(lineup.flatMap((s) => s.places.map((p) => p.name)));
  const Plate = e.plate ? EVENT_PLATES[e.plate] : null;

  return (
    <>
      {/* Title page (+ the volume's engraved plate) */}
      <section className={`title-hero${Plate ? " title-hero--plate" : ""}`} aria-labelledby="ev-title">
        <div className="wrap title-hero-grid">
          <div className="title-hero-inner">
            <VolumeEmblem e={e} size={112} />
            <p className="mono vol-line">
              Ecotone｜兼容並續 · Volume {roman(e.vol)} · {e.kind}
            </p>
            <WaterlineHeading id="ev-title" align={Plate ? "start" : "center"} contained={Boolean(Plate)} en={e.titleZh}>
              <span lang="en" className="ev-en">
                {e.title}
              </span>
            </WaterlineHeading>
            <div className="lead">
              {e.intro.map((p) => (
                <Rich key={p} as="p" html={p} />
              ))}
            </div>
            <p className="attendance mono" role="note">
              <span className="cin">Attendance · 參加方式</span> {e.attendance}
            </p>
            <div className="actions">
              <a className="btn btn--ink" href="#speakers">
                本冊講者 <small>{lineup.length} SPEAKERS</small>
                <span className="mani" aria-hidden="true">
                  ☞
                </span>
              </a>
              <a className="txtlink" href="#contents">
                目次 <i>Contents</i>
              </a>
            </div>
          </div>
          {Plate && <Plate plateNo={roman(e.vol)} />}
        </div>
      </section>

      {/* Specimen label: facts */}
      <section className="sec sec--tight" aria-labelledby="facts">
        <div className="wrap">
          <h2 id="facts" className="sr-only">
            活動資訊
          </h2>
          <dl className="label-card label-card--wide reveal">
            <div>
              <dt>Date · 日期</dt>
              <dd>
                {e.dateLabel}
                <span className="muted">{e.dateNote}</span>
              </dd>
            </div>
            <div>
              <dt>Loc. · 地點</dt>
              <dd>
                {e.venue}
                <span className="muted">{e.venueNote}</span>
              </dd>
            </div>
            <div>
              <dt>Format · 形式</dt>
              <dd>
                {e.format}
                <span className="muted">{e.formatNote}</span>
              </dd>
            </div>
            <div>
              <dt>Lang. · 語言</dt>
              <dd>
                {e.language}
                <span className="muted">{e.languageNote}</span>
              </dd>
            </div>
          </dl>
          <div className="follow-row reveal">
            <FollowCard note={`${e.title} 的確切日期與地點尚未公布。留下你的 e-mail，資訊確定時我們會第一時間通知你；之後的每一冊，也不會錯過。`} />
          </div>
        </div>
      </section>

      {e.premise && (
        <section className="sec sec--tight" aria-labelledby="premise">
          <div className="wrap spread">
            <div className="reveal">
              <p className="catno mono">
                <span>{vol} · Premise</span>
              </p>
              <h2 id="premise" className="h-sec">
                {e.premise.title}
              </h2>
            </div>
            <div className="gutter" aria-hidden="true" />
            <div className="reveal prose">
              {e.premise.body.map((p) => (
                <Rich key={p} as="p" html={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <PlateEdge from="var(--paper)" to="var(--cyan)" mode="lace" seed={e.vol * 13} label={`ECOTONE · ${vol}`} />

      {/* Crossings of this volume */}
      <section className="sec sec--cyan" aria-labelledby="ev-crossings">
        <div className="wrap">
          <PlateHead
            no={roman(e.vol)}
            id="ev-crossings"
            title="本冊的交會"
            en="Crossings of this Volume"
            side={`${lineup.length} speakers · ${identityCount} identities · ${covered.size} fields · ${places.size} places`}
          />
          <div className="atlas-grid">
            <div className="reveal">
              <CrossingAtlas
                idPrefix="ev-atlas"
                speakers={lineup.map((s) => ({ id: s.id, name: s.name, disciplines: s.disciplines, places: s.places }))}
                disciplines={DISCIPLINES}
                caption={`${vol} 觸及 ${covered.size} / ${DISCIPLINES.length} 個學科、${places.size} 個地方。學科標註待講者確認。`}
              />
            </div>
            <div className="reveal">
              <NextCrossing items={desiderata} disciplines={DISCIPLINES} />
            </div>
          </div>
        </div>
      </section>

      <PlateEdge from="var(--cyan)" to="var(--paper)" mode="lace" seed={e.vol * 17} />

      {/* Specimens: the speakers of this volume */}
      <section className="sec" id="speakers" aria-labelledby="lineup">
        <div className="wrap">
          <PlateHead no="§" label="Speakers" id="lineup" title="本冊講者" en="Speakers with many identities" side={`${lineup.length} speakers · ${identityCount} identities`} />
          <p className="lead plate-intro reveal">
            我們的講者，每一位都有好幾種身份 — 一個人，橫跨好幾個領域；地上的每一朵菇，都長在同一個菌絲體上。
          </p>
          <nav className="jump reveal" aria-label="本冊講者快速導覽">
            <ol>
              {lineup.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span className="mono">{catalogNo(s)}</span> {s.name}
                    <span className="lbls" aria-label={`${s.identities.length} 種身份`}>
                      {s.identities.map((id) => (
                        <span key={id.title} />
                      ))}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="sheets">
            {lineup.map((s) => (
              <div key={s.id} className="reveal">
                <SpecimenSheet s={s} full headingLevel={3} vol={`${vol} · ${e.title}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <MareyDivider caption={false} />

      {/* Programme as table of contents */}
      <section className="sec" id="contents" aria-labelledby="toc-h">
        <div className="wrap spread">
          <div className="reveal">
            <p className="catno mono">
              <span>{vol} · Contents</span>
            </p>
            <h2 id="toc-h" className="h-sec">
              目次 <i>Programme</i>
            </h2>
            <p className="muted">流程為暫定版本，正式時間將於日期確認後公布。</p>
          </div>
          <div className="gutter" aria-hidden="true" />
          <div className="reveal">
            <ProgrammeToc e={e} />
          </div>
        </div>
      </section>

      {/* Voices teaser */}
      <section className="sec sec--tight sec--folio" aria-labelledby="ev-voices">
        <div className="wrap split">
          <div className="reveal">
            <p className="catno mono">
              <span>Atlas · Voices from Abroad</span>
            </p>
            <h2 id="ev-voices" className="h-sec">
              來自海外的聲音
            </h2>
          </div>
          <div className="reveal">
            <p className="lead">永續從來不是一個國家的事。我們邀請海外的研究者、設計師與實踐者錄製短片回應本冊主題，在現場播放，也收錄在地圖集裡。</p>
            <Link className="txtlink" href="/voices">
              打開地圖集 <i>Open the Atlas</i> <span aria-hidden="true">☞</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-band" aria-labelledby="ev-cta">
        <div className="wrap cta-row">
          <h2 id="ev-cta">
            下一冊的講者，也許是你。
            <br />
            <span className="muted">我們正在徵集同時活在好幾個學科、好幾個國家裡的講者。</span>
          </h2>
          <CallLink />
        </div>
      </section>
    </>
  );
}
