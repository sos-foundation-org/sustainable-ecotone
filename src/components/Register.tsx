import type { ForumEvent, Session } from "@/content/events";
import { pad2, roman } from "@/lib/engrave";
import type { Lang } from "@/lib/i18n";

// Audience registration. Every session links to its own pre-filled URL of the one
// bilingual participation form (scripts/create-google-forms.gs → createParticipationForm),
// so both languages share the same URLs. An empty URL shows a pending state.
const T = {
  zh: {
    catno: "Registration · 報名",
    title: "場次與報名",
    titleSub: "Sessions",
    nb: "請注意",
    reminder: "要來現場的朋友，請務必填寫報名表。若時間、地點有任何異動，我們只會通知已報名的朋友，以免你錯過，或白跑一趟。",
    session: "Session",
    venue: "Loc. · 地點",
    date: "Date · 日期",
    time: "Time · 時間",
    one: "報名此場",
    oneSmall: "REGISTER",
    both: (n: number) => (n === 2 ? "兩場都報名" : "全部場次都報名"),
    bothSmall: (n: number) => (n === 2 ? "REGISTER FOR BOTH" : "REGISTER FOR ALL"),
    bothPending: (n: number) => (n === 2 ? "兩場都報名，即將開放" : "全部場次都報名，即將開放"),
    newTab: "（另開新視窗）",
    pending: "報名即將開放",
    pendingSmall: "OPENING SOON",
    fine: "同一份報名表可勾選多個場次 · 只用來通知場次異動與活動消息",
  },
  en: {
    catno: "Registration",
    title: "Sessions & registration",
    titleSub: "",
    nb: "Please note",
    reminder: "Planning to come? Please register. If the time or venue changes, we will only be able to tell those who signed up, so you don’t miss it or make a wasted trip.",
    session: "Session",
    venue: "Venue",
    date: "Date",
    time: "Time",
    one: "Register",
    oneSmall: "OPENS IN A NEW TAB",
    both: (n: number) => (n === 2 ? "Register for both" : "Register for all sessions"),
    bothSmall: () => "OPENS IN A NEW TAB",
    bothPending: (n: number) => (n === 2 ? "Register for both: opening soon" : "Register for all sessions: opening soon"),
    newTab: " (opens in a new tab)",
    pending: "Registration opening soon",
    pendingSmall: "",
    fine: "One form, tick as many sessions as you like · Used only for session updates and event news",
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
      <div className="stub-foot">
        <RegisterButton url={s.registerUrl} lang={lang} label={t.one} small={t.oneSmall} />
      </div>
    </li>
  );
}

/** Compact session list for the home page: 臺大場 · 陽明交大場 (with dates once they are known). */
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
          {s.isoDate && <span className="muted"> {s.date[lang]}</span>}
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
          {e.registerAllUrl !== undefined && sessions.length > 1 && (
            <RegisterButton url={e.registerAllUrl} lang={lang} label={t.both(sessions.length)} small={t.bothSmall(sessions.length)} pendingLabel={t.bothPending(sessions.length)} variant="line" />
          )}
          <p className="seed-fine mono">{t.fine}</p>
        </div>
      </div>
    </section>
  );
}
