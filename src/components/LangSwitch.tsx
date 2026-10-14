import { HTML_LANG, switchPath, type Lang } from "@/lib/i18n";

const OPTIONS: { lang: Lang; glyph: string; name: string }[] = [
  { lang: "zh", glyph: "中", name: "中文" },
  { lang: "en", glyph: "EN", name: "English" },
];

/**
 * 「中｜EN」: links to the same page in each language (/voices ↔ /en/voices).
 * The current language is marked with aria-current; each link carries its
 * own hreflang and lang so it is announced in its own language. Plain <a>:
 * the two languages live under different root layouts, so this is a full load.
 */
export default function LangSwitch({ lang, pathname }: { lang: Lang; pathname: string }) {
  return (
    <div className="lang-switch" role="group" aria-label={lang === "zh" ? "語言" : "Language"}>
      {OPTIONS.map((o, i) => (
        <span key={o.lang} className="lang-opt">
          {i > 0 && (
            <span className="lang-sep" aria-hidden="true">
              ｜
            </span>
          )}
          <a href={switchPath(pathname, o.lang)} hrefLang={HTML_LANG[o.lang]} lang={HTML_LANG[o.lang]} aria-current={o.lang === lang ? "page" : undefined}>
            <span aria-hidden="true">{o.glyph}</span>
            <span className="sr-only">{o.name}</span>
          </a>
        </span>
      ))}
    </div>
  );
}
