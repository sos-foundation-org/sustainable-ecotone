import Link from "next/link";
import { CALL_FIELDS, CALL_NAV, SITE } from "@/content/site";

/**
 * The speaker application form button. While SITE.speakerFormUrl is empty it
 * renders a graceful, non-interactive "表單即將開放" state; once filled it
 * opens the Google Form in a new tab.
 */
export function SpeakerFormButton({ variant = "ink" }: { variant?: "ink" | "light" }) {
  if (SITE.speakerFormUrl) {
    return (
      <a className={`btn btn--${variant}`} href={SITE.speakerFormUrl} target="_blank" rel="noopener noreferrer">
        填寫講者表單 <small>APPLY · 另開新視窗</small>
        <span className="mani" aria-hidden="true">
          ☞
        </span>
      </a>
    );
  }
  return (
    <p className={`btn btn--${variant} btn--pending`} role="status">
      表單即將開放 <small>FORM OPENING SOON</small>
    </p>
  );
}

/** Internal link to the call-for-speakers page. */
export function CallLink({ variant = "ink", label = "成為講者" }: { variant?: "ink" | "light" | "text"; label?: string }) {
  if (variant === "text") {
    return (
      <Link className="txtlink" href={CALL_NAV.href}>
        {label} <i>{CALL_NAV.en}</i> <span aria-hidden="true">☞</span>
      </Link>
    );
  }
  return (
    <Link className={`btn btn--${variant}`} href={CALL_NAV.href}>
      {label} <small>CALL FOR SPEAKERS</small>
      <span className="mani" aria-hidden="true">
        ☞
      </span>
    </Link>
  );
}

/**
 * A blank herbarium label: the specimen we have not collected yet. Lists what
 * the speaker form will ask, as empty fields waiting to be filled.
 */
export function BlankLabel({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`blank-label${compact ? " blank-label--compact" : ""}`}>
      <div className="blank-head mono">
        <span>Desiderata · 徵集中的講者</span>
        <span>ECO-S-??</span>
      </div>
      <dl>
        {CALL_FIELDS.map((f) => (
          <div key={f.abbr + f.zh}>
            <dt className="mono">{f.abbr}</dt>
            <dd>
              <span className="blank-line" aria-hidden="true" />
              <span className="blank-hint">
                {f.zh} <i>{f.en}</i>
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="blank-foot mono">det. ＿＿＿＿　·　Vol. ??</p>
    </div>
  );
}
