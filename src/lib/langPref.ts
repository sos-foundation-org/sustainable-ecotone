// ─── Language preference ─────────────────────────────────────────────────────
// 中文是預設。訪客手動選過語言（「中｜EN」或語言提示框）之後，選擇存在 localStorage，
// 從站外進來時（外部連結、書籤、直接輸入網址）會被帶到他選的語言。
// 國外 IP 的第一次到訪會在中文頁跳出一次「We also have an English version」提示（LangPrompt）。

import type { Lang } from "./i18n";

/** The visitor's manual choice: "zh" | "en". */
export const PREF_KEY = "ecotone-lang";
/** Set once the English-version prompt has been shown and answered or dismissed. */
export const PROMPTED_KEY = "ecotone-lang-prompted";
/** Country code from the IP lookup, cached so it runs once per browser. */
export const GEO_KEY = "ecotone-geo";

export function savePref(lang: Lang) {
  try {
    localStorage.setItem(PREF_KEY, lang);
    localStorage.setItem(PROMPTED_KEY, "1");
  } catch {
    /* storage blocked: the choice simply is not remembered */
  }
}

/**
 * Runs in <head> before first paint: arriving from outside the site with a saved
 * choice that differs from this page's language → replace with the other language.
 * In-site navigation never redirects (the 「中｜EN」 links save the choice first anyway).
 * /lab has no English route, so it is left alone.
 */
export const PREF_REDIRECT_SCRIPT = `try{var p=localStorage.getItem("${PREF_KEY}"),l=location,a=l.pathname,e=a==="/en"||a.indexOf("/en/")===0,r=document.referrer,i=false;try{i=!!r&&new URL(r).origin===l.origin}catch(x){}if(!i&&a.indexOf("/lab")!==0){var t=p==="en"&&!e?"/en"+(a==="/"?"":a):p==="zh"&&e?a.slice(3)||"/":null;if(t)l.replace(t+l.search+l.hash)}}catch(x){}`;
