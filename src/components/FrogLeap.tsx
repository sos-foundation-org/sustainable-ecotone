"use client";

import { useEffect, useRef } from "react";
import type { Lang } from "@/lib/i18n";
import { getPrey, type Prey } from "@/lib/prey";

const CAPTION = {
  zh: { fig: "Fig. Saltatio ranae.", text: "蛙跳：從一個學科，到另一個學科。" },
  en: { fig: "Fig. Saltatio ranae.", text: "A frog's leap: from one discipline to another." },
} satisfies Record<Lang, { fig: string; text: string }>;

const GROUND = 140;
const HEADROOM = 130;
const VW = 1200;

/* A frog in the site's engraved line, three poses. Facing right; the feet sit
   at (60, 64) in pose space so every pose shares one anchor. */
function FrogDefs() {
  return (
    <defs>
      <symbol id="frog-sit" viewBox="-60 0 180 70" overflow="visible">
        <g stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
          <path className="pf" d="M28 52C26 40 40 28 62 26C78 25 92 30 98 38C102 44 100 50 94 54C80 60 46 62 28 52Z" />
          <path fill="none" strokeWidth=".5" d="M38 36C54 29 72 28 88 32M44 50C58 54 76 54 90 50" />
          <path fill="none" strokeWidth=".55" d="M100 45C92 47 84 46 77 43" />
          <circle cx="73" cy="39" r="3.4" fill="none" strokeWidth=".5" />
          <g fill="none" strokeWidth=".45">
            <ellipse cx="50" cy="40" rx="3" ry="1.8" />
            <ellipse cx="62" cy="35" rx="2.2" ry="1.4" />
            <ellipse cx="42" cy="46" rx="2" ry="1.3" />
          </g>
          <path className="pf" d="M85 33C84 27 88 23 92 25C95 27 95 32 92 34Z" />
          <circle cx="89.5" cy="29" r="1.6" fill="currentColor" stroke="none" />
          <path className="pf" d="M31 48C37 38 56 40 61 50C57 57 40 59 31 48Z" />
          <path className="pf" d="M60 50C53 57 43 59 32 59L32 62.5C45 62.5 56 60.5 62 53.5Z" />
          <path fill="none" d="M32 62C40 64.5 50 64.5 62 64.3M62 64.3l5-1.6M62 64.3l5 .4M61 64.3l4 2" strokeWidth=".7" />
          <path fill="none" d="M87 52L89 59L94 64M94 64l4-.6M94 64l3 1.8M93.5 64l1-3" />
        </g>
      </symbol>
      <symbol id="frog-fly" viewBox="-60 0 180 70" overflow="visible">
        <g stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
          <path className="pf" d="M26 26C24 32 6 42 -2 50L2 55C12 48 26 40 32 36Z" />
          <path className="pf" d="M-1 51C-10 50 -20 48 -30 45L-29 41.5C-18 44 -8 46 3 47.5Z" />
          <path fill="none" strokeWidth=".7" d="M-30 43.5C-38 42.5 -46 42 -54 40M-54 40l-6-3.4M-54 40l-6.4 0M-54 40l-6 3.4" />
          <path className="pf" d="M20 40C30 30 60 26 84 28C96 29 104 34 107 40C104 46 96 50 84 50C60 52 34 50 20 40Z" />
          <path fill="none" strokeWidth=".5" d="M30 35C50 30 70 29 92 32M34 46C54 49 76 49 94 46" />
          <path fill="none" strokeWidth=".55" d="M106 43C98 44.5 90 44 83 42" />
          <g fill="none" strokeWidth=".45">
            <ellipse cx="44" cy="38" rx="3" ry="1.7" />
            <ellipse cx="60" cy="34" rx="2.2" ry="1.3" />
          </g>
          <path className="pf" d="M86 31C85 25 89 22 93 24C96 26 96 30 93 32Z" />
          <circle cx="90.5" cy="27.5" r="1.6" fill="currentColor" stroke="none" />
          <path fill="none" d="M88 48C96 52 104 55 112 56M112 56l5-2.4M112 56l5.4.6M112 56l4 3" />
        </g>
      </symbol>
      <symbol id="frog-land" viewBox="-60 0 180 70" overflow="visible">
        <g stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
          <path className="pf" d="M32 40C24 42 14 47 8 54L12 58C18 52 26 48 36 47Z" />
          <path className="pf" d="M9 56C16 60 24 62 32 62.5L33 59C25 58.6 18 56.6 13 53.6Z" />
          <path fill="none" strokeWidth=".7" d="M32 62.4C38 64 44 64.4 50 64.2M50 64.2l5-1.4M50 64.2l5 .6" />
          <path className="pf" d="M26 42C26 32 42 22 62 20C78 19 93 24 99 32C103 38 101 44 95 48C80 54 46 56 26 42Z" />
          <path fill="none" strokeWidth=".5" d="M36 32C52 25 72 24 89 28" />
          <path fill="none" strokeWidth=".55" d="M101 39C93 41 85 40 78 37" />
          <g fill="none" strokeWidth=".45">
            <ellipse cx="50" cy="35" rx="3" ry="1.8" />
            <ellipse cx="62" cy="30" rx="2.2" ry="1.4" />
          </g>
          <path className="pf" d="M86 27C85 21 89 17 93 19C96 21 96 26 93 28Z" />
          <circle cx="90.5" cy="23" r="1.6" fill="currentColor" stroke="none" />
          <path fill="none" d="M88 46L96 57L103 64M103 64l4.4-.8M103 64l3.6 2M102.6 64l.6-3.4" />
        </g>
      </symbol>
    </defs>
  );
}

