"use client";

import { useEffect, useRef, useState } from "react";
import { hyphaPath, rng, toPath, walker, type Pt } from "@/lib/mycelium";
import { Fungus } from "./fungi/library";
import type { FungusId } from "@/content/fungi";

type Strand = { d: string; kind: "spine" | "spine-cin" | "branch" | "twig"; delay: number };
type Sprout = { x: number; y: number; species: FungusId; h: number; delay: number };
type Geo = { w: number; h: number; strands: Strand[]; sprouts: Sprout[] };
type Box = { l: number; t: number; r: number; b: number };

/**
 * The mycelium of a field-notes movement. It measures where the photographs actually sit,
 * then grows (seeded, so it is the same on every visit):
 * - a spine in the gutter between the rail and the photos, wandering down past every row,
 * - a branch from the spine to the first frame of each row, and links across the column gap
 *   between frames in the same row (always in gaps, never across captions),
 * - a few free twigs, and small fruiting bodies standing on the top edge of some frames.
 * `braid` adds a second, cinnabar strand twined with the first: the ecotone, where the two meet.
 * Hyphae sit under the frames (the prints hide them); fruit sits on top. Drawn in when the
 * movement scrolls into view; static under prefers-reduced-motion.
 */
export default function FieldHyphae({
  seed,
  braid = false,
  species,
  grid: gridSel = ".fn-grid",
  item: itemSel = ".fn-mount",
  rail: railSel = ".fn-rail",
}: {
  seed: number;
  braid?: boolean;
  species: FungusId[];
  /** selectors inside the parent element: the frames’ grid, each frame, and an optional side rail */
  grid?: string;
  item?: string;
  rail?: string;
}) {
  const under = useRef<SVGSVGElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const el = under.current;
    const move = el?.parentElement;
    const grid = move?.querySelector<HTMLElement>(gridSel);
    const rail = move?.querySelector<HTMLElement>(railSel);
    if (!el || !move || !grid) return;

    let raf = 0;
    const build = () => {
      const box = move.getBoundingClientRect();
      const rel = (r: DOMRect): Box => ({ l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top });
      const g = rel(grid.getBoundingClientRect());
      const railR = rail ? rel(rail.getBoundingClientRect()) : null;
      const mounts = Array.from(grid.querySelectorAll<HTMLElement>(itemSel)).map((m) => rel(m.getBoundingClientRect()));
      if (!mounts.length) return;

      const R = rng(seed);
      const sideBySide = railR !== null && railR.r < g.l - 16;
      const spineX = sideBySide ? (railR.r + g.l) / 2 : g.l - 9;

      // rows: frames whose tops are within 40px of each other
      const rows: Box[][] = [];
      [...mounts].sort((a, b) => a.t - b.t || a.l - b.l).forEach((m) => {
        const row = rows.find((r) => Math.abs(r[0].t - m.t) < 40);
        if (row) row.push(m);
        else rows.push([m]);
      });
      rows.forEach((r) => r.sort((a, b) => a.l - b.l));

      const strands: Strand[] = [];
      const sprouts: Sprout[] = [];
      const spine = (jitter: number, kind: Strand["kind"], delay: number) => {
        const way: Pt[] = [[spineX + jitter, rows[0][0].t + 6]];
        rows.forEach((r) => {
          const mid = (r[0].t + r[0].b) / 2;
          way.push([spineX + jitter + (R() - 0.5) * 10, mid + (R() - 0.5) * 40]);
        });
        const last = rows[rows.length - 1][0];
        way.push([spineX + jitter + (R() - 0.5) * 6, last.b - 4]);
        let pts: Pt[] = [];
        for (let i = 1; i < way.length; i++) pts = pts.concat(hyphaPath(way[i - 1][0], way[i - 1][1], way[i][0], way[i][1], R, 7).slice(i > 1 ? 1 : 0));
        strands.push({ d: toPath(pts), kind, delay });
      };
      spine(0, "spine", 0);
      if (braid) spine(R() > 0.5 ? 5 : -5, "spine-cin", 0.35);

      let delay = 0.6;
      rows.forEach((r) => {
        const first = r[0];
        const y0 = first.t + (first.b - first.t) * (0.3 + R() * 0.4);
        if (first.l - spineX > 12) {
          strands.push({ d: toPath(hyphaPath(spineX, y0 + (R() - 0.5) * 30, first.l + 10, y0, R, 6)), kind: "branch", delay });
        }
        for (let i = 1; i < r.length; i++) {
          const a = r[i - 1];
          const b = r[i];
          const top = Math.max(a.t, b.t) + 20;
          const bot = Math.min(a.b, b.b) - 20;
          if (bot <= top) continue;
          const y1 = top + R() * (bot - top);
          const y2 = top + R() * (bot - top);
          strands.push({ d: toPath(hyphaPath(a.r - 10, y1, b.l + 10, y2, R, 5)), kind: "branch", delay: delay + 0.3 });
        }
        delay += 0.35;
      });

      // free twigs off the spine, into the open margin
      for (let i = 0; i < Math.min(5, rows.length + 2); i++) {
        const row = rows[Math.floor(R() * rows.length)][0];
        const y = row.t + R() * (row.b - row.t);
        const ang = (sideBySide ? Math.PI : Math.PI / 2) + (R() - 0.5) * 1.6;
        strands.push({ d: toPath(walker(spineX, y, ang, 26 + R() * 40, R, 5)), kind: "twig", delay: 1 + R() * 1.2 });
      }

      // fruit on the top edge of every other frame (and always on the last)
      mounts.forEach((m, i) => {
        if (i % 2 === 1 && i !== mounts.length - 1) return;
        const w = m.r - m.l;
        const n = w > 400 ? 2 : 1;
        for (let k = 0; k < n; k++) {
          sprouts.push({
            x: m.l + w * (0.58 + k * 0.08 + R() * 0.06),
            y: m.t + 1,
            species: species[(i + k) % species.length],
            h: 16 + R() * 12 - k * 4,
            delay: 1.4 + i * 0.25 + k * 0.2,
          });
        }
      });

      setGeo({ w: box.width, h: box.height, strands, sprouts });
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(move);
    ro.observe(grid);

    // under reduced motion the CSS never hides the strands, so this only times the draw-in
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGrown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(move);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [seed, braid, species, gridSel, itemSel, railSel]);

  const cls = grown ? " is-grown" : "";
  return (
    <>
      <svg ref={under} className={`fn-hy${cls}`} width={geo?.w ?? 0} height={geo?.h ?? 0} aria-hidden="true" focusable="false">
        {geo?.strands.map((s, i) => (
          <path key={i} className={`fn-hy-${s.kind}`} d={s.d} pathLength={1} style={{ transitionDelay: `${s.delay}s` }} />
        ))}
      </svg>
      <svg className={`fn-fruit${cls}`} width={geo?.w ?? 0} height={geo?.h ?? 0} aria-hidden="true" focusable="false">
        {geo?.sprouts.map((s, i) => (
          <g key={i} className="fn-fruit-g" style={{ transitionDelay: `${s.delay}s` }}>
            <Fungus species={s.species} height={s.h} x={s.x} y={s.y} />
          </g>
        ))}
      </svg>
    </>
  );
}
