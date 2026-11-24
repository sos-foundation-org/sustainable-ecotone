"use client";

/* eslint-disable @next/next/no-img-element -- pre-sized WebP with our own srcset */
import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

export type LightboxItem = { src: string; srcSet: string; w: number; h: number; alt: string; fig: number; cue?: string; caption: string };

const T = {
  zh: { label: "現場紀錄照片", prev: "上一張", next: "下一張", close: "關閉" },
  en: { label: "Field notes photograph", prev: "Previous", next: "Next", close: "Close" },
} satisfies Record<Lang, unknown>;

/**
 * Native <dialog> lightbox for the field notes. Any element with `data-fn="<index>"` inside
 * #rootId opens it. Shows the whole (uncropped) frame. Arrow keys / swipe to move, Esc or a
 * click on the dark surround to close; focus returns to the photo that opened it.
 */
export default function FieldLightbox({ rootId, items, lang }: { rootId: string; items: LightboxItem[]; lang: Lang }) {
  const t = T[lang];
  const box = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const startX = useRef<number | null>(null);
  const [i, setI] = useState(0);
  const n = items.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const b = (e.target as Element).closest<HTMLElement>("[data-fn]");
      if (!b) return;
      opener.current = b;
      setI(Number(b.dataset.fn));
      box.current?.showModal();
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [rootId]);

  const close = () => box.current?.close();
  const item = items[i];
  if (!item) return null;

  return (
    <dialog
      ref={box}
      className="fn-box"
      aria-label={t.label}
      onClose={() => opener.current?.focus()}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as Element).classList.contains("fn-box-stage")) close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="fn-box-bar">
        <span className="mono" aria-live="polite">
          Fig. {item.fig} · {i + 1} / {n}
        </span>
        <button type="button" className="fn-box-btn" onClick={close} aria-label={t.close} autoFocus>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>
      <div
        className="fn-box-stage"
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        <img key={item.src} src={item.src} srcSet={item.srcSet} sizes="100vw" width={item.w} height={item.h} alt={item.alt} draggable={false} />
        {n > 1 && (
          <>
            <button type="button" className="fn-box-btn fn-box-prev" onClick={() => go(-1)} aria-label={t.prev}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <button type="button" className="fn-box-btn fn-box-next" onClick={() => go(1)} aria-label={t.next}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </>
        )}
      </div>
      <p className="fn-box-cap">
        {item.cue && <span className="mono">{item.cue}</span>} {item.caption}
      </p>
    </dialog>
  );
}
