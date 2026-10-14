import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/Typography";
import { VolumeEmblem } from "@/components/Volume";
import Rich from "@/components/Rich";
import FollowCard from "@/components/Follow";
import { EVENTS } from "@/content/events";
import { pad2, roman } from "@/lib/engrave";

export const metadata: Metadata = {
  title: "活動",
  description: "Ecotone 兼容並續的所有活動：每一場論壇是圖譜裡的一張新圖版，定期舉辦，逐冊累積。",
};

export default function EventsPage() {
  const sorted = [...EVENTS].sort((a, b) => b.vol - a.vol);
  const nextVol = Math.max(...EVENTS.map((e) => e.vol)) + 1;

  return (
    <>
      <PageTitle
        catalog={["Plates · 活動", `${EVENTS.length} volume${EVENTS.length > 1 ? "s" : ""}`, "ECO-001"]}
        title={
          <>
            一冊一冊，
            <br />
            讓交界處長出新東西。
          </>
        }
        lead={
          <p>
            Ecotone 會定期舉辦系列演講、工作坊與跨域對談。每一場都是圖譜裡的一張新圖版 <i>plate</i>：主題與講者組合各不相同，但都抱著同一個 <i>mindset</i> — 把不同學科放在一起，看會發生什麼。
          </p>
        }
      />

      <section className="sec sec--tight" aria-labelledby="plates-index">
        <div className="wrap">
          <h2 id="plates-index" className="mono colo-h">
            Index of Plates · 圖版目錄
          </h2>
          <ol className="plates-index">
            {sorted.map((e) => (
              <li key={e.slug} className="reveal">
                <Link href={`/events/${e.slug}`} className="plate-row">
                  <VolumeEmblem e={e} size={96} />
                  <span className="plate-row-no">
                    <small className="mono">Pl.</small>
                    {roman(e.vol)}
                  </span>
                  <span className="plate-row-main">
                    <span className="mono cin">
                      Vol. {pad2(e.vol)} · {e.statusLabel}
                    </span>
                    <span className="plate-row-title">
                      <span lang="en">{e.title}</span> <small>{e.titleZh}</small>
                    </span>
                    <Rich as="span" className="muted" html={e.summary} />
                  </span>
                  <span className="plate-row-date">
                    <b className="mono">{e.dateShort}</b>
                    <span className="muted small">
                      {e.kind} · {e.venueNote}
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
                  <span className="mono">Vol. {pad2(nextVol)} · 籌備中 In preparation</span>
                  <span className="plate-row-title">下一張圖版，還是空白的。</span>
                  <span className="muted">我們正在徵集下一冊的講者 — 下一位講者，也許就是你。</span>
                </span>
                <span className="plate-row-date">
                  <Link className="txtlink" href="/call-for-speakers">
                    成為講者 <i>Call for Speakers</i>
                  </Link>
                </span>
              </div>
            </li>
          </ol>
          <div className="follow-row reveal">
            <FollowCard note="下一冊還在籌備中。留下你的 e-mail，新的一冊公布時（主題、日期、地點與講者），我們會第一時間通知你。" />
          </div>
        </div>
      </section>
    </>
  );
}
