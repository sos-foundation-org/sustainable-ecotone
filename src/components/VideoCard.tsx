"use client";

/* eslint-disable @next/next/no-img-element -- remote YouTube thumbnail */
import { useState } from "react";
import type { Voice } from "@/content/voices";

/** Click-to-load video: no third-party iframe is loaded until the viewer presses play. */
export default function VideoCard({ v }: { v: Voice }) {
  const [playing, setPlaying] = useState(false);
  const ready = Boolean(v.youtubeId || v.src);
  const interactive = ready && !playing;

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
    media = <video src={v.src} controls autoPlay playsInline />;
  } else {
    media = (
      <>
        {v.youtubeId && <img className="thumb" src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />}
        <span className="play" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        {!ready && <span className="soon">Video coming soon · 影片即將上線</span>}
      </>
    );
  }

  return (
    <article className="video-card reveal">
      <div
        className={`video-frame${ready ? " is-ready" : ""}`}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? `播放：${v.name}` : undefined}
        onClick={() => interactive && setPlaying(true)}
        onKeyDown={(e) => {
          if (interactive && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setPlaying(true);
          }
        }}
      >
        {media}
      </div>
      <div className="video-meta">
        <div className="loc">{v.location}</div>
        <h3>{v.name}</h3>
        <p className="muted" style={{ marginBottom: ".4rem" }}>
          {v.role}
        </p>
        <p>「{v.prompt}」</p>
      </div>
    </article>
  );
}
