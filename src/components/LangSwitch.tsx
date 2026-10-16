import { HTML_LANG, switchPath, type Lang } from "@/lib/i18n";
import { savePref } from "@/lib/langPref";

const OPTIONS: { lang: Lang; glyph: string; name: string }[] = [
  { lang: "zh", glyph: "中", name: "中文" },
  { lang: "en", glyph: "EN", name: "English" },
];

/** A small engraved globe: equator, two meridians. Marks the switch as "language" at a glance. */
function Globe() {
  return (
    <svg className="lang-globe" width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth=".9">
        <circle cx="8" cy="8" r="6.6" />
        <ellipse cx="8" cy="8" rx="2.9" ry="6.6" />
        <path d="M1.4 8h13.2M2.6 4.6h10.8M2.6 11.4h10.8" strokeWidth=".6" />
      </g>
    </svg>
  );
}

/**
 * 「中｜EN」: links to the same page in each language (/voices ↔ /en/voices).
 * Lives in the masthead row itself, so it is visible at every width (not tucked
 * into the mobile menu). The current language is marked with aria-current; each
 * link carries its own hreflang and lang so it is announced in its own language.
 * Clicking saves the choice (lib/langPref). Plain <a>: the two languages live
 * under different root layouts, so this is a full load.
 */
export default function LangSwitch({ lang, pathname }: { lang: Lang; pathname: string }) {
  return (
    <div className="lang-switch" role="group" aria-label={lang === "zh" ? "語言 Language" : "Language 語言"}>
      <Globe />
      {OPTIONS.map((o, i) => (
        <span key={o.lang} className="lang-opt">
          {i > 0 && (
            <span className="lang-sep" aria-hidden="true">
              ｜
            </span>
          )}
          <a
            href={switchPath(pathname, o.lang)}
            hrefLang={HTML_LANG[o.lang]}
            lang={HTML_LANG[o.lang]}
            aria-current={o.lang === lang ? "page" : undefined}
            onClick={() => savePref(o.lang)}
          >
            <span aria-hidden="true">{o.glyph}</span>
            <span className="sr-only">{o.name}</span>
          </a>
        </span>
      ))}
    </div>
  );
}
