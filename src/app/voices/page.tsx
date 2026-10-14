import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/Typography";
import { PlateEdge } from "@/components/Dividers";
import WhaleSea from "@/components/WhaleSea";
import VideoCard, { TaipeiClock } from "@/components/VideoCard";
import { VOICES } from "@/content/voices";

export const metadata: Metadata = {
  title: "海外聲音",
  description: "Voices from Abroad — 海外研究者、設計師與實踐者以短片回應 Ecotone 論壇的主題。鯨的歌聲能穿越整個海盆，有些想法也是。",
};

export default function VoicesPage() {
  return (
    <>
      <PageTitle
        catalog={["Atlas · 海外聲音", "Voices from Abroad", `${VOICES.length} voices`]}
        waterline
        en="Whale song crosses whole ocean basins. So can ideas."
        title={
          <>
            永續沒有國界，
            <br />
            花粉也是跨海傳的。
          </>
        }
        lead={
          <p>
            這張網不止於陸地。來自新加坡、波士頓、歐洲與拉丁美洲的聲音，沿著同一條歌聲線（<i>song line</i>）傳到臺北。每一則短片，都在回答一個別的學科丟給他們的問題 — 會在論壇現場播放，也長期收錄在這裡。
          </p>
        }
      />

      <WhaleSea note={<p className="sea-note">† 影片陸續上線中；名單、地點與題目為暫定。</p>}>
        <p className="sea-tpe mono">
          <span>Taipei · 臺北</span>
          <TaipeiClock />
          <span>所有時區，同一張網</span>
        </p>
        <div className="sea-ports">
          {VOICES.map((v, i) => (
            <VideoCard key={v.id} v={v} sheet={i + 1} />
          ))}
        </div>
      </WhaleSea>

      <PlateEdge from="var(--abyss)" to="var(--paper)" mode="lace" seed={233} />

      <section className="cta-band" aria-labelledby="v-cta">
        <div className="wrap cta-row">
          <h2 id="v-cta">
            你也在海外做永續？
            <br />
            <span className="muted">
              錄一段 <i>voice</i> 給臺灣的聽眾。
            </span>
          </h2>
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
