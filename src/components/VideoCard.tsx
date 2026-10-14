"use client";

/* eslint-disable @next/next/no-img-element -- remote YouTube thumbnail / static poster */
import { useEffect, useState } from "react";
import type { Voice } from "@/content/voices";
import { fmtCoord } from "@/lib/engrave";

function useClock(tz?: string) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    if (!tz) return;
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setNow(fmt.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 30000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [tz]);
  return now;
}

/** Taipei's local time, for the line every voice is measured against. */
export function TaipeiClock() {
  return <b>{useClock("Asia/Taipei") ?? "--:--"}</b>;
}

/**
 * A voice as a porthole on the song line: coordinates, a live local clock
 * beside Taipei's, the prompt it answers, and a click-to-load video (no
 * third-party iframe until play — then the porthole opens into a 16:9 frame).
 */
export default function VideoCard({ v, sheet }: { v: Voice; sheet: number }) {
  const [playing, setPlaying] = useState(false);
  const local = useClock(v.tz);
  const taipei = useClock(v.tz ? "Asia/Taipei" : undefined);
  const ready = Boolean(v.youtubeId || v.src);
  const poster = v.poster ?? (v.youtubeId ? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg` : undefined);

  let media;
  if (playing && v.youtubeId) {
    media = (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
        title={`${v.name} — ${v.prompt}`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  } else if (playing && v.src) {
    media = <video src={v.src} poster={v.poster} controls autoPlay playsInline />;
  }

  return (
    <article className={`port reveal${playing ? " is-playing" : ""}`}>
      {media ? (
        <div className="port-frame">{media}</div>
      ) : (
        <div className="port-hole">
          {poster ? (
            <img className="port-img" src={poster} alt="" loading="lazy" />
          ) : (
            <svg className="port-rose" viewBox="-60 -60 120 120" aria-hidden="true">
              <circle r="44" fill="none" stroke="currentColor" strokeWidth=".6" />
              <path d="M0-50L5 0 0 50-5 0Z" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth=".6" />
              <path d="M-50 0L0 5 50 0 0-5Z" fill="none" stroke="currentColor" strokeWidth=".6" />
            </svg>
          )}
          {ready ? (
            <button type="button" className="port-play" onClick={() => setPlaying(true)} aria-label={`播放：${v.name}「${v.prompt}」`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          ) : (
            <span className="port-soon">影片即將上線</span>
          )}
        </div>
      )}
      <p className="port-head mono">
        <span className="port-sheet">Sheet {String(sheet).padStart(2, "0")}</span>
        <span>{v.lat !== undefined && v.lng !== undefined ? `${v.approx ? "≈ " : ""}${fmtCoord(v.lat, v.lng)}` : "Loc. TBA"}</span>
      </p>
      <p className="port-city">{v.location}</p>
      {v.tz && (
        <p className="port-clock mono" aria-label={`當地時間 ${local ?? ""}，臺北時間 ${taipei ?? ""}`}>
          {local ?? "--:--"} 當地 · {taipei ?? "--:--"} 臺北
        </p>
      )}
      <p className="port-q">「{v.prompt}」</p>
      <h3 className="port-who">
        {v.name} <span>· {v.role}</span>
      </h3>
    </article>
  );
}
