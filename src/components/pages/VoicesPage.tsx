import Link from "next/link";
import { PageTitle } from "@/components/Typography";
import { PlateEdge } from "@/components/Dividers";
import WhaleSea from "@/components/WhaleSea";
import VideoCard, { TaipeiClock } from "@/components/VideoCard";
import { VOICES } from "@/content/voices";
import { localePath, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";

export function voicesMetadata(lang: Lang) {
  return pageMetadata({
    lang,
    path: "/voices",
    ...(lang === "zh"
      ? {
          title: "多元聲音",
          description: "多元聲音（Diverse Voices）：不同年齡、性別、族群、學歷、職業與生命經驗的人，各錄一段短片，說出自己對跨領域永續的期待：希望它成為什麼、做到什麼、改變什麼。鯨的歌聲能穿越整個海盆，這些願望也越過每一種邊界。",
        }
      : {
          title: "Diverse Voices",
          description:
            "Short films from people of different ages, genders, ethnicities, schooling, occupations and life experiences, each sharing what they hope interdisciplinary sustainability can become, do or change. Whale song can cross a whole ocean basin; so can a hope.",
        }),
  });
}

export default function VoicesPage({ lang }: { lang: Lang }) {
  const zh = lang === "zh";
  return (
    <>
      <PageTitle
        catalog={zh ? ["Atlas · 多元聲音", "Diverse Voices", `${VOICES.length} voices`] : ["Atlas · Diverse Voices", `${VOICES.length} voices`]}
        waterline
        en={zh ? "Whale song crosses whole ocean basins. Hopes cross every border." : undefined}
        title={
          zh ? (
            <>
              鯨歌越過海盆，
              <br />
              願望越過邊界。
            </>
          ) : (
            <>
              Whale song crosses oceans.
              <br />
              Hopes cross every border.
            </>
          )
        }
        lead={
          zh ? (
            <p>
              跨領域永續，應該為我們帶來什麼？我們把這個問題交給各行各業的人：高中生與退休教師、漁民與律師、護理師與原住民族部落工作者，不同年齡、性別、族群、學歷、職業與生命經驗的人，從臺灣各地到海的另一端，各自錄一段短片，說出自己對跨領域永續的期待：希望它成為什麼、做到什麼、改變什麼。這些願望沿著同一條歌聲線（<i>song line</i>）傳到臺北，在論壇現場播放，也長期收錄在這裡。
            </p>
          ) : (
            <p>
              What should interdisciplinary sustainability bring us? We put the question to people from all walks of life: high school students and retired teachers, fishers and lawyers, nurses and Indigenous community workers. People of every age, gender, ethnicity, schooling, occupation and life experience, from all over Taiwan and across the sea, each record a short film about what they hope interdisciplinary sustainability can become, do or change. Their hopes travel along a single <i>song line</i> to Taipei, are screened at the forum, and are kept here for the long term.
            </p>
          )
        }
      />

      <WhaleSea lang={lang} note={<p className="sea-note">{zh ? "† 影片陸續上線中；名單、地點與提問為暫定。" : "† Films are being added one by one. Names, places and questions are provisional."}</p>}>
        <p className="sea-tpe mono">
          <span>{zh ? "Taipei · 臺北" : "Taipei"}</span>
          <TaipeiClock />
          <span>{zh ? "所有時區，同一張網" : "Every time zone, one web"}</span>
        </p>
        <div className="sea-ports">
          {VOICES.map((v, i) => (
            <VideoCard key={v.id} v={v} sheet={i + 1} lang={lang} />
          ))}
        </div>
      </WhaleSea>

      <PlateEdge from="var(--abyss)" to="var(--paper)" mode="lace" seed={233} />

      <section className="cta-band" aria-labelledby="v-cta">
        <div className="wrap cta-row">
          <h2 id="v-cta">
            {zh ? "你希望跨領域永續帶來什麼改變？" : "What do you hope interdisciplinary sustainability will change?"}
            <br />
            <span className="muted">{zh ? "錄一段短片，說出你的期待。" : "Record a short film and tell us your hopes."}</span>
          </h2>
          <Link className="btn btn--ink" href={localePath(lang, "/call-for-speakers#contact")}>
            {zh ? "與我們聯絡" : "Get in touch"} <small>CONTACT</small>
            <span className="mani" aria-hidden="true">
              ☞
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
