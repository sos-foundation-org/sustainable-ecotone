"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Lang } from "@/lib/i18n";

const T = {
  zh: { play: "播放", pause: "暫停", soundOn: "開啟聲音", soundOff: "關閉聲音", sound: "聲音" },
  en: { play: "Play", pause: "Pause", soundOn: "Turn sound on", soundOff: "Turn sound off", sound: "Sound" },
} satisfies Record<Lang, unknown>;

/**
 * A short film (10–20 s) in the field notes. Muted, looping, inline; it plays only while at
 * least half of it is on screen and the tab is visible, and pauses otherwise. Under
 * prefers-reduced-motion it never starts by itself: the poster shows with a play button.
 * Sound is opt-in with the toggle.
 */
export default function FieldFilm({ src, poster, w, h, seconds, label, lang }: { src: string; poster: string; w: number; h: number; seconds?: number; label: string; lang: Lang }) {
  const t = T[lang];
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    el.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let inView = false;
    const sync = () => {
      if (inView && !document.hidden && !userPaused.current) el.play().catch(() => {});
      else el.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    }, { threshold: 0.5 });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const toggle = () => {
    const el = v.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };
  const toggleSound = () => {
    const el = v.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted && el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    }
  };
  const dur = seconds ? `0:${String(Math.round(seconds)).padStart(2, "0")}` : null;

  return (
    <div className="fn-mount fn-film" style={{ "--ar": `${w} / ${h}` } as CSSProperties}>
      <video ref={v} src={src} poster={poster} width={w} height={h} muted loop playsInline preload="metadata" aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <span className="fn-film-tag mono" aria-hidden="true">
        Film{dur && ` · ${dur}`}
      </span>
      <div className="fn-film-ctl">
        <button type="button" onClick={toggle} aria-label={playing ? t.pause : t.play}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button type="button" onClick={toggleSound} aria-label={muted ? t.soundOn : t.soundOff} aria-pressed={!muted}>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
            {muted ? <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" /> : <path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" strokeWidth="1.4" />}
          </svg>
          <span className="mono">{t.sound}</span>
        </button>
      </div>
    </div>
  );
}
