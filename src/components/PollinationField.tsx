"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#2E9C9A", "#E0B63E", "#5FA58B", "#7fb4d4", "#eef2f1"];
const LINK_DIST = 130;

type P = { x: number; y: number; vx: number; vy: number; r: number; c: string };

/** Drifting "pollen" particles; only differently-coloured particles connect — cross-pollination. The pointer acts as a pollinator. */
export default function PollinationField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let pts: P[] = [];
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, (w * h) / 14000));
      pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        c: COLORS[i % COLORS.length],
      }));
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };

    const tick = () => {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const pdx = pointer.x - p.x;
          const pdy = pointer.y - p.y;
          const pd = Math.hypot(pdx, pdy);
          if (pd < 180 && pd > 1) {
            p.vx += (pdx / pd) * 0.004;
            p.vy += (pdy / pd) * 0.004;
          }
          // keep a gentle baseline drift without letting the pointer pump energy in forever
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 0.6) {
            p.vx *= 0.97;
            p.vy *= 0.97;
          }
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          for (let j = i + 1; j < pts.length; j++) {
            const q = pts[j];
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < LINK_DIST && p.c !== q.c) {
              ctx.strokeStyle = `rgba(224,182,62,${(1 - d / LINK_DIST) * 0.22})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 0.75;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    tick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
