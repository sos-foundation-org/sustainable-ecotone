// ─── One species, one leap ───────────────────────────────────────────────────
// Every grasshopper on the site (home hero, the 下一跳 panels, the mangrove
// plate) jumps with this: crouch → launch → airborne arc → landing squash.
// Frames are in screen coordinates (y grows downward). Under reduced motion
// the grasshopper simply relocates.

export type LeapFrame = { x: number; y: number; rot: number; squash: number; kick: number; flip: boolean };

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function leap(o: {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** arc height in px above the straight line */
  peak: number;
  /** airborne time in ms */
  dur?: number;
  onFrame: (f: LeapFrame) => void;
  onDone?: () => void;
}) {
  const { x0, y0, x1, y1, peak, onFrame, onDone } = o;
  const dur = o.dur ?? 800;
  const flip = x1 < x0;
  const dir = flip ? -1 : 1;
  if (prefersReducedMotion()) {
    onFrame({ x: x1, y: y1, rot: 0, squash: 1, kick: 0, flip });
    onDone?.();
    return () => {};
  }
  const crouch = 160;
  const land = 140;
  const st = performance.now();
  let raf = 0;
  const step = (now: number) => {
    const e = now - st;
    if (e < crouch) {
      // crouch: the body sinks and tips forward, hind legs fold tighter
      const c = Math.sin((e / crouch) * Math.PI * 0.5);
      onFrame({ x: x0, y: y0, rot: dir * -4 * c, squash: 1 - 0.14 * c, kick: -8 * c, flip });
    } else if (e < crouch + dur) {
      // launch and flight: legs snap straight, then trail; nose up, then down
      const t = (e - crouch) / dur;
      const k = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      onFrame({ x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k - peak * 4 * t * (1 - t), rot: dir * (-24 + 48 * t), squash: t < 0.12 ? 1.08 : 1, kick: t < 0.3 ? 60 : 18, flip });
    } else if (e < crouch + dur + land) {
      // landing: a small squash as it takes the weight
      const t = (e - crouch - dur) / land;
      onFrame({ x: x1, y: y1, rot: 0, squash: 1 - 0.12 * Math.sin(t * Math.PI), kick: 0, flip });
    } else {
      onFrame({ x: x1, y: y1, rot: 0, squash: 1, kick: 0, flip });
      onDone?.();
      return;
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
