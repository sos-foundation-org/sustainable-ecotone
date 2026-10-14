import type { ReactNode } from "react";
import { rng } from "@/lib/mycelium";
import { r2 } from "@/lib/engrave";

/**
 * Voices: the horizon becomes a waterline. Above it, dolphins leap the border
 * between water and air; below it a humpback swims the song line that
 * threads every voice's porthole. Whale song crosses whole ocean basins — so
 * do ideas. Decorative art is aria-hidden; the voices themselves are children.
 */
export default function WhaleSea({ children, note }: { children: ReactNode; note?: ReactNode }) {
  const R = rng(5);
  const fish = Array.from({ length: 14 }, () => ({
    x: r2(10 + R() * 120),
    y: r2(8 + R() * 50),
    w: r2(12 + R() * 8),
    h: r2(6 + R() * 3),
    d: r2(-R() * 7),
    o: r2(0.5 + R() * 0.5),
  }));

  return (
    <section className="sea" aria-labelledby="sea-h">
      <svg className="sea-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          {/* humpback, side view, facing left */}
          <symbol id="sea-whale" viewBox="0 0 320 112">
            <g stroke="#8FD3C1" strokeOpacity=".75" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
              <path fill="#122832" d="M8 52C24 36 66 27 118 28C168 29 214 38 252 46C268 49 282 48 292 46C300 44 310 38 317 35C313 42 305 49 296 53C286 57 272 59 256 61C214 70 164 79 112 78C66 77 24 68 8 52Z" />
              <path fill="#122832" d="M196 38.4C202 33 209 31.5 214 33C211 35.5 210.5 37.5 212 40.6" />
              <path fill="#17323C" d="M92 70C102 84 122 97 152 105C155 106 156 104 153 102C138 93 120 81 110 72" />
              <path fill="none" strokeWidth=".55" strokeOpacity=".5" d="M14 56C40 66 70 72 104 74.5M20 59.5C44 67.5 72 71.5 98 73M28 63C50 69 72 71 92 72M10 53.5C26 57 44 58 60 56" />
              <path fill="none" strokeWidth=".5" strokeOpacity=".45" d="M232 45C244 50 254 54 262 56M120 29C150 31 180 35 200 39" />
              <circle cx="52" cy="51" r="1.5" fill="#8FD3C1" stroke="none" />
              <g fill="#8FD3C1" stroke="none" opacity=".55">
                <circle cx="20" cy="45" r=".9" />
                <circle cx="28" cy="40.6" r=".9" />
                <circle cx="37" cy="37.4" r=".9" />
                <circle cx="26" cy="47.5" r=".8" />
                <circle cx="34" cy="43" r=".8" />
              </g>
            </g>
          </symbol>
          {/* bottlenose dolphin, side view, facing right */}
          <symbol id="sea-dolphin" viewBox="0 0 120 48">
            <g fill="#2D3C43" stroke="#1C1A17" strokeWidth=".6" strokeLinejoin="round">
              <path d="M4 26C10 22.5 16 22.5 22 24C40 16 66 12 88 16C96 17.5 102 19.5 106 21C111 21.5 116 22.5 118.5 24C114 25.6 109 26.1 104 26.3C96 31 80 35 60 35C44 35 30 31.5 22 28.4C16 30 10 32 3 32.5C7 30.2 8 28 4 26Z" />
              <path d="M55 15C58 8 63.5 4 70.5 2C67 6.5 66 10.5 68 14.6Z" />
              <path d="M80 31.2C78 36.5 74 40.5 67.5 42.5C71.5 38.5 73.5 34.5 73.6 31.8Z" />
              <path fill="none" stroke="#A9B6B9" strokeWidth=".5" d="M104 26.3C98 24.6 92 25.2 84 28.5C74 32 56 33 40 30.5" />
              <circle cx="99" cy="21.4" r="1" fill="#E9DFC6" stroke="none" />
            </g>
          </symbol>
          <symbol id="sea-fish" viewBox="0 0 22 10">
            <path d="M0 5C4 1 11 1 15 5C11 9 4 9 0 5ZM15 5L21 1.6L19.4 5L21 8.4Z" fill="#8FD3C1" />
          </symbol>
        </defs>
      </svg>

      <h2 id="sea-h" className="sr-only">
        海外聲音：影片
      </h2>

      <div className="sea-sky" aria-hidden="true">
        <div className="sea-dolph">
          <svg viewBox="0 0 120 48">
            <use href="#sea-dolphin" />
          </svg>
        </div>
        <div className="sea-dolph sea-dolph--2">
          <svg viewBox="0 0 120 48">
            <use href="#sea-dolphin" />
          </svg>
        </div>
        <span className="sea-splash sea-splash--in" />
        <span className="sea-splash sea-splash--out" />
        <span className="sea-tag mono">Waterline · 水線</span>
      </div>
      <div className="sea-line" aria-hidden="true" />

      <div className="sea-deep">
        <svg className="sea-song" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path className="faint" d="M0 140C120 60 240 60 360 150S600 260 720 170S900 70 1000 120" />
          <path d="M0 140C120 60 240 60 360 150S600 260 720 170S900 70 1000 120" />
          <path className="faint" d="M0 470C160 400 300 520 500 450S820 380 1000 470" />
        </svg>
        <div className="sea-whale" aria-hidden="true">
          <svg viewBox="0 0 320 112">
            <use href="#sea-whale" />
          </svg>
        </div>
        <svg className="sea-school" viewBox="0 0 150 70" aria-hidden="true">
          {fish.map((p, i) => (
            <use key={i} href="#sea-fish" x={p.x} y={p.y} width={p.w} height={p.h} style={{ animationDelay: `${p.d}s`, opacity: p.o }} />
          ))}
        </svg>
        <div className="wrap sea-inner">
          {children}
          {note}
        </div>
      </div>
    </section>
  );
}
