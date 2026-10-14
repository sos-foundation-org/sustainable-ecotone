import Link from "next/link";
import { PageTitle } from "@/components/Typography";
import { VolumeEmblem } from "@/components/Volume";
import Rich from "@/components/Rich";
import FollowCard from "@/components/Follow";
import { EVENTS } from "@/content/events";
import { pad2, roman } from "@/lib/engrave";
import { localePath, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";

export function eventsMetadata(lang: Lang) {
  return pageMetadata({
    lang,
    path: "/events",
    ...(lang === "zh"
      ? { title: "活動", description: "Ecotone 兼容並續的所有活動：每一場論壇是圖譜裡的一張新圖版，定期舉辦，逐冊累積。" }
      : { title: "Events", description: "Every Ecotone event: each forum is a new plate in the atlas, held regularly and collected volume by volume." }),
  });
}

export default function EventsPage({ lang }: { lang: Lang }) {
  const zh = lang === "zh";
  const href = (p: string) => localePath(lang, p);
  const sorted = [...EVENTS].sort((a, b) => b.vol - a.vol);
  const nextVol = Math.max(...EVENTS.map((e) => e.vol)) + 1;
  const volumes = `${EVENTS.length} volume${EVENTS.length > 1 ? "s" : ""}`;

  return (
    <>
      <PageTitle
        catalog={[zh ? "Plates · 活動" : "Plates · Events", volumes, "ECO-001"]}
        title={
          zh ? (
            <>
              一冊一冊，
              <br />
              讓交界處長出新東西。
            </>
          ) : (
            <>
              Volume by volume,
              <br />
              new growth at the edges.
            </>
          )
        }
        lead={
          zh ? (
            <p>
              Ecotone 會定期舉辦系列演講、工作坊與跨域對談。每一場都是圖譜裡的一張新圖版 <i>plate</i>：主題與講者組合各不相同，但都抱著同一個 <i>mindset</i>：把不同學科放在一起，看會發生什麼。
            </p>
          ) : (
            <p>
              Ecotone regularly hosts lecture series, workshops and cross-disciplinary conversations. Each is a new <i>plate</i> in the atlas. The themes and line-ups change, but the idea stays the same: put different disciplines side by side and see what happens.
            </p>
          )
        }
      />

      <section className="sec sec--tight" aria-labelledby="plates-index">
        <div className="wrap">
          <h2 id="plates-index" className="mono colo-h">
            {zh ? "Index of Plates · 圖版目錄" : "Index of Plates"}
          </h2>
          <ol className="plates-index">
            {sorted.map((e) => (
              <li key={e.slug} className="reveal">
                <Link href={href(`/events/${e.slug}`)} className="plate-row">
                  <VolumeEmblem e={e} size={96} />
                  <span className="plate-row-no">
                    <small className="mono">Pl.</small>
                    {roman(e.vol)}
                  </span>
                  <span className="plate-row-main">
                    <span className="mono cin">{e.statusLabel[lang]}</span>
                    <span className="plate-row-title">
                      <span lang="en">{e.title}</span> <small>{e.subtitle[lang]}</small>
                    </span>
                    <Rich as="span" className="muted" html={e.summary[lang]} />
                  </span>
                  <span className="plate-row-date">
                    <b className="mono">{e.dateShort}</b>
                    <span className="muted small">
                      {e.kind[lang]} · {e.venueNote[lang]}
                    </span>
                    <span className="mani" aria-hidden="true">
                      ☞
                    </span>
                  </span>
                </Link>
              </li>
            ))}
            <li className="reveal">
              <div className="plate-row plate-row--next">
                <span className="emblem-blank" aria-hidden="true" />
                <span className="plate-row-no">
                  <small className="mono">Pl.</small>
                  {roman(nextVol)}
                </span>
                <span className="plate-row-main">
                  <span className="mono">
                    Vol. {pad2(nextVol)} · {zh ? "籌備中 In preparation" : "In preparation"}
                  </span>
                  <span className="plate-row-title">{zh ? "下一張圖版，還是空白的。" : "The next plate is still blank."}</span>
                  <span className="muted">{zh ? "我們正在徵集下一冊的講者。下一位，也許就是你。" : "We are looking for speakers for the next volume. The next one could be you."}</span>
                </span>
                <span className="plate-row-date">
                  <Link className="txtlink" href={href("/call-for-speakers")}>
                    {zh ? (
                      <>
                        成為講者 <i>Call for Speakers</i>
                      </>
                    ) : (
                      "Call for Speakers"
                    )}
                  </Link>
                </span>
              </div>
            </li>
          </ol>
          <div className="follow-row reveal">
            <FollowCard
              lang={lang}
              note={
                zh
                  ? "下一冊還在籌備中。留下你的 e-mail，新的一冊公布時（主題、日期、地點與講者），我們會第一時間通知你。"
                  : "The next volume is still in preparation. Leave your email and we will tell you as soon as it is announced: theme, date, venue and speakers."
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}
