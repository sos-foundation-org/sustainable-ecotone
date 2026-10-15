"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { Lang } from "@/lib/i18n";

export type TipId = "ntu" | "nycu" | "sos" | "eco";
/** box: [x0, y0, x1, y1] and anchor: [x, y], both in viewBox units. Only `focus` spots are tab stops. */
export type Hotspot = { id: TipId; box: [number, number, number, number]; anchor: [number, number]; focus: boolean };

type Open = { id: TipId; spot: number; via: "hover" | "focus" | "tap" } | null;

const EDGE = 8; // keep the tooltip this far from the viewport edges

/**
 * Hotspots laid over the About figure, and the tooltip they open. Each partner
 * has one real <button> (a tab stop, named by its abbreviation and described by
 * the full name), plus hover-only areas over its drawing. Hover opens on a fine
 * pointer, focus opens from the keyboard, tap toggles on touch, Esc closes.
 * The tooltip flips below its anchor near the top of the screen and is clamped
 * horizontally so it never runs off a 375px phone.
 */
export default function PartnerTips({
  spots,
  order,
  labels,
  tips,
  vb,
  lang,
}: {
  spots: Hotspot[];
  order: TipId[];
  labels: Record<TipId, string>;
  tips: Record<TipId, string[]>;
  vb: [number, number];
  lang: Lang;
}) {
  const uid = useId();
  const layer = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<string>("mouse");
  const [open, setOpen] = useState<Open>(null);
  const [pos, setPos] = useState<{ dx: number; below: boolean }>({ dx: 0, below: false });

  const close = useCallback(() => setOpen(null), []);

  // keep the tooltip on screen: flip below near the top, clamp left/right
  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!open || !el) return;
    const mast = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mast-h")) || 0;
    el.style.setProperty("--dx", "0px");
    el.dataset.below = "false";
    let r = el.getBoundingClientRect();
    const below = r.top < mast + EDGE;
    if (below) {
      el.dataset.below = "true";
      r = el.getBoundingClientRect();
    }
    const vw = document.documentElement.clientWidth;
    let dx = 0;
    if (r.left < EDGE) dx = EDGE - r.left;
    else if (r.right > vw - EDGE) dx = vw - EDGE - r.right;
    el.style.setProperty("--dx", `${dx}px`);
    setPos({ dx, below });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (!layer.current?.contains(e.target as Node)) close();
    };
    const onResize = () => close();
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;
  const handlers = (s: Hotspot, i: number) => ({
    onPointerDown: (e: React.PointerEvent) => (lastPointer.current = e.pointerType),
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setOpen({ id: s.id, spot: i, via: "hover" });
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setOpen((o) => (o?.via === "hover" ? null : o));
    },
    onClick: (e: React.MouseEvent) => {
      // keyboard activation (detail 0) and touch / pen taps toggle; a mouse click leaves the hover tip alone
      if (e.detail !== 0 && lastPointer.current === "mouse") return;
      setOpen((o) => (o?.id === s.id && o.spot === i ? null : { id: s.id, spot: i, via: "tap" }));
      lastPointer.current = "mouse";
    },
  });

  const cur = open ? spots[open.spot] : null;
  const tipStyle = cur
    ? ({ left: pct(cur.anchor[0], vb[0]), top: pct(cur.anchor[1], vb[1]), "--dx": `${pos.dx}px` } as CSSProperties)
    : undefined;

  return (
    <div className="pmf-layer" ref={layer}>
      {spots.map((s, i) => {
        const style: CSSProperties = {
          left: pct(s.box[0], vb[0]),
          top: pct(s.box[1], vb[1]),
          width: pct(s.box[2] - s.box[0], vb[0]),
          height: pct(s.box[3] - s.box[1], vb[1]),
        };
        const on = open?.id === s.id;
        return s.focus ? (
          <button
            key={i}
            type="button"
            className={`pmf-spot pmf-spot--key${on ? " is-on" : ""}`}
            style={style}
            aria-label={labels[s.id]}
            aria-describedby={`${uid}-${s.id}`}
            aria-expanded={on}
            onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOpen({ id: s.id, spot: i, via: "focus" })}
            onBlur={() => setOpen((o) => (o?.via === "focus" || o?.via === "tap" ? null : o))}
            {...handlers(s, i)}
          />
        ) : (
          <span key={i} className={`pmf-spot${on ? " is-on" : ""}`} style={style} aria-hidden="true" {...handlers(s, i)} />
        );
      })}
      {/* full names for assistive tech, always present for aria-describedby */}
      {order.map((id) => (
        <span key={id} id={`${uid}-${id}`} className="sr-only">
          {tips[id].join(lang === "zh" ? "，" : ", ")}
        </span>
      ))}
      {open && cur && (
        <div ref={tipRef} className="pmf-tip" style={tipStyle} data-below={pos.below} aria-hidden="true">
          {tips[open.id].map((line, k) => (
            <span key={k} className={k ? "pmf-tip-sub" : undefined} lang={/^[\x00-\x7F]*$/.test(line) ? "en" : "zh-Hant-TW"}>
              {line}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
