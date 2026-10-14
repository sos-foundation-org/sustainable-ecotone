import Link from "next/link";
import { CALL_FIELDS, CALL_NAV, SITE } from "@/content/site";
import { localePath, type Lang } from "@/lib/i18n";

// The speaker form is bilingual already: both languages link to the same SITE.speakerFormUrl.
const T = {
  zh: { apply: "填寫講者表單", applySmall: "APPLY · 另開新視窗", pending: "表單即將開放", wanted: "Desiderata · 徵集中的講者" },
  en: { apply: "Apply to speak", applySmall: "OPENS IN A NEW TAB", pending: "Form opening soon", wanted: "Desiderata · Speakers wanted" },
} satisfies Record<Lang, unknown>;

/**
 * The speaker application form button. While SITE.speakerFormUrl is empty it
 * renders a graceful, non-interactive "表單即將開放" state; once filled it
 * opens the Google Form in a new tab.
 */
export function SpeakerFormButton({ variant = "ink", lang = "zh" }: { variant?: "ink" | "light"; lang?: Lang }) {
  const t = T[lang];
  if (SITE.speakerFormUrl) {
    return (
      <a className={`btn btn--${variant}`} href={SITE.speakerFormUrl} target="_blank" rel="noopener noreferrer">
        {t.apply} <small>{t.applySmall}</small>
        <span className="mani" aria-hidden="true">
          ☞
        </span>
      </a>
    );
  }
  return (
    <p className={`btn btn--${variant} btn--pending`} role="status">
      {t.pending} <small>FORM OPENING SOON</small>
    </p>
  );
}

/** Internal link to the call-for-speakers page (in the page's own language). */
export function CallLink({ variant = "ink", label, lang = "zh" }: { variant?: "ink" | "light" | "text"; label?: string; lang?: Lang }) {
  const href = localePath(lang, CALL_NAV.href);
  if (variant === "text") {
    return (
      <Link className="txtlink" href={href}>
        {lang === "zh" ? (
          <>
            {label ?? CALL_NAV.label.zh} <i>{CALL_NAV.sub.zh}</i>
          </>
        ) : (
          (label ?? CALL_NAV.sub.en)
        )}{" "}
        <span aria-hidden="true">☞</span>
      </Link>
    );
  }
  return (
    <Link className={`btn btn--${variant}`} href={href}>
      {label ?? CALL_NAV.label[lang]} <small>CALL FOR SPEAKERS</small>
      <span className="mani" aria-hidden="true">
        ☞
      </span>
    </Link>
  );
}

/**
 * A blank herbarium label waiting to be filled in. Lists what the speaker form
 * will ask, as empty fields.
 */
export function BlankLabel({ compact = false, lang = "zh" }: { compact?: boolean; lang?: Lang }) {
  return (
    <div className={`blank-label${compact ? " blank-label--compact" : ""}`}>
      <div className="blank-head mono">
        <span>{T[lang].wanted}</span>
        <span>ECO-S-??</span>
      </div>
      <dl>
        {CALL_FIELDS.map((f) => (
          <div key={f.abbr}>
            <dt className="mono">{f.abbr}</dt>
            <dd>
              <span className="blank-line" aria-hidden="true" />
              <span className="blank-hint">
                {lang === "zh" ? (
                  <>
                    {f.label.zh} <i>{f.label.en}</i>
                  </>
                ) : (
                  f.label.en
                )}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="blank-foot mono">{lang === "zh" ? "det. ＿＿＿＿　·　Vol. ??" : "det. ________ · Vol. ??"}</p>
    </div>
  );
}
