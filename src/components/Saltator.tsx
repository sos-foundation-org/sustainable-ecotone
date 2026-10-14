"use client";

import { useEffect, useRef } from "react";

type Perch = { x: number; y: number; f: 1 | -1 };

/**
 * The grasshopper (Saltatoria, "the leaper"). Lives inside an SVG; jumps
 * between two perches on click / Enter / Space, and once there and back by
 * itself after the plate has inked. Under reduced motion it relocates without the arc.
 */
export default function Saltator({ perches, scale = 0.36, autoLeapMs = 1900 }: { perches: [Perch, Perch]; scale?: number; autoLeapMs?: number }) {
  const ref = useRef<SVGGElement>(null);
  const at = useRef(0);
  const busy = useRef(false);

  const place = (x: number, y: number, f: number, rot = 0, sq = 1) => {
    ref.current?.setAttribute(
      "transform",
      `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${(scale * f).toFixed(3)} ${(scale * sq).toFixed(3)})`,
    );
  };

  const jump = () => {
    if (busy.current) return;
    busy.current = true;
    const A = perches[at.current];
    const B = perches[1 - at.current];
    at.current = 1 - at.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || document.hidden) {
      place(B.x, B.y, B.f);
      busy.current = false;
      return;
    }
    const dur = 760;
    const H = 120;
    const t0 = performance.now();
    const dir = Math.sign(B.x - A.x) || 1;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const x = A.x + (B.x - A.x) * e;
      const y = A.y + (B.y - A.y) * e - H * 4 * e * (1 - e);
      const rot = (1 - 2 * e) * -16 * dir;
      const sq = t < 0.08 ? 1 - t * 2 : t > 0.92 ? 1 - (1 - t) * 1.6 : 1;
      place(x, y, t < 0.5 ? A.f : B.f, rot, sq);
      if (t < 1) requestAnimationFrame(step);
      else {
        place(B.x, B.y, B.f);
        busy.current = false;
      }
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const svg = ref.current?.ownerSVGElement;
    if (!svg) return;
    // a single "hello" the first time the plate is seen: leap across and back
    const timers: number[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || document.hidden) return;
      io.disconnect();
      timers.push(window.setTimeout(jump, autoLeapMs));
      timers.push(window.setTimeout(jump, autoLeapMs + 1500));
    }, { threshold: 0.4 });
    io.observe(svg);
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const p = perches[0];
  return (
    <g
      ref={ref}
      className="hopper"
      transform={`translate(${p.x} ${p.y}) scale(${scale * p.f} ${scale})`}
      tabIndex={0}
      role="button"
      aria-label="讓蝗蟲跳到另一根枝條"
      onClick={jump}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          jump();
        }
      }}
    >
      <circle className="hop-ring" cx="0" cy="-50" r="130" />
      <rect x="-120" y="-110" width="240" height="120" fill="transparent" />
      <use href="#grasshopper" x="-110" y="-99" width="210" height="110" color="#1C1A17" />
    </g>
  );
}
