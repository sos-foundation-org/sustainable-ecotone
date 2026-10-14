"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { grass, mushroom, rng, tree, type MushroomKind } from "@/lib/mycelium";
import { createWeb, type Focus, type Web, type WebNode, type WebSpeaker } from "./engine";

export type HeroSpeaker = WebSpeaker & { name: string; sub: string; kind: MushroomKind; linkNames: string[] };
export type HeroPair = { a: string; b: string; aLabel: [string, string]; bLabel: [string, string]; question: string };
export type HeroVolume = { title: string; meta: string; href: string; next: string };

type Flora = {
  W: number;
  H: number;
  mobile: boolean;
  treeX: number;
  tree: ReturnType<typeof tree>;
  ghost: ReturnType<typeof tree> | null;
  grass: string;
  shrooms: { id: string; x: number; cx: number; top: number; paths: ReturnType<typeof mushroom>; delay: number; labelX: number }[];
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * ABOVE & BELOW — the home hero. Above the horizon: the volume as a tree, each
 * speaker as a fruiting body, a grasshopper on the soil line. Below it: the
 * mycelium joining speakers to the disciplines and countries they really
 * touch (canvas, see ./engine). "下一跳" makes the grasshopper leap and grows a
 * new hypha between two disciplines nobody has joined yet.
 */
export default function MycorrhizaHero({
  title,
  lead,
  speakers,
  nodes,
  pairs,
  volume,
}: {
  title: ReactNode;
  lead: ReactNode;
  speakers: HeroSpeaker[];
  nodes: WebNode[];
  pairs: HeroPair[];
  volume: HeroVolume;
}) {
  const aboveRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const belowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hopRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<Web | null>(null);
  const hopX = useRef(0);
  const [flora, setFlora] = useState<Flora | null>(null);
  const [focus, setFocusState] = useState<Focus>(null);
  const [pi, setPi] = useState(0);
  const [leaping, setLeaping] = useState(false);

  // ── lay out the above-ground flora for the measured width ──
  const layout = useCallback(() => {
    const above = aboveRef.current;
    const t = titleRef.current;
    if (!above || !t) return;
    const W = above.clientWidth;
    const H = above.clientHeight;
    const mobile = W < 760;
    const titleBottom = t.getBoundingClientRect().bottom - above.getBoundingClientRect().top;
    const R = rng(7);
    const treeX = W * (mobile ? 0.77 : 0.73);
    const room = H - (mobile ? titleBottom + 34 : 150);
    const TH = Math.max(110, Math.min(mobile ? 230 : 400, room));
    const tr = tree(treeX, H, TH, 11, mobile ? 6 : 7);
    const ghost = mobile ? null : tree(W * 0.955, H, 120, 5, 4, 2);
    const xs = mobile ? [0.1, 0.27, 0.43, 0.59, 0.92] : [0.53, 0.6, 0.665, 0.825, 0.9];
    const hs = mobile ? [44, 64, 40, 54, 38] : [62, 88, 54, 76, 50];
    const cws = mobile ? [26, 36, 26, 34, 24] : [34, 46, 32, 44, 30];
    const n = speakers.length;
    const shrooms = speakers.map((s, i) => {
      // up to five speakers use the composed positions; more spread evenly across the flora zone
      const fx = n <= 5 ? xs[i] : mobile ? 0.06 + (0.88 * i) / (n - 1) : 0.5 + (0.45 * i) / (n - 1);
      const x = W * fx;
      const paths = mushroom(x, H, hs[i % 5], cws[i % 5], s.kind, (R() - 0.5) * 8);
      const half = mobile ? 28 : 34;
      return { id: s.id, x, cx: paths.cx, top: paths.top, paths, delay: 0.6 + i * 0.15, labelX: Math.max(half + 4, Math.min(W - half - 4, paths.cx)) };
    });
    let g = "";
    for (let i = 0; i < (mobile ? 10 : 18); i++) g += grass((mobile ? 0.02 : 0.48) * W + R() * W * (mobile ? 0.96 : 0.5), H, R, 3 + Math.floor(R() * 4));
    hopX.current = W * (mobile ? 0.66 : 0.44);
    setFlora({ W, H, mobile, treeX, tree: tr, ghost, grass: g, shrooms });
  }, [speakers]);

  useIsoLayoutEffect(() => {
    layout();
    let lastW = window.innerWidth;
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (window.innerWidth !== lastW) {
          lastW = window.innerWidth;
          layout();
        }
      }, 220);
    };
    window.addEventListener("resize", onResize);
    // fonts change the title's height; re-measure once they are in
    document.fonts?.ready.then(() => layout());
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, [layout]);

  // ── place the grasshopper ──
  const placeHop = useCallback((x: number, y = 0, rot = 0, flip = false) => {
    const el = hopRef.current;
    if (!el) return;
    el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${-y}px) rotate(${rot}deg)`;
    const svg = el.firstElementChild as SVGElement | null;
    if (svg) svg.style.transform = flip ? "scaleX(-1)" : "";
  }, []);
  useEffect(() => {
    if (flora) placeHop(hopX.current);
  }, [flora, placeHop]);

  // ── the underground web ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const below = belowRef.current;
    if (!flora || !canvas || !below) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cr = canvas.getBoundingClientRect();
    const exclude = Array.from(below.querySelectorAll<HTMLElement>("[data-exclude]")).map((el) => {
      const r = el.getBoundingClientRect();
      return [r.left - cr.left - 20, r.top - cr.top - 20, r.right - cr.left + 20, r.bottom - cr.top + 20] as [number, number, number, number];
    });
    const web = createWeb(canvas, {
      W: below.clientWidth,
      H: below.clientHeight,
      mobile: flora.mobile,
      reduced,
      bases: flora.shrooms.map((s) => ({ id: s.id, x: s.x })),
      treeX: flora.treeX,
      nodes,
      speakers,
      exclude,
    });
    webRef.current = web;
    return () => {
      web.destroy();
      webRef.current = null;
    };
  }, [flora, nodes, speakers]);

  const setFocus = useCallback((f: Focus) => {
    setFocusState(f);
    webRef.current?.setFocus(f);
  }, []);

  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFocus(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, setFocus]);

  // ── next leap ──
  const pair = pairs[pi % pairs.length];
  const leap = () => {
    if (leaping || !flora || !pairs.length) return;
    const next = (pi + 1) % pairs.length;
    setPi(next);
    const p = pairs[next];
    const W = flora.W;
    const x0 = hopX.current;
    let x1 = x0;
    for (let k = 0; k < 20 && Math.abs(x1 - x0) < W * 0.18; k++) x1 = W * (0.06 + Math.random() * 0.86);
    const flip = x1 < x0;
    const land = () => {
      hopX.current = x1;
      webRef.current?.leap(p.a, p.b, next * 97 + 3);
      setFocus({ type: "pair", a: p.a, b: p.b });
      setLeaping(false);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      placeHop(x1, 0, 0, flip);
      land();
      return;
    }
    setLeaping(true);
    const svg = hopRef.current?.firstElementChild as SVGElement | null;
    const H = Math.min(150, flora.H * 0.28);
    const st = performance.now();
    svg?.style.setProperty("--kick", "60deg");
    const step = (now: number) => {
      const t = Math.min(1, (now - st) / 900);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const dir = flip ? -1 : 1;
      placeHop(x0 + (x1 - x0) * e, H * 4 * t * (1 - t), t < 0.95 ? dir * (-22 + 44 * t) : 0, flip);
      if (t > 0.35) svg?.style.setProperty("--kick", "18deg");
      if (t < 1) requestAnimationFrame(step);
      else {
        svg?.style.setProperty("--kick", "0deg");
        land();
      }
    };
    requestAnimationFrame(step);
  };

  const fine = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const spkOn = (id: string) => focus?.type === "spk" && focus.id === id;

  return (
    <section className="myco" aria-labelledby="hero-title">
      <svg className="myco-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          {/* grasshopper, side view, facing right; feet at y≈54 */}
          <symbol id="myco-hopper" viewBox="0 0 120 60" overflow="visible">
            <g fill="#F4F1E8" stroke="#1C1A17" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
              <path fill="none" strokeWidth=".7" d="M101 26C106 16 112 9 119 5M98.5 26C101 15 105 8 110 2" />
              <path fill="none" d="M84 41L82 49L76 53M94 41.5L98 49L103 52.5" />
              <path d="M30 36C40 31 60 30 76 31L76 41C60 43 42 42 30 36Z" />
              <path fill="none" strokeWidth=".5" d="M42 32.6L43 41.5M50 31.6L51 42.2M58 31L58.6 42.4M66 30.8L66.4 42" />
              <path d="M92 31C74 27 46 27 19 33C24 35.6 30 36.2 36 35.8C56 34.3 76 34.3 92 35.4Z" />
              <path fill="none" strokeWidth=".45" d="M88 32.5C66 30.2 44 30.6 24 33.7M80 33.6C62 32.2 46 32.4 32 34.6" />
              <path d="M74 29C80 26 90 26 94 29L95 41C88 43 80 43 75 41Z" />
              <path d="M93 28C99 25 106 28 107 35C107 41 102 44 96 42L94 40Z" />
              <ellipse cx="100.5" cy="31.5" rx="2.4" ry="3" fill="#1C1A17" />
              <g style={{ transformOrigin: "42px 22.5px", transform: "rotate(var(--kick, 0deg))", transition: "transform .18s ease-out" }}>
                <path fill="none" d="M42 23L57 52L65 53.5" />
                <path fill="none" strokeWidth=".6" d="M46 31l2.6-1.2M49.5 37.6l2.6-1.2M53 44.4l2.6-1.2" />
              </g>
              <path d="M78 40.5C74 33 60 25 44 21C41.6 20.4 40.6 22.6 42.2 23.8C54 29.5 66 36.5 73 42.5Z" />
              <path fill="none" strokeWidth=".5" d="M70 36.5l-2-4.4M64.5 32.6l-2-4.2M59 29.4l-2-4M53.5 26.6l-2-3.6M48 24.2l-1.6-2.6" />
            </g>
          </symbol>
        </defs>
      </svg>

      {/* ───── above: what you can see ───── */}
      <div className="myco-above" ref={aboveRef}>
        {flora && (
          <svg className="myco-flora" viewBox={`0 0 ${flora.W} ${flora.H}`} aria-hidden="true">
            {flora.tree.branches.map((b, i) => (
              <path key={i} className="myco-br" pathLength={1} d={b.d} style={{ strokeWidth: b.w, animationDelay: `${b.delay}s` }} />
            ))}
            {flora.tree.leaves.map((l, i) => (
              <path
                key={"l" + i}
                className="myco-leaf"
                style={{ animationDelay: `${l.delay}s` }}
                transform={`translate(${l.x} ${l.y}) rotate(${l.a})`}
                d={`M0 0Q${l.s * 0.5} ${-l.s * 0.38} ${l.s} 0Q${l.s * 0.5} ${l.s * 0.38} 0 0Z`}
              />
            ))}
            {flora.ghost?.branches.map((b, i) => (
              <path key={"g" + i} className="myco-br myco-br--ghost" d={b.d} style={{ strokeWidth: b.w }} />
            ))}
            <path className="myco-grass" d={flora.grass} />
            {flora.shrooms.map((s) => (
              <g key={s.id} className={`myco-mush${spkOn(s.id) ? " is-on" : ""}`} style={{ animationDelay: `${s.delay}s` }}>
                <path className="stem" d={s.paths.stem} />
                <path className="cap" d={s.paths.cap} />
                <path className="gill" d={s.paths.gill} />
              </g>
            ))}
          </svg>
        )}

        <div className="wrap myco-title" ref={titleRef}>
          {title}
        </div>

        {flora && (
          <div className="myco-labels">
            {speakers.map((s, i) => {
              const m = flora.shrooms[i];
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`myco-fl${spkOn(s.id) ? " is-on" : ""}`}
                  style={{ left: m.labelX, top: m.top - 2, animationDelay: `${1.4 + i * 0.12}s` }}
                  aria-pressed={spkOn(s.id)}
                  aria-label={`${s.name}：在地下網絡標出連結（${s.linkNames.join("、")}）`}
                  onPointerEnter={() => fine() && setFocus({ type: "spk", id: s.id })}
                  onPointerLeave={() => fine() && setFocus(null)}
                  onFocus={() => setFocus({ type: "spk", id: s.id })}
                  onClick={() => !fine() && setFocus(spkOn(s.id) ? null : { type: "spk", id: s.id })}
                >
                  <b>{s.name}</b>
                  {!flora.mobile && <span>{s.sub}</span>}
                </button>
              );
            })}
          </div>
        )}

        {flora && !flora.mobile && (
          <>
            <Link className="myco-tree-label" href={volume.href} style={{ left: flora.treeX, top: Math.max(8, flora.tree.top - 58) }}>
              <b>{volume.title}</b>
              {volume.meta}
            </Link>
            <span className="myco-tree-label myco-tree-label--ghost" style={{ top: flora.H - 150 }}>
              {volume.next}
            </span>
          </>
        )}

        <div className="myco-hopper" ref={hopRef} aria-hidden="true">
          <svg viewBox="0 0 120 60">
            <use href="#myco-hopper" />
          </svg>
        </div>
        <span className="myco-tag myco-tag--up mono" aria-hidden="true">
          ↑ 地上 · visible
        </span>
        <div className="myco-hz" />
      </div>

      {/* ───── below: the hidden network ───── */}
      <div
        className="myco-below"
        ref={belowRef}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !canvasRef.current) return;
          const r = canvasRef.current.getBoundingClientRect();
          webRef.current?.setPointer({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onPointerLeave={() => webRef.current?.setPointer(null)}
      >
        <canvas ref={canvasRef} className="myco-web" aria-hidden="true" />
        <span className="myco-tag myco-tag--down mono" aria-hidden="true">
          ↓ 地下 · the wood wide web
        </span>
        <div className="myco-depth mono" aria-hidden="true">
          <i style={{ top: "0%" }}>−10 cm</i>
          <i style={{ top: "33%" }}>−30 cm</i>
          <i style={{ top: "66%" }}>−60 cm</i>
          <i style={{ top: "100%" }}>−1 m</i>
        </div>
        <ul className="sr-only" aria-label="講者與學科、國家的連結">
          {speakers.map((s) => (
            <li key={s.id}>
              {s.name} → {s.linkNames.join("、")}
            </li>
          ))}
        </ul>
        <div className="wrap myco-below-inner">
          <div className="myco-lead reveal" data-exclude>
            {lead}
          </div>
          {pair && (
            <div className="myco-leap reveal" data-exclude>
              <div className="myco-leap-top mono">
                <span>下一跳 · Next leap</span>
                <span>
                  {String((pi % pairs.length) + 1).padStart(2, "0")} / {String(pairs.length).padStart(2, "0")}
                </span>
              </div>
              <p className="myco-pair" aria-live="polite">
                <span>
                  <span className="code">{pair.aLabel[0]}</span>
                  {pair.aLabel[1]}
                </span>
                <span className="x" aria-hidden="true">
                  ×
                </span>
                <span>
                  <span className="code">{pair.bLabel[0]}</span>
                  {pair.bLabel[1]}
                </span>
                <span className="myco-q">「{pair.question}」</span>
              </p>
              <button className="myco-leap-btn" type="button" onClick={leap} disabled={leaping}>
                <span>
                  讓蚱蜢跳一下 <i>· grow a new link</i>
                </span>
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
