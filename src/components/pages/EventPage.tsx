import Link from "next/link";
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
import type { ForumEvent } from "@/content/events";
import { catalogNo, speakerById } from "@/content/speakers";
import { DISCIPLINES } from "@/content/disciplines";
import { DESIDERATA } from "@/content/crossings";
import { pad2, roman } from "@/lib/engrave";
import { localePath, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";

export function eventMetadata(lang: Lang, e: ForumEvent) {
  const vol = `Vol. ${pad2(e.vol)}`;
  const description =
    lang === "zh"
      ? `Ecotone ${vol}：${e.title}「${e.subtitle.zh}」${e.kind.zh}，${e.dateLabel.zh}，${e.venueNote.zh}。`
      : `Ecotone ${vol}: ${e.title}, ${e.subtitle.en.charAt(0).toLowerCase()}${e.subtitle.en.slice(1)}. ${e.kind.en}, ${e.dateLabel.en}, ${e.venueNote.en}.`;
  return pageMetadata({
    lang,
    path: `/events/${e.slug}`,
    title: `${e.title} ${e.dateShort}`,
    ogTitle: lang === "zh" ? `${e.title}｜Ecotone ${vol}` : `${e.title} · Ecotone ${vol}`,
    description,
  });
}

export default function EventPage({ lang, e }: { lang: Lang; e: ForumEvent }) {
  const zh = lang === "zh";
  const href = (p: string) => localePath(lang, p);
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
            <p className="mono vol-line">{zh ? `Ecotone｜兼容並續 · Volume ${roman(e.vol)} · ${e.kind.zh}` : `Ecotone · Volume ${roman(e.vol)} · ${e.kind.en}`}</p>
            <WaterlineHeading id="ev-title" align={Plate ? "start" : "center"} contained={Boolean(Plate)} en={e.subtitle[lang]}>
              <span lang={zh ? "en" : undefined} className="ev-en">
                {e.title}
              </span>
            </WaterlineHeading>
            <div className="lead">
              {e.intro[lang].map((p) => (
                <Rich key={p} as="p" html={p} />
              ))}
            </div>
            <p className="attendance mono" role="note">
              <span className="cin">{zh ? "Attendance · 參加方式" : "Attendance"}</span> {e.attendance[lang]}
            </p>
            <div className="actions">
              <a className="btn btn--ink" href="#speakers">
                {zh ? "本冊講者" : "Meet the speakers"} <small>{lineup.length} SPEAKERS</small>
                <span className="mani" aria-hidden="true">
                  ☞
                </span>
              </a>
              <a className="txtlink" href="#contents">
                {zh ? (
                  <>
                    目次 <i>Contents</i>
                  </>
                ) : (
                  "Contents"
                )}
              </a>
            </div>
          </div>
          {Plate && <Plate plateNo={roman(e.vol)} lang={lang} />}
        </div>
      </section>

      {/* The volume's label: facts */}
      <section className="sec sec--tight" aria-labelledby="facts">
        <div className="wrap">
          <h2 id="facts" className="sr-only">
            {zh ? "活動資訊" : "Event details"}
          </h2>
          <dl className="label-card label-card--wide reveal">
            <div>
              <dt>{zh ? "Date · 日期" : "Date"}</dt>
              <dd>
                {e.dateLabel[lang]}
                <span className="muted">{e.dateNote[lang]}</span>
              </dd>
            </div>
            <div>
              <dt>{zh ? "Loc. · 地點" : "Venue"}</dt>
              <dd>
                {e.venue[lang]}
                <span className="muted">{e.venueNote[lang]}</span>
              </dd>
            </div>
            <div>
              <dt>{zh ? "Format · 形式" : "Format"}</dt>
              <dd>
                {e.format[lang]}
                <span className="muted">{e.formatNote[lang]}</span>
              </dd>
            </div>
            <div>
              <dt>{zh ? "Lang. · 語言" : "Language"}</dt>
              <dd>
                {e.language[lang]}
                <span className="muted">{e.languageNote[lang]}</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <PlateEdge from="var(--paper)" to="var(--cyan)" mode="lace" seed={e.vol * 13} label={`ECOTONE · ${vol}`} />

      {/* Crossings of this volume */}
      <section className="sec sec--cyan" aria-labelledby="ev-crossings">
        <div className="wrap">
          <PlateHead
            lang={lang}
            no={roman(e.vol)}
            id="ev-crossings"
            title={zh ? "本冊的交會" : "Crossings in this volume"}
            en={zh ? "Crossings of this Volume" : undefined}
            side={`${lineup.length} speakers · ${identityCount} identities · ${covered.size} fields · ${places.size} places`}
          />
          <div className="atlas-grid">
            <div className="reveal">
              <CrossingAtlas
                lang={lang}
                idPrefix="ev-atlas"
                speakers={lineup.map((s) => ({ id: s.id, name: s.name[lang], photo: s.photo, initial: s.initial[lang], disciplines: s.disciplines, places: s.places }))}
                disciplines={DISCIPLINES}
                caption={
                  zh
                    ? `${vol} 觸及 ${covered.size} / ${DISCIPLINES.length} 個學科、${places.size} 個地方。學科標註待講者確認。`
                    : `${vol} touches ${covered.size} of ${DISCIPLINES.length} fields and ${places.size} places. Discipline tags are pending the speakers’ confirmation.`
                }
              />
            </div>
            <div className="reveal">
              <NextCrossing items={desiderata} disciplines={DISCIPLINES} lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <PlateEdge from="var(--cyan)" to="var(--paper)" mode="lace" seed={e.vol * 17} />

      {/* Programme as table of contents */}
      <section className="sec" id="contents" aria-labelledby="toc-h">
        <div className="wrap spread">
          <div className="reveal">
            <p className="catno mono">
              <span>{vol} · Contents</span>
            </p>
            <h2 id="toc-h" className="h-sec">
              {zh ? (
                <>
                  目次 <i>Programme</i>
                </>
              ) : (
                "Programme"
              )}
            </h2>
            <p className="muted">{zh ? "流程為暫定版本，正式時間將於日期確認後公布。" : "The running order is provisional. Final times will be published once the date is confirmed."}</p>
          </div>
          <div className="gutter" aria-hidden="true" />
          <div className="reveal">
            <ProgrammeToc e={e} lang={lang} />
          </div>
        </div>
      </section>

      {/* The speakers of this volume, each on a herbarium-style sheet */}
      <section className="sec" id="speakers" aria-labelledby="lineup">
        <div className="wrap">
          <PlateHead
            lang={lang}
            no="§"
            label="Speakers"
            id="lineup"
            title={zh ? "本冊講者" : "Speakers in this volume"}
            en={zh ? "Speakers with many identities" : "Each with many identities"}
            side={`${lineup.length} speakers · ${identityCount} identities`}
          />
          <p className="lead plate-intro reveal">
            {zh
              ? "我們的講者，每一位都有好幾種身份。一個人橫跨好幾個領域，就像地上的每一朵菇，都長在同一個菌絲體上。"
              : "Every one of our speakers has several identities. One person spanning several fields is like the mushrooms above ground: each one fruits from the same mycelium."}
          </p>
          <nav className="jump reveal" aria-label={zh ? "本冊講者快速導覽" : "Jump to a speaker"}>
            <ol>
              {lineup.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span className="mono">{catalogNo(s)}</span> {s.name[lang]}
                    <span className="lbls" aria-label={zh ? `${s.identities.length} 種身份` : `${s.identities.length} identit${s.identities.length === 1 ? "y" : "ies"}`}>
                      {s.identities.map((id) => (
                        <span key={id.title.zh} />
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
                <SpecimenSheet s={s} full headingLevel={3} vol={`${vol} · ${e.title}`} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <MareyDivider caption={false} lang={lang} />

      {/* Voices teaser */}
      <section className="sec sec--tight sec--folio" aria-labelledby="ev-voices">
        <div className="wrap split">
          <div className="reveal">
            <p className="catno mono">
              <span>Atlas · Diverse Voices</span>
            </p>
            <h2 id="ev-voices" className="h-sec">
              {zh ? "多元聲音" : "Diverse Voices"}
            </h2>
          </div>
          <div className="reveal">
            <p className="lead">
              {zh
                ? "永續從來不只是某一群人的事。我們邀請不同年齡、性別、族群、學歷與職業的人，從臺灣各地到世界各處，錄製短片回應本冊主題，在現場播放，也收錄在地圖集裡。"
                : "Sustainability has never belonged to one group of people alone. We invite people of different ages, genders, ethnicities, schooling and occupations, from all over Taiwan and around the world, to record short films responding to this volume’s theme. They are screened at the forum and collected in the Atlas."}
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
        </div>
      </section>

      {/* Semina: follow future volumes, just above the call for speakers */}
      <section className="sec sec--tight" aria-label={zh ? "追蹤未來活動" : "Follow future events"}>
        <div className="wrap">
          <div className="follow-row reveal">
            <FollowCard
              lang={lang}
              note={
                zh
                  ? `${e.title} 的確切日期與地點尚未公布。留下你的 e-mail，資訊確定時我們會第一時間通知你；之後的每一冊，也不會錯過。`
                  : `The exact date and venue for ${e.title} have not been announced yet. Leave your email and we will let you know the moment they are confirmed, and you won’t miss a volume after that.`
              }
            />
          </div>
        </div>
      </section>

      <section className="cta-band" aria-labelledby="ev-cta">
        <div className="wrap cta-row">
          <h2 id="ev-cta">
            {zh ? "下一冊的講者，也許是你。" : "The next volume’s speaker could be you."}
            <br />
            <span className="muted">{zh ? "我們正在徵集同時活在好幾個學科、好幾個國家裡的講者。" : "We are looking for speakers who live across several disciplines and several countries."}</span>
          </h2>
          <CallLink lang={lang} />
        </div>
      </section>
    </>
  );
}
