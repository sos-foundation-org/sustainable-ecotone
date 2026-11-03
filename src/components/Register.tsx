import type { ForumEvent, Session } from "@/content/events";
import { pad2, roman } from "@/lib/engrave";
import type { Lang } from "@/lib/i18n";

// Audience registration. One button per event opens the bilingual participation form
// (scripts/create-google-forms.gs → createParticipationForm) with 「報名參加活動」 pre-filled;
// visitors tick one or more sessions in the form. An empty URL shows a pending state.
const T = {
  zh: {
    catno: "Registration · 報名",
    title: "場次與報名",
    titleSub: "Sessions",
    nb: "請注意",
    reminder: "誠摯歡迎你來到現場！出發前請記得填寫報名表，若時間或地點有所調整，我們會第一時間通知你。",
    session: "Session",
    venue: "Loc. · 地點",
    date: "Date · 日期",
    time: "Time · 時間",
    one: "報名參加",
    oneSmall: "REGISTER",
    newTab: "（另開新視窗）",
    map: "地圖",
    mapLabel: "Google 地圖",
    pending: "報名即將開放",
    pendingSmall: "OPENING SOON",
  },
  en: {
    catno: "Registration",
    title: "Sessions & registration",
    titleSub: "",
    nb: "Please note",
    reminder: "We would love to see you there. Please take a moment to register, so we can let you know right away if the time or venue changes.",
    session: "Session",
    venue: "Venue",
    date: "Date",
    time: "Time",
    one: "Register",
    oneSmall: "OPENS IN A NEW TAB",
    newTab: " (opens in a new tab)",
    map: "Map",
    mapLabel: "Google Maps",
    pending: "Registration opening soon",
    pendingSmall: "",
  },
} satisfies Record<Lang, unknown>;

/** A registration button: opens the pre-filled form in a new tab, or a pending stub while the URL is empty. */
export function RegisterButton({
  url,
  lang,
  label,
  small,
  pendingLabel,
  variant = "ink",
}: {
  url: string;
  lang: Lang;
  label: string;
  small?: string;
  /** text for the pending state; defaults to 「報名即將開放」 */
  pendingLabel?: string;
  variant?: "ink" | "line";
}) {
  const t = T[lang];
  if (!url) {
    return (
      <p className={`btn btn--${variant} btn--pending`}>
        {pendingLabel ?? t.pending} {t.pendingSmall && <small>{t.pendingSmall}</small>}
      </p>
    );
  }
  return (
    <a className={`btn btn--${variant}`} href={url} target="_blank" rel="noopener noreferrer">
      {label} {small && <small>{small}</small>}
      <span className="mani" aria-hidden="true">
        ☞
      </span>
      <span className="sr-only">{t.newTab}</span>
    </a>
  );
}

/** An engraved map pin: ink teardrop with a little hatching, a cinnabar station dot, and its shadow on the ground. */
function PinGlyph() {
  return (
    <svg className="pin-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20.4c-3.7-4.3-6-7.6-6-10.5a6 6 0 0 1 12 0c0 2.9-2.3 6.2-6 10.5Z" strokeWidth="1.1" />
        <path d="M15.6 6.4l1.4-1.1M16.4 9.2l1.5-1.2M15.9 12.2l1.4-1.1M14.6 15l1.2-1" strokeWidth=".5" />
        <path d="M8.6 21.6c1.1.4 2.2.5 3.4.5s2.3-.1 3.4-.5" strokeWidth=".6" />
      </g>
      <circle cx="12" cy="9.9" r="2.1" fill="#A8321F" />
    </svg>
  );
}

function SessionStub({ s, i, e, lang }: { s: Session; i: number; e: ForumEvent; lang: Lang }) {
  const t = T[lang];
  const zh = lang === "zh";
  const headingId = `session-${s.id}`;
  return (
    <li className="stub" aria-labelledby={headingId}>
      <div className="stub-head mono">
        <span>
          Vol. {pad2(e.vol)} · {t.session} {roman(i + 1)}
        </span>
        <span aria-hidden="true">No. {pad2(i + 1)}</span>
      </div>
      <h3 id={headingId} className="stub-name">
        {s.name[lang]}
        {zh && <i lang="en">{s.name.en}</i>}
      </h3>
      <dl className="stub-facts">
        <div>
          <dt>{t.venue}</dt>
          <dd>
            {s.venue[lang]}
            {s.venueNote && <span className="muted">{s.venueNote[lang]}</span>}
            {s.mapUrl && (
              <a className="stub-map" href={s.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t.mapLabel}${zh ? "：" : ": "}${s.venue[lang]}${t.newTab}`}>
                <PinGlyph />
                <span className="mono">{t.map}</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </dd>
        </div>
        <div>
          <dt>{t.date}</dt>
          <dd>{s.date[lang]}</dd>
        </div>
        {s.time && (
          <div>
            <dt>{t.time}</dt>
            <dd>{s.time[lang]}</dd>
          </div>
        )}
      </dl>
    </li>
  );
}

/** Compact session list for the home page: 臺大場 · 陽明交大場 (with dates, and hours, once they are known). */
export function SessionLine({ e, lang }: { e: ForumEvent; lang: Lang }) {
  const sessions = e.sessions ?? [];
  if (sessions.length === 0) return null;
  return (
    <p className="session-line">
      <span className="mono cin">{lang === "zh" ? "Sessions · 場次" : "Sessions"}</span>{" "}
      {sessions.map((s, i) => (
        <span key={s.id}>
          {i > 0 && <span className="muted"> · </span>}
          {s.name[lang]}
          {s.isoDate && (
            <span className="muted">
              {" "}
              {s.date[lang]}
              {s.start && ` ${s.start}${s.end ? `–${s.end}` : ""}`}
            </span>
          )}
        </span>
      ))}
    </p>
  );
}

/** The registration block on an event page (#register). Renders nothing for events without sessions. */
export default function RegisterBlock({ e, lang }: { e: ForumEvent; lang: Lang }) {
  const sessions = e.sessions ?? [];
  if (sessions.length === 0) return null;
  const t = T[lang];
  return (
    <section className="sec sec--tight register" id="register" aria-labelledby="register-h">
      <div className="wrap">
        <div className="register-head reveal">
          <div>
            <p className="catno mono">
              <span>Vol. {pad2(e.vol)}</span>
              <span>{t.catno}</span>
            </p>
            <h2 id="register-h" className="h-sec">
              {t.title} {t.titleSub && <i>{t.titleSub}</i>}
            </h2>
          </div>
          <p className="register-nb">
            <span className="mono cin">{t.nb}</span>
            {t.reminder}
          </p>
        </div>
        <ol className="stubs reveal">
          {sessions.map((s, i) => (
            <SessionStub key={s.id} s={s} i={i} e={e} lang={lang} />
          ))}
        </ol>
        <div className="register-all reveal">
          <RegisterButton url={e.registerUrl ?? ""} lang={lang} label={t.one} small={t.oneSmall} />
        </div>
      </div>
    </section>
  );
}
