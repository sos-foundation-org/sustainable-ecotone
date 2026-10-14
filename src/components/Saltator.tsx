"use client";

import { useEffect, useRef } from "react";
import { leap, prefersReducedMotion } from "@/lib/leap";

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

  const place = (x: number, y: number, f: number, rot = 0, sq = 1, kick = 0) => {
    const g = ref.current;
    if (!g) return;
    g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${(scale * f).toFixed(3)} ${(scale * sq).toFixed(3)})`);
    g.style.setProperty("--kick", `${kick}deg`);
  };

  // the site's one leap (lib/leap): crouch → launch → arc → landing
  const jump = () => {
    if (busy.current) return;
    busy.current = true;
    const A = perches[at.current];
    const B = perches[1 - at.current];
    at.current = 1 - at.current;
    if (document.hidden) {
      place(B.x, B.y, B.f);
      busy.current = false;
      return;
    }
    leap({
      x0: A.x,
      y0: A.y,
      x1: B.x,
      y1: B.y,
      peak: 120,
      dur: 760,
      onFrame: (fr) => place(fr.x, fr.y, fr.flip ? -1 : 1, fr.rot, fr.squash, fr.kick),
      onDone: () => {
        place(B.x, B.y, B.f);
        busy.current = false;
      },
    });
  };

  useEffect(() => {
    if (prefersReducedMotion()) return;
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
      <use href="#grasshopper" x="-105" y="-99" width="210" height="110" color="#1C1A17" />
    </g>
  );
}
