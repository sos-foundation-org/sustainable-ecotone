"use client";

import { useRef, useState, type ReactNode } from "react";

type Spot = { n: string; x: number; y: number; label: string };

/**
 * A naturalist's hand lens over an engraved plate.
 * - Mouse: the lens follows the pointer.
 * - Touch / keyboard: numbered "spot" buttons place the lens on each item in
 *   the plate key (press again to put the lens away).
 * The overlay re-uses the plate art via <use href="#artId">.
 */
export default function Loupe({ artId, viewBox, zoom = 2.4, spots = [], children }: { artId: string; viewBox: string; zoom?: number; spots?: Spot[]; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const lens = useRef<SVGSVGElement>(null);
  const [spot, setSpot] = useState<string | null>(null);

  const show = (x: number, y: number) => {
    const ov = lens.current;
    if (!ov) return;
    ov.querySelectorAll("[data-lens]").forEach((c) => {
      c.setAttribute("cx", String(x));
      c.setAttribute("cy", String(y));
    });
    ov.querySelector("[data-lens-use]")?.setAttribute("transform", `translate(${x} ${y}) scale(${zoom}) translate(${-x} ${-y})`);
    const t = ov.querySelector("[data-lens-txt]");
    t?.setAttribute("x", String(x));
    t?.setAttribute("y", String(y + 94));
    box.current?.classList.add("lens-on");
  };
  const hide = () => box.current?.classList.remove("lens-on");

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const art = box.current?.querySelector<SVGSVGElement>("svg.art");
    const ctm = art?.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    setSpot(null);
    show(pt.x, pt.y);
  };

  const toggleSpot = (s: Spot) => {
    if (spot === s.n) {
      setSpot(null);
      hide();
    } else {
      setSpot(s.n);
      show(s.x, s.y);
    }
  };

  return (
    <>
      <div
        className="pbox"
        ref={box}
        onPointerMove={onMove}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse" && !spot) hide();
        }}
      >
        {children}
        <svg className="loupe" viewBox={viewBox} ref={lens} aria-hidden="true">
          <defs>
            <clipPath id={`${artId}-lens`}>
              <circle data-lens cx="300" cy="300" r="74" />
            </clipPath>
          </defs>
          <circle data-lens cx="300" cy="300" r="74" fill="#F2ECDF" />
          <g clipPath={`url(#${artId}-lens)`}>
            <use data-lens-use href={`#${artId}`} />
          </g>
          <circle data-lens cx="300" cy="300" r="74" fill="none" stroke="#1C1A17" strokeWidth="1.6" />
          <circle data-lens cx="300" cy="300" r="79" fill="none" stroke="#1C1A17" strokeWidth=".5" />
          <text data-lens-txt x="300" y="394" textAnchor="middle" className="svg-mono" fill="#A8321F">
            × {zoom}
          </text>
        </svg>
      </div>
      {spots.length > 0 && (
        <div className="lens-bar" role="group" aria-label="放大鏡：選擇要放大的部位">
          <span className="mono">
            <span aria-hidden="true">⌕</span> Loupe × {zoom}
          </span>
          {spots.map((s) => (
            <button key={s.n} type="button" aria-pressed={spot === s.n} onClick={() => toggleSpot(s)} title={s.label}>
              {s.n}
              <span className="sr-only">：放大 {s.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
