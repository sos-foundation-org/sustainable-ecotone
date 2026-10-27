import Link from "next/link";
import { Fungus } from "@/components/fungi/library";
import { PageTitle, PlateHead } from "@/components/Typography";
import WaterlineHeading from "@/components/WaterlineHeading";
import { PlateEdge } from "@/components/Dividers";
import SpecimenSheet from "@/components/Specimen";
import CrossingAtlas from "@/components/CrossingAtlas";
import { CallLink } from "@/components/SpeakerCall";
import { pastEvents, upcomingEvents } from "@/content/events";
import { speakerById } from "@/content/speakers";
import { DISCIPLINES } from "@/content/disciplines";
import { pad2, roman } from "@/lib/engrave";
import { localePath, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { faces } from "@/components/Trio";

export function speakersMetadata(lang: Lang) {
  return pageMetadata({
    lang,
    path: "/speakers",
    ...(lang === "zh"
      ? { title: "歷屆講者", description: "Ecotone 兼容並續的歷屆講者名錄，持續增補中。每一冊論壇結束後，該冊的講者會自動收錄在這裡。" }
      : {
          title: "Past Speakers",
          description: "The register of everyone who has spoken at Ecotone, growing with every volume. Once a forum has taken place, its speakers are added here automatically.",
        }),
  });
}

/** An empty, waiting herbarium mount: tape, an empty photo window, ghost fungi, a blank label. */
function EmptyMount({ lang }: { lang: Lang }) {
  const zh = lang === "zh";
  return (
    <svg className="empty-mount" viewBox="0 0 560 380" role="img" aria-labelledby="em-t">
      <title id="em-t">
        {zh
          ? "一張空白的台紙：照片的位置、菌絲與子實體都還只是虛線，標籤也還沒有填寫。"
          : "A blank mounting sheet: the portrait window, the mycelium and the fruiting bodies are only dotted outlines, and the label has yet to be filled in."}
      </title>
      <rect x="20" y="16" width="520" height="348" fill="#FBF8F1" stroke="#1C1A17" strokeWidth="1" />
      <rect x="32" y="28" width="520" height="348" fill="none" stroke="#1C1A17" strokeWidth=".5" opacity=".35" />
      {[
        [60, 40, -8],
        [212, 40, 7],
        [60, 236, 6],
        [212, 236, -5],
      ].map(([x, y, r], i) => (
        <rect key={i} x={x} y={y} width="56" height="16" fill="rgba(232,223,203,.95)" stroke="rgba(94,81,65,.4)" strokeWidth=".5" transform={`rotate(${r} ${x + 28} ${y + 8})`} />
      ))}
      <rect x="72" y="52" width="180" height="192" fill="none" stroke="#1C1A17" strokeWidth=".8" strokeDasharray="4 4" />
      <text x="162" y="144" textAnchor="middle" className="svg-mono" fill="#5E5141">
        PORTRAIT
      </text>
      <text x="162" y="164" textAnchor="middle" className={zh ? "svg-zh" : "svg-italic svg-italic--lg"} fill="#5E5141">
        {zh ? "講者肖像 · 待補" : "to come"}
      </text>
      <path d="M290 230C330 226 380 234 430 230S500 226 520 230" fill="none" stroke="#1C1A17" strokeWidth=".8" />
      <g opacity=".28" color="#1C1A17">
        <Fungus species="coprinus" height={62} x={332} y={230} />
        <Fungus species="amanita" height={64} x={398} y={230} />
        <Fungus species="morchella" height={52} x={462} y={230} />
      </g>
      <path d="M332 232C340 256 372 262 398 248S452 262 466 240M398 248C400 262 392 276 380 284" fill="none" stroke="#1C1A17" strokeWidth=".6" strokeDasharray="2 3" />
      <g transform="translate(300 286)">
        <rect width="220" height="62" fill="#FAF6EC" stroke="#1C1A17" strokeWidth=".9" />
        <text x="10" y="16" className="svg-mono svg-mono--xs" fill="#A8321F">
          COLL. · ECO-S-??
        </text>
        <path d="M10 32h200M10 46h150" stroke="#1C1A17" strokeWidth=".5" strokeDasharray="1 3" />
        <text x="210" y="56" textAnchor="end" className="svg-mono svg-mono--xs" fill="#5E5141">
          {zh ? "det. ＿＿＿＿" : "det. ________"}
        </text>
      </g>
      <g transform="translate(72 266)">
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={i * 4.4} y="0" width={i % 3 ? 1.2 : 2.2} height="18" fill="#1C1A17" opacity=".18" />
        ))}
        <text x="0" y="30" className="svg-mono svg-mono--xs" fill="#5E5141">
          ECO-S-01 → ∞
        </text>
      </g>
    </svg>
  );
}