type Pose = "sit" | "fly" | "land";
type Plan = { xs: number[]; peaks: number[]; air: number[]; pause: number[]; scale: number; tilt: number };

/** A run: enter from the left edge, land once or twice, exit past the right edge. Always differs from the last run. */
function plan(prev: Plan | null, forceTwo = false): Plan {
  for (let tries = 0; tries < 12; tries++) {
    const n = forceTwo || Math.random() < 0.5 ? 2 : 1;
    const xs = [-80];
    if (n === 1) xs.push(440 + Math.random() * 320);
    else xs.push(250 + Math.random() * 220, 640 + Math.random() * 260);
    xs.push(VW + 80);
    const hops = xs.length - 1;
    const peaks: number[] = [];
    const air: number[] = [];
    for (let i = 0; i < hops; i++) {
      const d = xs[i + 1] - xs[i];
      peaks.push(Math.min(118, d * (0.2 + Math.random() * 0.17)));
      air.push(460 + d * (0.42 + Math.random() * 0.28));
    }
    const p: Plan = { xs, peaks, air, pause: Array.from({ length: hops }, () => 180 + Math.random() * 380), scale: 1.0 + Math.random() * 0.26, tilt: (Math.random() - 0.5) * 7 };
    if (!prev || forceTwo) return p;
    const sameCount = prev.xs.length === p.xs.length;
    const shift = Math.abs(prev.xs[1] - p.xs[1]);
    if (!sameCount || shift > 90) return p;
  }
  return plan(null, forceTwo);
}

const NS = "http://www.w3.org/2000/svg";
const TONGUE_MS = { out: 90, hold: 40, back: 130 };
const GULP_MS = 200;

/**
 * The tongue: a page-level overlay (fixed, pointer-events none) from the frog's
 * mouth to the card's grasshopper, out fast with an ease-out, a tiny hold, then
 * a snappy return carrying the grasshopper into the mouth. Removed afterwards.
 */
