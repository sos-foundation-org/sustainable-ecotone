"use client";

import { useEffect, useRef } from "react";
import type { Lang } from "@/lib/i18n";

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
function plan(prev: Plan | null): Plan {
  for (let tries = 0; tries < 12; tries++) {
    const n = Math.random() < 0.5 ? 1 : 2;
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
    if (!prev) return p;
    const sameCount = prev.xs.length === p.xs.length;
    const shift = Math.abs(prev.xs[1] - p.xs[1]);
    if (!sameCount || shift > 90) return p;
  }
  return plan(null);
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
      const P = plan(last);
      last = P;
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
        let e = Math.min(now - st, total - 0.01);
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
        }
        if (now - st < total) raf = requestAnimationFrame(step);
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