export default function SpeakersPage({ lang }: { lang: Lang }) {
  const zh = lang === "zh";
  const href = (p: string) => localePath(lang, p);
  const past = pastEvents().sort((a, b) => b.vol - a.vol);
  const archived = past.flatMap((e) => e.speakers.map(speakerById).filter((s) => s !== undefined).map((s) => ({ s, e })));
  const pending = upcomingEvents().sort((a, b) => a.vol - b.vol)[0];
  const pendingLineup = pending ? pending.speakers.map(speakerById).filter((s) => s !== undefined) : [];

  return (
    <>
      <PageTitle
        catalog={[zh ? "Past Speakers · 歷屆講者" : "Past Speakers", "Herbarium", `${archived.length} speakers archived`]}
        title={zh ? "歷屆講者" : "Past Speakers"}
        en={zh ? "An herbarium of everyone who has spoken at Ecotone" : "A growing register of everyone who has spoken at Ecotone"}
        lead={
          <p>
            {zh
              ? "每一冊論壇結束後，那一冊的講者會帶著他們所有的身份，被正式收錄進這份名錄。這裡會隨著論壇一冊一冊長大，成為一份跨學科、也跨越各種邊界的名錄。"
              : "After each volume, its speakers are formally added to this register, together with all of their identities. It will grow volume by volume into a record that crosses disciplines, and every other kind of border."}
          </p>
        }
      />

      {archived.length === 0 ? (
        <section className="sec sec--tight" aria-labelledby="empty-h">
          <div className="wrap empty-cabinet">
            <div className="reveal">
              <EmptyMount lang={lang} />
            </div>
            <div className="reveal">
              <p className="catno mono">
                <span>Herbarium · status: awaiting first accession</span>
              </p>
              <WaterlineHeading as="h2" id="empty-h" contained en="The collection begins after Vol. 01, November 2026.">
                {zh ? (
                  <>
                    歷屆講者名錄，
                    <br />
                    還在等第一批講者。
                  </>
                ) : (
                  <>
                    The register is waiting
                    <br />
                    for its first speakers.
                  </>
                )}
              </WaterlineHeading>
              <p className="lead">
                {zh ? (
                  <>
                    第一冊 <i>{pending?.title ?? "Sustainable Urbanization? Rewilding?"}</i> 將於 {pending?.dateLabel.zh ?? "2026 年 11 月"}舉行。活動結束後，這一冊的講者會自動收錄在這裡；在那之前，請到活動頁認識他們。
                  </>
                ) : (
                  <>
                    The first volume, <i>{pending?.title ?? "Sustainable Urbanization? Rewilding?"}</i>, takes place in {pending?.dateLabel.en ?? "November 2026"}. Once it is over, its speakers will be added here automatically. Until then, meet them on the event page.
                  </>
                )}
              </p>
              {pending && pendingLineup.length > 0 && (
                <div className="pending">
                  <p className="mono pending-h">{zh ? `Pending accession · 待收錄 · Vol. ${pad2(pending.vol)}` : `Pending accession · Vol. ${pad2(pending.vol)}`}</p>
                  <ul>
                    {pendingLineup.map((s) => (
                      <li key={s.id}>
                        <Link href={href(`/events/${pending.slug}#${s.id}`)}>
                          <span className="pencil">{s.name[lang]}</span>
                          <span className="mono muted">
                            {s.identities.length} label{s.identities.length > 1 ? "s" : ""}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="actions">
                {pending && (
                  <Link className="btn btn--ink" href={href(`/events/${pending.slug}#speakers`)}>
                    {zh ? `看 Vol. ${pad2(pending.vol)} 的講者` : `Meet the Vol. ${pad2(pending.vol)} speakers`}
                    <span className="mani" aria-hidden="true">
                      ☞
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {past.map((e) => {
            const people = e.speakers.map(speakerById).filter((s) => s !== undefined);
            return (
              <section key={e.slug} className="sec sec--tight" aria-labelledby={`vol-${e.vol}`}>
                <div className="wrap">
                  <PlateHead lang={lang} no={roman(e.vol)} id={`vol-${e.vol}`} title={e.title} en={e.subtitle[lang]} side={`Vol. ${pad2(e.vol)} · ${e.dateLabel[lang]}`} />
                  <div className="sheets">
                    {people.map((s) => (
                      <div key={s.id} className="reveal">
                        <SpecimenSheet s={s} full headingLevel={3} vol={`Vol. ${pad2(e.vol)} · ${e.title}`} lang={lang} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
          <PlateEdge from="var(--paper)" to="var(--cyan)" mode="lace" seed={55} />
          <section className="sec sec--cyan" aria-labelledby="sp-atlas">
            <div className="wrap">
              <PlateHead lang={lang} no="§" label="Atlas" id="sp-atlas" title={zh ? "他們把哪些世界接在一起" : "The worlds they join together"} en={zh ? "Crossings" : undefined} />
              <div className="atlas-solo reveal">
                <CrossingAtlas
                  lang={lang}
                  idPrefix="sp-atlas"
                  speakers={archived.map(({ s }) => ({ id: s.id, href: `#${s.id}`, name: s.name[lang], photo: s.photo, members: faces(s.members), initial: s.initial[lang], disciplines: s.disciplines, places: s.places }))}
                  disciplines={DISCIPLINES}
                />
              </div>
            </div>
          </section>
          <PlateEdge from="var(--cyan)" to="var(--paper)" mode="lace" seed={89} />
        </>
      )}

      <section className="cta-band" aria-labelledby="sp-cta">
        <div className="wrap cta-row">
          <h2 id="sp-cta">
            {zh ? "想成為下一位講者？" : "Could you be the next speaker?"}
            <br />
            <span className="muted">{zh ? "我們正在徵集身上貼著好幾張標籤的講者。" : "We are looking for speakers who carry more than one label."}</span>
          </h2>
          <CallLink lang={lang} />
        </div>
      </section>
    </>
  );
}