function snapTongue(frog: SVGGElement, prey: Prey) {
  const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string>) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const overlay = el("svg", { class: "frog-tongue", "aria-hidden": "true" });
  const body = el("path", { fill: "#1C1A17" });
  const core = el("path", { fill: "none", stroke: "#A8321F", "stroke-width": ".8", "stroke-linecap": "round" });
  const tip = el("circle", { r: "3.4", fill: "#A8321F", stroke: "#1C1A17", "stroke-width": ".8" });
  const carried = el("g", { color: "#1C1A17", style: "--fillp:#FAF6EC", visibility: "hidden" });
  carried.appendChild(el("use", { href: "#grasshopper", x: "-105", y: "-55", width: "210", height: "110" }));
  overlay.append(body, core, carried, tip);
  document.body.appendChild(overlay);

  const r0 = prey.rect();
  const preyScale = r0 ? r0.width / 210 : 0.2;
  let caught = false;
  const st = performance.now();
  const total = TONGUE_MS.out + TONGUE_MS.hold + TONGUE_MS.back;
  const step = (now: number) => {
    const e = now - st;
    const ctm = frog.getScreenCTM();
    const r = prey.rect();
    if (!ctm || !r) {
      overlay.remove();
      return;
    }
    const m = new DOMPoint(40, -19).matrixTransform(ctm);
    const P = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    let ext: number;
    if (e < TONGUE_MS.out) ext = 1 - Math.pow(1 - e / TONGUE_MS.out, 3);
    else if (e < TONGUE_MS.out + TONGUE_MS.hold) ext = 1;
    else ext = Math.max(0, 1 - Math.pow((e - TONGUE_MS.out - TONGUE_MS.hold) / TONGUE_MS.back, 2));
    if (!caught && e >= TONGUE_MS.out) {
      caught = true;
      prey.snatch();
      carried.setAttribute("visibility", "visible");
    }
    // a slightly bowed, tapered strand: quadratic from the mouth to the sticky tip
    const tx = m.x + (P.x - m.x) * ext;
    const ty = m.y + (P.y - m.y) * ext;
    const cx = (m.x + tx) / 2 + (ty - m.y) * 0.08;
    const cy = (m.y + ty) / 2 - (tx - m.x) * 0.08;
    const left: string[] = [];
    const right: string[] = [];
    const N = 14;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = (1 - t) * (1 - t) * m.x + 2 * (1 - t) * t * cx + t * t * tx;
      const y = (1 - t) * (1 - t) * m.y + 2 * (1 - t) * t * cy + t * t * ty;
      const dx = 2 * (1 - t) * (cx - m.x) + 2 * t * (tx - cx);
      const dy = 2 * (1 - t) * (cy - m.y) + 2 * t * (ty - cy);
      const len = Math.hypot(dx, dy) || 1;
      const w = 1.7 - t;
      left.push(`${(x - (dy / len) * w).toFixed(1)} ${(y + (dx / len) * w).toFixed(1)}`);
      right.unshift(`${(x + (dy / len) * w).toFixed(1)} ${(y - (dx / len) * w).toFixed(1)}`);
    }
    body.setAttribute("d", `M${left.join("L")}L${right.join("L")}Z`);
    core.setAttribute("d", `M${m.x.toFixed(1)} ${m.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`);
    tip.setAttribute("cx", tx.toFixed(1));
    tip.setAttribute("cy", ty.toFixed(1));
    if (caught) carried.setAttribute("transform", `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) rotate(${(-30 * (1 - ext)).toFixed(1)}) scale(${(preyScale * (0.4 + 0.6 * ext)).toFixed(3)})`);
    if (e < total) requestAnimationFrame(step);
    else overlay.remove();
  };
  requestAnimationFrame(step);
}

/**
 * Fig. Saltatio ranae — a chronophotograph that happens live. Each time the
 * figure scrolls into view one frog crosses it: crouch, launch, arc, land
 * (once or twice), and out past the right edge, leaving faint ghost frames and
 * its dotted trajectory. Every run is randomised. Reduced motion: one resting
 * frog on a dotted arc.
 */
