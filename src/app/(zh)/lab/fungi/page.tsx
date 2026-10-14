import type { Metadata } from "next";
import { drawing, Fungus } from "@/components/fungi/library";
import { FUNGI } from "@/content/fungi";

// Internal gallery of the fungi library. Not linked, not in the sitemap, not indexed.
export const metadata: Metadata = {
  title: "Fungi library · 菌類圖庫（內部）",
  robots: { index: false, follow: false },
};

export default function FungiLab() {
  return (
    <section className="sec">
      <div className="wrap">
        <p className="catno mono">
          <span>Lab · 內部頁面</span>
          <span>Fungi library</span>
          <span>{FUNGI.length} species</span>
        </p>
        <h1 className="pt-h1">菌類圖庫 <i>Fungi library</i></h1>
        <p className="lead">
          首頁與講者頁的菇，都從這裡取用。每一種都站在自己的基點上（土線），可任意縮放。<i>Every species stands on its own base point, so it sits on any soil line.</i>
        </p>
        <ul className="fungi-lab">
          {FUNGI.map((f) => {
            const d = drawing(f.id);
            const H = 110;
            const s = H / 100;
            const w = Math.max(70, d.w * s + 24);
            return (
              <li key={f.id}>
                <svg viewBox={`${-w / 2} ${-124} ${w} 136`} aria-hidden="true">
                  <line x1={-w / 2} y1="0.5" x2={w / 2} y2="0.5" stroke="var(--ink)" strokeWidth=".6" />
                  <Fungus species={f.id} height={d.h * s} color="#1C1A17" />
                </svg>
                <b>{f.name.zh}</b>
                <span className="fungi-en">{f.name.en}</span>
                <i>{f.latin}</i>
                <span className="mono">
                  {f.id} · {Math.round(d.w)}×{Math.round(d.h)}
                </span>
                <span className="fungi-form">
                  {f.form.zh} · {f.form.en}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
