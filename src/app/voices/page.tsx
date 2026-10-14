import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import VideoCard from "@/components/VideoCard";
import SectionHead from "@/components/SectionHead";
import { VOICES } from "@/content/voices";

export const metadata: Metadata = {
  title: "海外聲音",
  description: "Voices from Abroad — 海外研究者、設計師與實踐者，以短片回應 Ecotone 論壇的主題。",
};

export default function VoicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Voices from Abroad · 海外聲音"
        title={
          <>
            永續沒有國界，
            <br />
            花粉也是<em>跨海</em>傳的。
          </>
        }
        lead={
          <>
            我們邀請散布在世界各地的研究者、設計師與實踐者，各自錄一段短片，回應一個問題。這些 <span className="en">voices</span>{" "}
            會在論壇現場播放，也會長期收錄在這裡。
          </>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Vol. 01 · Cross-Pollination" title="影像牆" />
          <div className="video-grid">
            {VOICES.map((v) => (
              <VideoCard key={v.id} v={v} />
            ))}
          </div>
          <p className="draft-note" style={{ marginTop: "2rem" }}>
            ＊影片陸續上線中；名單與題目為暫定。
          </p>
        </div>
      </section>

      <section className="section--tight section--paper2">
        <div className="container cta-band">
          <h2>
            你也在海外做永續？想錄一段 <span className="en">voice</span> 給臺灣的聽眾？
          </h2>
          <Link className="btn btn--dark" href="/contact">
            與我們聯絡 <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
