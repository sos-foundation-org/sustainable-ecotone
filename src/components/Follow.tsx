import { SITE } from "@/content/site";

/** Opens the "follow future events" Google Form, or shows a graceful pending state while the URL is empty. */
export function FollowButton({ variant = "line" }: { variant?: "line" | "ink" | "text" }) {
  if (SITE.followFormUrl) {
    if (variant === "text") {
      return (
        <a className="txtlink" href={SITE.followFormUrl} target="_blank" rel="noopener noreferrer">
          留下 e-mail <i>Follow</i> <span aria-hidden="true">↗</span>
          <span className="sr-only">（另開新視窗）</span>
        </a>
      );
    }
    return (
      <a className={`btn btn--${variant}`} href={SITE.followFormUrl} target="_blank" rel="noopener noreferrer">
        留下 e-mail <small>FOLLOW · 另開新視窗</small>
        <span className="mani" aria-hidden="true">
          ☞
        </span>
      </a>
    );
  }
  if (variant === "text") {
    return <span className="follow-pending mono">追蹤表單即將開放 · opening soon</span>;
  }
  return (
    <p className={`btn btn--${variant} btn--pending`} role="status">
      追蹤表單即將開放 <small>OPENING SOON</small>
    </p>
  );
}

/** A 水筆仔 propagule — the seed that drifts on the tide until it can root somewhere new. */
function Propagule() {
  return (
    <svg className="seed-art" viewBox="0 0 80 150" aria-hidden="true">
      <path d="M8 118C20 112 30 124 40 118S60 112 72 118" fill="none" stroke="#A8321F" strokeWidth=".9" strokeDasharray="4 3" />
      <path d="M8 128C20 122 30 134 40 128S60 122 72 128M14 138C24 133 34 142 44 137" fill="none" stroke="#1C1A17" strokeWidth=".4" opacity=".5" />
      <g transform="rotate(-14 40 70)">
        <path d="M40 14C36 40 36 96 40.6 120C45 96 45 40 40 14Z" fill="url(#hatch)" stroke="#1C1A17" strokeWidth=".9" />
        <path d="M35.6 16L40 8L44.4 16Z" fill="#FAF6EC" stroke="#1C1A17" strokeWidth=".8" />
        <path d="M40 8V2" stroke="#1C1A17" strokeWidth=".8" />
      </g>
    </svg>
  );
}

/**
 * 追蹤未來活動 — a seed packet. Distinct from the speaker call: this is for
 * people who want to be told when a new volume is announced (e-mail only).
 * `compact` is the slim footer version.
 */
export default function FollowCard({ compact = false, note, headingId = "follow-h" }: { compact?: boolean; note?: string; headingId?: string }) {
  if (compact) {
    return (
      <div className="follow-compact">
        <p>
          <b>追蹤未來活動</b> <i>Follow future volumes</i>
          <br />
          <span className="muted small">新的一冊公布時，第一時間通知你。</span>
        </p>
        <FollowButton variant="text" />
      </div>
    );
  }
  return (
    <aside className="seed-packet" aria-labelledby={headingId}>
      <div className="seed-head mono">
        <span>Semina · 種子袋</span>
        <span>Follow · 追蹤</span>
      </div>
      <div className="seed-body">
        <Propagule />
        <div>
          <h2 id={headingId} className="seed-title">
            追蹤未來活動 <i>Follow future volumes</i>
          </h2>
          <p className="muted">
            {note ?? "水筆仔的胎生苗會隨潮水漂流，等到合適的地方才落地生根。留下你的 e-mail，下一冊公布時（日期、地點、講者），我們會第一時間通知你。"}
          </p>
          <FollowButton />
          <p className="seed-fine mono">只用來寄送活動消息 · 想成為講者，請見「成為講者」</p>
        </div>
      </div>
    </aside>
  );
}
