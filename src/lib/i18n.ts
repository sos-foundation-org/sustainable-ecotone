// ─── Languages ───────────────────────────────────────────────────────────────
// 中文在原網址（/、/events…），英文在 /en 底下（/en、/en/events…）。
// 內容資料的可翻譯欄位一律寫成 { zh, en }（型別 L10n），用 pick(lang, x) 取值。

export type Lang = "zh" | "en";
export const LANGS: Lang[] = ["zh", "en"];

/** A translatable value: one entry per language. */
export type L10n<T = string> = Record<Lang, T>;

/** Read a translatable value in the given language. */
export const pick = <T>(lang: Lang, v: L10n<T>): T => v[lang];

/** `<html lang>` and hreflang codes. */
export const HTML_LANG: Record<Lang, string> = { zh: "zh-Hant-TW", en: "en" };
export const OG_LOCALE: Record<Lang, string> = { zh: "zh_TW", en: "en_US" };

const EN_PREFIX = "/en";

/** "/events" → "/en/events" for English; Chinese paths are unchanged. Pure "#hash" links stay as they are. */
export function localePath(lang: Lang, path: string): string {
  if (lang === "zh" || path.startsWith("#")) return path;
  if (path === "/") return EN_PREFIX;
  if (path.startsWith("/#")) return EN_PREFIX + path.slice(1);
  return EN_PREFIX + path;
}

/** Split a pathname into its language and the language-neutral path ("/en/voices" → en, "/voices"). */
export function splitPath(pathname: string): { lang: Lang; path: string } {
  if (pathname === EN_PREFIX || pathname.startsWith(EN_PREFIX + "/")) {
    return { lang: "en", path: pathname.slice(EN_PREFIX.length) || "/" };
  }
  return { lang: "zh", path: pathname || "/" };
}

/** The same page in the other language: "/voices" ↔ "/en/voices", "/events/x" ↔ "/en/events/x". */
export const switchPath = (pathname: string, to: Lang) => localePath(to, splitPath(pathname).path);
