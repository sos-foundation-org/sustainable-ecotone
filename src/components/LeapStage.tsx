"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { leap, prefersReducedMotion } from "@/lib/leap";
import { announce, registerPrey, RESPAWN, SNATCHED } from "@/lib/prey";

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
  prey = false,
  children,
}: {
  trigger: number;
  perches?: [Perch, Perch];
  scale?: number;
  viewBox?: string;
  ink?: string;
  fill?: string;
  ambient?: boolean;
  /** offer this grasshopper to the frog figure (lib/prey) */
  prey?: boolean;
  children?: ReactNode;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hopRef = useRef<SVGGElement>(null);
  const at = useRef(0);
  const busy = useRef(false);
  const first = useRef(true);
  const gone = useRef(false);
  const respawnTimer = useRef(0);

  const place = (x: number, y: number, rot = 0, flip = false, squash = 1, kick = 0) => {
    const g = hopRef.current;
    if (!g) return;
    g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${(flip ? -scale : scale).toFixed(3)} ${(scale * squash).toFixed(3)})`);
    g.style.setProperty("--kick", `${kick}deg`);
  };

  // a new grasshopper after the frog took the last one: a slow fade-in with a slight settle,
  // or at once when the button is pressed meanwhile
  const respawn = (immediate: boolean) => {
    const g = hopRef.current;
    window.clearTimeout(respawnTimer.current);
    if (!g || !gone.current) return;
    gone.current = false;
    const P = perches[at.current];
    g.style.visibility = "visible";
    if (immediate || prefersReducedMotion()) {
      g.style.transition = "none";
      g.style.opacity = "1";
      place(P.x, P.y);
    } else {
      g.style.transition = "none";
      g.style.opacity = "0";
      place(P.x, P.y - 5);
      const st = performance.now();
      const settle = (now: number) => {
        const t = Math.min(1, (now - st) / 1700);
        g.style.opacity = String(t * t * (3 - 2 * t));
        place(P.x, P.y - 5 * (1 - t) * (1 - t));
        if (t < 1 && !gone.current) requestAnimationFrame(settle);
      };
      requestAnimationFrame(settle);
    }
    announce(RESPAWN);
  };

  const hop = () => {
    if (gone.current) respawn(true);
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

  // offer the grasshopper to the frog (only while it sits still, on screen, in a visible tab)
  useEffect(() => {
    const svg = svgRef.current;
    if (!prey || !svg || prefersReducedMotion()) return;
    let onScreen = false;
    const io = new IntersectionObserver(([e]) => (onScreen = e.intersectionRatio > 0.6), { threshold: [0, 0.6, 1] });
    io.observe(svg);
    const off = registerPrey({
      available: () => onScreen && !document.hidden && !busy.current && !gone.current,
      rect: () => hopRef.current?.getBoundingClientRect() ?? null,
      ink,
      fill,
      snatch: () => {
        const g = hopRef.current;
        if (!g) return;
        gone.current = true;
        g.style.visibility = "hidden";
        announce(SNATCHED);
        respawnTimer.current = window.setTimeout(() => respawn(false), 1000);
      },
    });
    return () => {
      off();
      io.disconnect();
      window.clearTimeout(respawnTimer.current);
    };
    // respawn reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prey, ink, fill]);

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