export function FrogLeap({ caption = true, lang = "zh" }: { caption?: boolean; lang?: Lang }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const frogRef = useRef<SVGGElement>(null);
  const useRefEl = useRef<SVGUseElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const ghostsRef = useRef<SVGGElement>(null);
  const staticRef = useRef<SVGGElement>(null);
  const clockRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    staticRef.current?.setAttribute("visibility", "hidden");
    const frog = frogRef.current!;
    const use = useRefEl.current!;
    const trail = trailRef.current!;
    const ghosts = ghostsRef.current!;
    let last: Plan | null = null;
    // once per page view, on the 2nd or 3rd run, the frog may catch the Next-leap card's grasshopper
    const snatchOn = 2 + Math.floor(Math.random() * 2);
    let runs = 0;
    let fed = false;
    let running = false;
    let armed = true;
    let raf = 0;

    const pose = (p: Pose) => use.setAttribute("href", `#frog-${p}`);
    const place = (x: number, y: number, rot: number, s: number, squash = 1) =>
      frog.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s.toFixed(3)} ${(s * squash).toFixed(3)})`);
    const ghost = (p: Pose, x: number, y: number, rot: number, s: number) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "frog-ghost");
      g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s.toFixed(3)})`);
      const u = document.createElementNS("http://www.w3.org/2000/svg", "use");
      u.setAttribute("href", `#frog-${p}`);
      u.setAttribute("x", "-120");
      u.setAttribute("y", "-64");
      u.setAttribute("width", "180");
      u.setAttribute("height", "70");
      g.appendChild(u);
      ghosts.appendChild(g);
    };

    const run = () => {
      running = true;
      armed = false;
      runs++;
      const hunt = !fed && runs >= snatchOn && !!getPrey();
      const P = plan(last, hunt);
      last = P;
      let paused = 0;
      let tongueAt = 0;
      let tongueTried = false;
      // on narrow screens the 1200-wide figure is scaled far down: draw the frog larger, the arcs lower
      const boost = Math.min(1.6, Math.max(1, (VW / svg.clientWidth) * 0.45));
      P.scale *= boost;
      if (boost > 1.2) P.peaks = P.peaks.map((h) => Math.min(h, 84));
      ghosts.replaceChildren();
      let d = "";
      trail.setAttribute("d", "");
      frog.setAttribute("visibility", "visible");
      // timeline: for each hop → crouch (or the pause after a landing), flight, landing squash
      type Seg = { kind: "crouch" | "fly" | "land"; dur: number; i: number };
      const segs: Seg[] = [];
      P.air.forEach((a, i) => {
        segs.push({ kind: "crouch", dur: i === 0 ? 220 : P.pause[i - 1], i });
        segs.push({ kind: "fly", dur: a, i });
        if (i < P.air.length - 1) segs.push({ kind: "land", dur: 150, i });
      });
      const total = segs.reduce((n, s) => n + s.dur, 0);
      if (clockRef.current) clockRef.current.textContent = `t = ${(total / 1000).toFixed(1)} s`;
      const st = performance.now();
      let lastGhost = 0;
      const step = (now: number) => {
        // the tongue: the clock stops while the frog, just landed, snaps at the grasshopper and gulps
        if (tongueAt) {
          const k = now - tongueAt;
          const T = TONGUE_MS.out + TONGUE_MS.hold + TONGUE_MS.back;
          const gulp = k > T ? Math.sin(((k - T) / GULP_MS) * Math.PI) : 0;
          pose("sit");
          place(P.xs[2], GROUND, P.tilt - (k < T ? 6 : 0), P.scale, 1 - 0.14 * gulp);
          if (k < T + GULP_MS) {
            raf = requestAnimationFrame(step);
            return;
          }
          paused += k;
          tongueAt = 0;
        }
        let e = Math.min(now - st - paused, total - 0.01);
        let seg = segs[segs.length - 1];
        for (const s of segs) {
          if (e < s.dur) {
            seg = s;
            break;
          }
          e -= s.dur;
        }
        const t = Math.min(1, e / seg.dur);
        const x0 = P.xs[seg.i];
        const x1 = P.xs[seg.i + 1];
        const s = P.scale;
        if (seg.kind === "crouch") {
          const c = Math.sin(t * Math.PI);
          pose("sit");
          place(x0, GROUND, P.tilt - 3 * c, s, 1 - 0.12 * Math.sin(Math.min(1, t * 1.6) * Math.PI * 0.5) * (t > 0.7 ? (1 - t) / 0.3 : 1));
        } else if (seg.kind === "fly") {
          const k = t < 0.5 ? 2 * t * t * 0.4 + t * 0.6 : t; // quick launch, steady glide
          const x = x0 + (x1 - x0) * k;
          const y = GROUND - P.peaks[seg.i] * 4 * t * (1 - t);
          const slope = (P.peaks[seg.i] * 4 * (1 - 2 * t)) / Math.max(1, x1 - x0);
          const rot = (-Math.atan(slope * 1.4) * 180) / Math.PI * 0.6 + P.tilt;
          const lastHop = seg.i === P.air.length - 1;
          const pz: Pose = t < 0.12 ? "sit" : t < 0.8 || lastHop ? "fly" : "land";
          pose(pz);
          place(x, y, rot, s, t < 0.1 ? 1.1 : 1);
          d += `${d ? "L" : "M"}${x.toFixed(1)} ${(y - 4).toFixed(1)}`;
          trail.setAttribute("d", d);
          if (now - lastGhost > 120 && x > 0 && x < VW) {
            lastGhost = now;
            ghost(pz, x, y, rot, s);
          }
        } else {
          pose("sit");
          place(x1, GROUND, P.tilt, s, 1 - 0.18 * Math.sin(t * Math.PI));
          // second landing of a hunting run: if the grasshopper is there and still, snap
          if (hunt && seg.i === 1 && !tongueTried && t > 0.6) {
            tongueTried = true;
            const prey = getPrey();
            if (prey?.available()) {
              fed = true;
              tongueAt = now;
              snapTongue(frog, prey);
              raf = requestAnimationFrame(step);
              return;
            }
          }
        }
        if (now - st - paused < total) raf = requestAnimationFrame(step);
        else {
          frog.setAttribute("visibility", "hidden");
          running = false;
        }
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting && en.intersectionRatio >= 0.5) {
          if (armed && !running && !document.hidden) run();
        } else if (!en.isIntersecting) armed = true;
      },
      { threshold: [0, 0.5] },
    );
    io.observe(svg);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const c = CAPTION[lang];
  return (
    <div className="marey frogleap wrap" aria-hidden="true">
      {/* headroom above the arc so the frog (scaled up to ~2× on phones) is never clipped at the top */}
      <svg ref={svgRef} viewBox={`0 ${-HEADROOM} ${VW} ${160 + HEADROOM}`} aria-hidden="true">
        <FrogDefs />
        <line x1="0" y1={GROUND + 1} x2={VW} y2={GROUND + 1} stroke="var(--ink)" strokeWidth=".5" />
        {/* static figure (no JS / reduced motion): one resting frog and a dotted arc */}
        <g ref={staticRef}>
          <path d={`M90 ${GROUND - 4}Q600 -60 1110 ${GROUND - 4}`} fill="none" stroke="var(--ink)" strokeWidth=".6" strokeDasharray="2 5" />
          <g transform={`translate(600 ${GROUND}) scale(1.1)`}>
            <use href="#frog-sit" x="-120" y="-64" width="180" height="70" />
          </g>
        </g>
        <path ref={trailRef} className="frog-trail" d="" />
        <g ref={ghostsRef} />
        <g ref={frogRef} visibility="hidden">
          <use ref={useRefEl} href="#frog-sit" x="-120" y="-64" width="180" height="70" />
        </g>
        <text x="12" y="157" className="svg-mono" fill="var(--cinnabar)">
          t = 0
        </text>
        <text ref={clockRef} x={VW - 12} y="157" textAnchor="end" className="svg-mono" fill="var(--cinnabar)">
          t = 1.6 s
        </text>
      </svg>
      {caption && (
        <p>
          <i>{c.fig}</i>
          {lang === "zh" ? "　" : " "}
          {c.text}
        </p>
      )}
    </div>
  );
}
