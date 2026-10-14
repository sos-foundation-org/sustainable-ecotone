import type { Metadata } from "next";
import Link from "next/link";
import WaterlineHeading from "@/components/WaterlineHeading";

export const metadata: Metadata = { title: "找不到頁面" };

export default function NotFound() {
  return (
    <section className="title-hero notfound" aria-labelledby="nf-title">
      <div className="wrap title-hero-inner">
        <svg className="nf-art" viewBox="0 0 320 120" aria-hidden="true">
          <path d="M0 78C40 74 80 82 120 78S200 74 240 78 300 82 320 78" fill="none" stroke="#A8321F" strokeWidth="1" strokeDasharray="5 3" />
          <use href="#mudskipper" x="110" y="40" width="100" height="40" color="#1C1A17" />
          <path d="M0 96h320M0 104h320M20 112h280" stroke="#1C1A17" strokeWidth=".4" opacity=".5" />
        </svg>
        <p className="mono vol-line">404 · Terra incognita</p>
        <WaterlineHeading id="nf-title" align="center" en="This page is still terra incognita.">
          你越過了一條
          <br />
          還不存在的邊界。
        </WaterlineHeading>
        <p className="lead centered">
          這一頁還沒有被採集。就像彈塗魚 — 一隻會走上陸地的魚 — 有時候越界，才會發現新的地方。
        </p>
        <div className="actions centered">
          <Link className="btn btn--ink" href="/">
            回到首頁 <small>FRONTISPIECE</small>
            <span className="mani" aria-hidden="true">
              ☞
            </span>
          </Link>
          <Link className="txtlink" href="/events">
            圖版目錄 <i>Plates</i>
          </Link>
        </div>
      </div>
    </section>
  );
}
