"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { leap, prefersReducedMotion } from "@/lib/leap";

type Perch = { x: number; y: number };

/**
 * A small stage for the 下一跳 panels: two perches with the site's one
 * grasshopper between them. It leaps to the other perch whenever `trigger`
 * changes (the button), and now and then on its own (every 14–24 s, only while
 * on screen and the tab is visible; never under reduced motion).
 */
export default function LeapStage({
  trigger,
  perches = [
    { x: 58, y: 40 },
    { x: 262, y: 40 },
  ],
  scale = 0.2,
  viewBox = "0 0 320 120",
  ink = "#1C1A17",
  fill = "#FAF6EC",
  ambient = true,
  children,
}: {
  trigger: number;
  perches?: [Perch, Perch];
  scale?: number;
  viewBox?: string;
  ink?: string;
  fill?: string;
  ambient?: boolean;
  children?: ReactNode;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hopRef = useRef<SVGGElement>(null);
  const at = useRef(0);
  const busy = useRef(false);
  const first = useRef(true);

  const place = (x: number, y: number, rot = 0, flip = false, squash = 1, kick = 0) => {
    const g = hopRef.current;
    if (!g) return;
    g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${(flip ? -scale : scale).toFixed(3)} ${(scale * squash).toFixed(3)})`);
    g.style.setProperty("--kick", `${kick}deg`);
  };

  const hop = () => {
    if (busy.current) return;
    busy.current = true;
    const A = perches[at.current];
    const B = perches[1 - at.current];
    at.current = 1 - at.current;
    leap({
      x0: A.x,
      y0: A.y,
      x1: B.x,
      y1: B.y,
      peak: 46,
      dur: 720,
      onFrame: (f) => place(f.x, f.y, f.rot, f.flip, f.squash, f.kick),
      onDone: () => (busy.current = false),
    });
  };
  const hopRef2 = useRef(hop);
  useEffect(() => {
    hopRef2.current = hop;
  });

  // leap on every press of 下一跳 (but not on mount)
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    hopRef2.current();
  }, [trigger]);

  // occasional ambient hops, at a lower frequency than the hero
  useEffect(() => {
    const svg = svgRef.current;
    if (!ambient || !svg || prefersReducedMotion()) return;
    let onScreen = false;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(svg);
    let timer = 0;
    const tick = () => {
      if (onScreen && !document.hidden) hopRef2.current();
      timer = window.setTimeout(tick, 14000 + Math.random() * 10000);
    };
    timer = window.setTimeout(tick, 9000 + Math.random() * 6000);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [ambient]);

  const p = perches[0];
  return (
    <svg ref={svgRef} viewBox={viewBox} aria-hidden="true" style={{ ["--fillp" as string]: fill }}>
      {children}
      <g ref={hopRef} transform={`translate(${p.x} ${p.y}) scale(${scale})`} color={ink}>
        <use href="#grasshopper" x="-105" y="-99" width="210" height="110" />
      </g>
    </svg>
  );
}
