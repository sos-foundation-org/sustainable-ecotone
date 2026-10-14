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
          description: "Diverse Voices：不同年齡、性別、族群、學歷、職業與生命經驗的人，以短片回應 Ecotone 論壇的主題。鯨的歌聲能穿越整個海盆，有些聲音也能越過每一種邊界。",
        }
      : {
          title: "Diverse Voices",
          description:
            "Short films from people of different ages, genders, ethnicities, schooling, occupations and life experiences, each answering a question from the Ecotone forum. Whale song can cross a whole ocean basin; some voices cross every border.",
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
        en={zh ? "Whale song crosses whole ocean basins. Voices cross every other border." : undefined}
        title={
          zh ? (
            <>
              鯨歌越過海盆，
              <br />
              聲音越過身份。
            </>
          ) : (
            <>
              Whale song crosses oceans.
              <br />
              Voices cross identities.
            </>
          )
        }
        lead={
          zh ? (
            <p>
              這張網不止於陸地，也不止於校園。高中生與退休教師、漁民與法官、原住民族部落與新住民家庭、沒拿過大學文憑的實踐者與博士：不同年齡、性別、族群、學歷、職業與生命經驗的聲音，從臺灣各地到海的另一端，沿著同一條歌聲線（<i>song line</i>）傳到臺北。每一則短片，都在回答一個別的學科丟給他們的問題，在論壇現場播放，也長期收錄在這裡。
            </p>
          ) : (
            <p>
              This web reaches beyond the land, and beyond the campus. High school students and retired teachers, fishers and judges, Indigenous villages and new immigrant families, practitioners without a university degree and PhDs: voices of every age, gender, ethnicity, schooling, occupation and life experience travel from all over Taiwan and from across the sea, along a single <i>song line</i>, to Taipei. Each short film answers a question that another discipline has put to them. The films are screened at the forum and kept here for the long term.
            </p>
          )
        }
      />

      <WhaleSea lang={lang} note={<p className="sea-note">{zh ? "† 影片陸續上線中；名單、地點與題目為暫定。" : "† Films are being added one by one. Names, places and questions are provisional."}</p>}>
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
            {zh ? "你也有一段別人沒聽過的經驗？" : "Do you have a story no one else has heard?"}
            <br />
            <span className="muted">
              {zh ? (
                <>
                  錄一段 <i>voice</i> 給臺灣的聽眾。
                </>
              ) : (
                "Record a voice for audiences in Taiwan."
              )}
            </span>
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
