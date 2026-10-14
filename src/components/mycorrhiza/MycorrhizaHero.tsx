"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { grass, mushroom, rng, tree, type MushroomKind } from "@/lib/mycelium";
import { leap as leapArc, prefersReducedMotion } from "@/lib/leap";
import LeapStage from "../LeapStage";
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
  shrooms: { id: string; x: number; cx: number; top: number; w: number; paths: ReturnType<typeof mushroom>; delay: number }[];
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
  const hop2Ref = useRef<HTMLDivElement>(null);
  const leapingRef = useRef(false);
  const webRef = useRef<Web | null>(null);
  // two grasshoppers: [0] the large one (also the 下一跳 jumper), [1] a smaller one (~0.68×)
  const hops = useRef([
    { x: 0, busy: false, flip: false },
    { x: 0, busy: false, flip: true },
  ]);
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
      return { id: s.id, x, cx: paths.cx, top: paths.top, w: cws[i % 5], paths, delay: 0.6 + i * 0.15 };
    });
    let g = "";
    for (let i = 0; i < (mobile ? 10 : 18); i++) g += grass((mobile ? 0.02 : 0.48) * W + R() * W * (mobile ? 0.96 : 0.5), H, R, 3 + Math.floor(R() * 4));
    hops.current[0].x = W * (mobile ? 0.66 : 0.44);
    hops.current[1].x = W * (mobile ? 0.3 : 0.2);
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

  // ── grasshoppers: place, and leap with crouch → launch → flight → landing ──
  const hopEl = (i: number) => (i === 0 ? hopRef.current : hop2Ref.current);
  const placeHop = useCallback((i: number, x: number, dy = 0, rot = 0, flip = false, squash = 1, kick = 0) => {
    const el = i === 0 ? hopRef.current : hop2Ref.current;
    if (!el) return;
    el.style.transform = `translate3d(${x - el.offsetWidth / 2}px, ${dy}px, 0) rotate(${rot}deg)`;
    const svg = el.firstElementChild as SVGElement | null;
    if (svg) {
      svg.style.transform = `scale(${flip ? -1 : 1}, ${squash})`;
      svg.style.setProperty("--kick", `${kick}deg`);
    }
  }, []);
  useEffect(() => {
    if (!flora) return;
    hops.current.forEach((h, i) => placeHop(i, h.x, 0, 0, h.flip));
  }, [flora, placeHop]);

  const jump = useCallback(
    (i: number, x1: number, dur: number, onLand?: () => void) => {
      const h = hops.current[i];
      if (!hopEl(i) || !flora || h.busy) return false;
      h.busy = true;
      const peak = Math.min(flora.H * 0.3, 40 + Math.abs(x1 - h.x) * 0.42) * (i === 0 ? 1 : 0.72);
      const flip = x1 < h.x;
      leapArc({
        x0: h.x,
        y0: 0,
        x1,
        y1: 0,
        peak,
        dur,
        onFrame: (f) => placeHop(i, f.x, f.y, f.rot, f.flip, f.squash, f.kick),
        onDone: () => {
          h.x = x1;
          h.flip = flip;
          h.busy = false;
          onLand?.();
        },
      });
      return true;
    },
    [flora, placeHop],
  );

  // ── ambient leaps: every 6–12 s one or two grasshoppers jump on their own ──
  useEffect(() => {
    const above = aboveRef.current;
    if (!flora || !above || prefersReducedMotion()) return;
    let onScreen = true;
    const io = new IntersectionObserver(([en]) => (onScreen = en.isIntersecting));
    io.observe(above);
    const W = flora.W;
    const target = (x: number) => {
      const dist = W * (0.08 + Math.random() * 0.22);
      let x1 = x + (Math.random() < 0.5 ? -dist : dist);
      if (x1 < W * 0.04 || x1 > W * 0.96) x1 = x - (x1 - x);
      return Math.max(W * 0.04, Math.min(W * 0.96, x1));
    };
    let timer = 0;
    const tick = () => {
      if (onScreen && !document.hidden && !leapingRef.current) {
        const both = Math.random() < 0.4;
        const first = both || Math.random() < 0.5 ? 0 : 1;
        jump(first, target(hops.current[first].x), 760 + Math.random() * 260);
        if (both) {
          const other = 1 - first;
          window.setTimeout(() => jump(other, target(hops.current[other].x), 560 + Math.random() * 220), 140 + Math.random() * 260);
        }
      }
      timer = window.setTimeout(tick, 6000 + Math.random() * 6000);
    };
    timer = window.setTimeout(tick, 3500 + Math.random() * 3000);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [flora, jump]);

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
    const x0 = hops.current[0].x;
    let x1 = x0;
    for (let k = 0; k < 20 && Math.abs(x1 - x0) < W * 0.18; k++) x1 = W * (0.06 + Math.random() * 0.86);
    setLeaping(true);
    leapingRef.current = true;
    const land = () => {
      webRef.current?.leap(p.a, p.b, next * 97 + 3);
      setFocus({ type: "pair", a: p.a, b: p.b });
      setLeaping(false);
      leapingRef.current = false;
    };
    // if the big grasshopper is mid-air on an ambient leap, wait for it to land
    const go = () => {
      if (!jump(0, x1, 900, land)) window.setTimeout(go, 60);
    };
    go();
  };

  const fine = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const spkOn = (id: string) => focus?.type === "spk" && focus.id === id;

  return (
    <section className="myco" aria-labelledby="hero-title">
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
            {/* each mushroom is itself the control: no visible name, but a full accessible name */}
            {speakers.map((s, i) => {
              const m = flora.shrooms[i];
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`myco-hit${spkOn(s.id) ? " is-on" : ""}`}
                  style={{ left: m.cx - m.w / 2 - 6, top: m.top - 6, width: m.w + 12, height: flora.H - m.top + 6 }}
                  aria-pressed={spkOn(s.id)}
                  aria-label={`${s.name}（${s.sub}）：在地下網絡標出連結（${s.linkNames.join("、")}）`}
                  onPointerEnter={() => fine() && setFocus({ type: "spk", id: s.id })}
                  onPointerLeave={() => fine() && setFocus(null)}
                  onFocus={() => setFocus({ type: "spk", id: s.id })}
                  onBlur={() => setFocus(null)}
                  onClick={() => !fine() && setFocus(spkOn(s.id) ? null : { type: "spk", id: s.id })}
                />
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
          <svg viewBox="0 0 210 110">
            <use href="#grasshopper" />
          </svg>
        </div>
        <div className="myco-hopper myco-hopper--sm" ref={hop2Ref} aria-hidden="true">
          <svg viewBox="0 0 210 110">
            <use href="#grasshopper" />
          </svg>
        </div>
        <span className="myco-tag myco-tag--up mono" aria-hidden="true">
          ↑ 地上 · visible
        </span>
        <div className="myco-hz" />
      </div>

      {/* ───── below: the hidden network ───── */}
      <div className="myco-below" ref={belowRef}>
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
              <div className="myco-leap-stage" aria-hidden="true">
                <LeapStage trigger={pi} viewBox="0 0 320 84" perches={[{ x: 58, y: 52 }, { x: 262, y: 52 }]} scale={0.24} ink="#E9DFC6" fill="#15120E">
                  <path d="M58 52C120 6 200 6 262 52" fill="none" stroke="#D8B25A" strokeOpacity=".55" strokeWidth="1" strokeDasharray="2 5" />
                  <line x1="10" y1="52" x2="310" y2="52" stroke="#E9DFC6" strokeOpacity=".25" />
                  <text x="58" y="74" textAnchor="middle" className="myco-stage-code">
                    {pair.aLabel[0]}
                  </text>
                  <text x="262" y="74" textAnchor="middle" className="myco-stage-code">
                    {pair.bLabel[0]}
                  </text>
                </LeapStage>
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
