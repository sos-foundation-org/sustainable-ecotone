"use client";

import { useState } from "react";

const RULES = [
  { t: "不事先曝光", d: "連主辦單位與其他講者都不會提前看到。" },
  { t: "現場翻開", d: "在演講的最後一刻才揭曉，一人只有一張。" },
  { t: "跨界接招", d: "由另一位不同領域的講者，在 90 秒內即時回應。" },
  { t: "花粉落地", d: "所有 Secret Slide 會在活動後整理公開，成為下一場論壇的起點。" },
];

export default function SecretSlide() {
  const [revealed, setRevealed] = useState(false);
  return (
    <section className="section secret" id="secret-slide">
      <div className="container">
        <div className="secret-stage">
          <div className="reveal">
            <div className="eyebrow">The Highlight</div>
            <h2 className="h-section">
              <span className="en">Secret Slide</span>
              <br />
              每位講者，都藏了一張。
            </h2>
            <p className="lead">
              每位講者除了自己的演講，還會準備一張 <span className="en">Secret Slide</span>{" "}
              — 一張「不屬於自己學科」的投影片。它可能是一個自己領域永遠回答不了的問題、一個從別的學科偷來的概念，或是一個從沒在正式場合說過的想法。
            </p>
            <ul className="secret-rules">
              {RULES.map((r) => (
                <li key={r.t}>
                  <div>
                    <strong>{r.t}</strong>
                    {r.d}
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn btn--gold reveal-btn" type="button" aria-pressed={revealed} onClick={() => setRevealed((v) => !v)}>
              {revealed ? "蓋回去" : "翻開 Secret Slide"} <span className="arrow">↻</span>
            </button>
          </div>
          <div className={`slide-deck reveal${revealed ? " is-revealed" : ""}`} aria-live="polite">
            <div className="slide" aria-hidden="true">
              <span className="s-label">SLIDE 12 / 14</span>
              <div className="s-lines">
                <span style={{ width: "80%" }} />
                <span style={{ width: "60%" }} />
              </div>
            </div>
            <div className="slide" aria-hidden="true">
              <span className="s-label">SLIDE 13 / 14</span>
              <div className="s-lines">
                <span style={{ width: "70%" }} />
                <span style={{ width: "85%" }} />
              </div>
            </div>
            <div className="slide slide--cover" aria-hidden={revealed}>
              <span className="s-label">SLIDE 14 / 14 · SECRET</span>
              <div className="s-title">這一張，我們還沒看過</div>
              <div className="s-lines">
                <span style={{ width: "65%" }} />
                <span style={{ width: "40%" }} />
              </div>
            </div>
            <div className="slide slide--secret" aria-hidden={!revealed}>
              <span className="s-label">SECRET SLIDE · REVEALED</span>
              <div className="s-title">如果答案在別人的學科裡呢？</div>
              <div style={{ fontSize: ".85rem" }}>
                11 月，現場揭曉。<span className="en">See you there.</span>
              </div>
            </div>
          </div>
        </div>
        <p className="draft-note" style={{ marginTop: "3rem" }}>
          ＊Secret Slide 規則為概念草案，細節將與講者確認後定案。
        </p>
      </div>
    </section>
  );
}
