/* eslint-disable @next/next/no-img-element -- speaker photos are plain static files */
import { useId } from "react";
import type { Member } from "@/content/speakers";

// A speaker that is a three-person team: three habitats, and cinnabar boundaries between them
// (the ecotone motif). Photos stay in full colour, like every speaker photo (no greyscale, no sepia).
//
// TrioPortrait: the 4:5 mounted window split into three panes by slightly oblique boundaries
//   (top at 36% / 70%, bottom at 30% / 64%), numbered i / ii / iii like a plate key.
// TrioAvatar: the round atlas avatar cut into three 120° sectors meeting at one point.
//
// Each face is placed from Member.focus (fractions of its photo), zoomed, and clamped so the photo
// always covers its pane or sector.

export const ROMAN = ["i", "ii", "iii"];

/** Boundaries of the portrait panes, as fractions of the frame width: [top, bottom]. */
const CUTS: [number, number][] = [
  [0.36, 0.3],
  [0.7, 0.64],
];
const PANES: { poly: string; xMin: number; xMax: number }[] = [
  { poly: "0 0, 36% 0, 30% 100%, 0 100%", xMin: 0, xMax: 0.36 },
  { poly: "36% 0, 70% 0, 64% 100%, 30% 100%", xMin: 0.3, xMax: 0.7 },
  { poly: "70% 0, 100% 0, 100% 100%, 64% 100%", xMin: 0.64, xMax: 1 },
];
const FACE_Y = 0.28; // faces line up at 28% of the frame height
const ZOOM = 1; // no enlargement: each photo at its own scale, so small faces are fine and nothing is upscaled

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const focusOf = (m: Face): [number, number] => m.focus ?? [0.5, 0.3];

/** All an avatar needs: photo and face position, no names (the atlas data stays anonymous). */
export type Face = Pick<Member, "photo" | "focus">;
export const faces = (members?: Member[]): Face[] | undefined => members?.map(({ photo, focus }) => ({ photo, focus }));

/** True when a speaker's members can be drawn as a trio (exactly three, each with a photo). */
export const isTrio = <M extends Face>(members?: M[]): members is M[] => !!members && members.length === 3 && members.every((m) => m.photo);

export function TrioPortrait({ members, label, numerals = true }: { members: Member[]; label: string; numerals?: boolean }) {
  return (
    <div className="trio" role="img" aria-label={label}>
      {members.map((m, i) => {
        const [fx, fy] = focusOf(m);
        const pane = PANES[i];
        // pane centre at face height, between its two (oblique) boundaries
        const cx = (pane.xMin + pane.xMax) / 2 + (i === 0 ? -0.01 : i === 2 ? 0.01 : 0);
        const left = clamp(cx - fx * ZOOM, pane.xMax - ZOOM, pane.xMin);
        const top = clamp(FACE_Y - fy * ZOOM, 1 - ZOOM, 0);
        return (
          <div className="trio-pane" key={i} style={{ clipPath: `polygon(${pane.poly})` }}>
            <img src={m.photo} alt="" style={{ left: `${left * 100}%`, top: `${top * 100}%`, width: `${ZOOM * 100}%`, height: `${ZOOM * 100}%` }} />
          </div>
        );
      })}
      <svg className="trio-cuts" viewBox="0 0 100 125" preserveAspectRatio="none" aria-hidden="true">
        {CUTS.map(([t, b]) => (
          <line key={t} x1={t * 100} y1="0" x2={b * 100} y2="125" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {numerals && (
        <span className="trio-nums" aria-hidden="true">
          {ROMAN.map((r, i) => (
            <span key={r} style={{ left: `${((PANES[i].xMin + PANES[i].xMax) / 2 - 0.03) * 100}%` }}>
              {r}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

// The avatar: three sectors on a 34-unit circle, cuts at 90° (down), 210° and 330°.
const R = 17;
const rim = (deg: number) => [R + R * Math.cos((deg * Math.PI) / 180), R + R * Math.sin((deg * Math.PI) / 180)].map((n) => +n.toFixed(2));
const [L210, L330, L90] = [rim(210), rim(330), rim(90)];
const SECTORS: { d: string; c: [number, number]; box: [number, number, number, number] }[] = [
  // top (i), right-bottom (ii), left-bottom (iii): read clockwise
  { d: `M${R} ${R}L${L210}A${R} ${R} 0 0 1 ${L330}Z`, c: [R, 9.6], box: [L210[0], 0, L330[0], R] },
  { d: `M${R} ${R}L${L330}A${R} ${R} 0 0 1 ${L90}Z`, c: [23.4, 20.6], box: [R, L330[1], 2 * R, 2 * R] },
  { d: `M${R} ${R}L${L90}A${R} ${R} 0 0 1 ${L210}Z`, c: [10.6, 20.6], box: [0, L210[1], R, 2 * R] },
];
const AV_W = 34; // each photo drawn at the width of the circle, 4:5 (no enlargement)

export function TrioAvatar({ members, className = "" }: { members: Face[]; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const h = AV_W * 1.25;
  return (
    <svg className={`trio-avatar ${className}`} viewBox="0 0 34 34" aria-hidden="true">
      <defs>
        {SECTORS.map((s, i) => (
          <clipPath id={`${uid}-s${i}`} key={i}>
            <path d={s.d} />
          </clipPath>
        ))}
      </defs>
      {members.map((m, i) => {
        const [fx, fy] = focusOf(m);
        const { c, box } = SECTORS[i];
        const x = clamp(c[0] - fx * AV_W, box[2] - AV_W, box[0]);
        const y = clamp(c[1] - fy * h, box[3] - h, box[1]);
        return (
          <image key={i} href={m.photo} x={x.toFixed(2)} y={y.toFixed(2)} width={AV_W} height={h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}-s${i})`} />
        );
      })}
      <g className="trio-avatar-cuts">
        {[L90, L210, L330].map((p) => (
          <line key={p.join()} x1={R} y1={R} x2={p[0]} y2={p[1]} />
        ))}
        <circle cx={R} cy={R} r="1.1" />
      </g>
      <circle className="trio-avatar-rim" cx={R} cy={R} r={R - 0.5} />
    </svg>
  );
}
