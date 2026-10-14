import { CO_ORGANIZERS, ORGS, SHOW_DRAFTS, type OrgKey } from "@/content/site";
import { EVENTS } from "@/content/events";
import { speakerById } from "@/content/speakers";
import type { Lang } from "@/lib/i18n";
import CollectorStamp from "./CollectorStamp";
import OrgLink from "./OrgLink";
import Logo from "./Logo";

// Two deliberately different blocks, never shown as one band:
//  · Co-organizers: the three organisations that run the forum (large stamps + role).
//  · Speakers' affiliations: where the speakers of every volume so far come from (small,
//    quiet list), derived from all events in events.ts, so it grows with each volume.
//    It implies no co-organisation or sponsorship.

const T = {
  zh: {
    coHead: "共同主辦",
    coSub: "Co-organizers",
    coNote: "論壇由這三個單位共同發起與主辦。",
    affHead: "歷屆講者單位",
    affSub: "Speakers’ affiliations",
    affNote: "歷屆講者來自這些單位，不代表合辦或贊助。",
    flag: "暫代",
  },
  en: {
    coHead: "Co-organizers",
    coSub: "",
    coNote: "The forum was founded and is run jointly by these three organisations.",
    affHead: "Speakers’ affiliations",
    affSub: "across all volumes",
    affNote: "Our speakers come from these institutions; this does not imply co-organisation or sponsorship.",
    flag: "Placeholder",
  },
} satisfies Record<Lang, unknown>;

/** Every organisation any speaker of any volume belongs to, oldest volume first, without repeats. */
export const allAffiliations = (): OrgKey[] =>
  [...new Set([...EVENTS].sort((a, b) => a.vol - b.vol).flatMap((e) => e.speakers.flatMap((id) => speakerById(id)?.orgs ?? [])))];

/** Heading + one-line explanation for the co-organizers block (the content below varies by page). */
export function CoOrganizersHead({ lang, id, as: H = "h2" }: { lang: Lang; id: string; as?: "h2" | "h3" }) {
  const t = T[lang];
  return (
    <header className="partners-head">
      <H id={id} className="partners-h">
        {t.coHead} {t.coSub && <i>{t.coSub}</i>}
      </H>
      <p className="muted small">{t.coNote}</p>
    </header>
  );
}

/** Co-organizers as large stamps, each with its role and a short line. */
export function CoOrganizers({ lang, id }: { lang: Lang; id: string }) {
  return (
    <div className="co-organizers">
      <CoOrganizersHead lang={lang} id={id} />
      <ul className="stamps stamps--lg">
        {CO_ORGANIZERS.map(({ key, role, blurb }, i) => (
          <li key={key}>
            <CollectorStamp org={key} tilt={[-6, 4, -2][i]} lang={lang} />
            <b>{ORGS[key].name[lang]}</b>
            <span className="mono role">{role[lang]}</span>
            <span className="muted small">{blurb[lang]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** All speakers' affiliations (cumulative): a small, quiet list, set apart from the co-organizers. */
export function SpeakerAffiliations({ lang, id, logos = true }: { lang: Lang; id: string; logos?: boolean }) {
  const t = T[lang];
  const orgs = allAffiliations();
  if (!orgs.length) return null;
  return (
    <aside className="affiliations" aria-labelledby={id}>
      <h3 id={id} className="affiliations-h">
        {t.affHead} <i>{t.affSub}</i>
      </h3>
      <p className="muted small">{t.affNote}</p>
      <ul className="affil-list">
        {orgs.map((k) => (
          <li key={k}>
            <OrgLink org={k} lang={lang}>
              {logos && ORGS[k].logo && <Logo src={ORGS[k].logo} />}
              {ORGS[k].name[lang]}
              {SHOW_DRAFTS && ORGS[k].placeholder && <span className="flag">{t.flag}</span>}
            </OrgLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
