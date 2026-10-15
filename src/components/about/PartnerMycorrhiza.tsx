import type { Lang } from "@/lib/i18n";
import { FIG, NODE, SOIL, VB } from "./geometry";
import PartnerTips, { type Hotspot, type TipId } from "./PartnerTips";

const INK = "#1C1A17";
const PAPER = "#F2ECDF";
const CIN = "#A8321F";
const SEP = "#5E5141";

const T = {
  zh: {
    title: "關於頁圖：兩棵樹，一片菌絲",
    desc: "銅版畫風格插圖。地面上是兩棵樹：代表國立臺灣大學（NTU）的大王椰子，與代表國立陽明交通大學（NYCU）的竹叢。地面下，SOS 基金會（Sustainability of Sustainability Foundation）是連起兩者根系的菌絲網絡。三方的菌絲在地下的一個朱紅節點交會，節點上方的地面長出一株珊瑚菌，就是兼容並續。",
    tips: {
      ntu: ["國立臺灣大學", "National Taiwan University"],
      nycu: ["國立陽明交通大學", "National Yang Ming Chiao Tung University"],
      sos: ["SOS 基金會", "Sustainability of Sustainability Foundation"],
      eco: ["兼容並續：在學科的交界處，讓永續長出新的物種", "Ecotone"],
    },
    labels: { eco: "兼容並續" },
  },
  en: {
    title: "About figure: two trees, one mycelium",
    desc: "Engraving-style illustration. Above ground stand two trees: a royal palm for National Taiwan University (NTU) and a stand of bamboo for National Yang Ming Chiao Tung University (NYCU). Below ground, SOS (the Sustainability of Sustainability Foundation) is the mycelial network joining their roots. The three meet at a cinnabar node underground, and above it a coral fungus fruits from the soil: Ecotone, 兼容並續.",
    tips: {
      ntu: ["National Taiwan University"],
      nycu: ["National Yang Ming Chiao Tung University"],
      sos: ["Sustainability of Sustainability Foundation"],
      eco: ["Ecotone: where disciplines meet, sustainability grows new species", "兼容並續"],
    },
    labels: { eco: "Ecotone" },
  },
} satisfies Record<Lang, unknown>;

/* Hotspots in viewBox units: [x0, y0, x1, y1]; `anchor` is where the tooltip points. */
const SPOTS: Hotspot[] = [
  { id: "sos", box: [18, 222, 462, 390], anchor: [300, 262], focus: false },
  { id: "ntu", box: [4, 14, 168, 222], anchor: [127, 116], focus: true },
  { id: "ntu", box: [26, 214, 108, 274], anchor: [66, 226], focus: false },
  { id: "nycu", box: [300, 24, 476, 222], anchor: [348, 116], focus: true },
  { id: "nycu", box: [362, 214, 470, 262], anchor: [414, 226], focus: false },
  { id: "eco", box: [204, 146, 278, 216], anchor: [240, 146], focus: false },
  { id: "eco", box: [214, 290, 266, 332], anchor: [240, 296], focus: false },
  { id: "sos", box: [202, 56, 278, 104], anchor: [240, 58], focus: true },
  { id: "eco", box: [174, 328, 306, 384], anchor: [240, 330], focus: true },
];
const ORDER: TipId[] = ["ntu", "nycu", "sos", "eco"];

/**
 * About-page figure (in the page-title aside): two trees above the soil line,
 * one mycelium below, and the coral fungus where all three fuse. Labels are the
 * partner abbreviations only; the full names live in the tooltips (PartnerTips),
 * opened by hovering a label or its drawing, by keyboard focus, or by tap.
 */
export default function PartnerMycorrhiza({ lang }: { lang: Lang }) {
  const t = T[lang];
  const zh = lang === "zh";
  const { palm: p, bamboo: b } = FIG;
  return (
    <div className="pmf">
      <svg className="triple pmf-art" viewBox={`0 0 ${VB.w} ${VB.h}`} role="img" aria-labelledby="triple-t triple-d">
        <title id="triple-t">{t.title}</title>
        <desc id="triple-d">{t.desc}</desc>
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* the soil section */}
          <path d={FIG.section} stroke={SEP} strokeWidth=".6" strokeDasharray="3 2" />
          <path className="pmf-fine" d={FIG.stipple} stroke={SEP} strokeWidth=".9" opacity=".7" />
          <path className="pmf-fine" d={FIG.strata} stroke={SEP} strokeWidth=".45" strokeDasharray="6 3" opacity=".8" />
          {FIG.pebbles.map(([x, y, rx, ry]) => (
            <g key={x}>
              <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={PAPER} stroke={INK} strokeWidth=".55" />
              <path d={`M${x} ${y + ry}A${rx} ${ry} 0 0 0 ${x + rx} ${y}`} stroke={INK} strokeWidth=".9" opacity=".6" />
            </g>
          ))}

          {/* below: the mycelium (SOS), the roots, and the fusion */}
          <path d={FIG.network} stroke={SEP} strokeWidth=".38" />
          <path d={FIG.hyphae} stroke={INK} strokeWidth=".6" />
          <path d={p.roots} stroke={INK} strokeWidth=".7" />
          <path d={b.rhizome} stroke={INK} strokeWidth="4.6" />
          <path d={b.rhizome} stroke={PAPER} strokeWidth="3" />
          <path d={b.rzNodes} stroke={INK} strokeWidth=".7" />
          <path d={b.rootlets} stroke={INK} strokeWidth=".5" />
          <path d={FIG.fused} stroke={CIN} strokeWidth=".7" />
          <path d={FIG.knot} stroke={CIN} strokeWidth=".6" />
          <path d={FIG.cord} stroke={INK} strokeWidth=".8" />
          <circle cx={NODE[0]} cy={NODE[1]} r="2.6" fill={CIN} />

          {/* the soil line */}
          <path d={`M18 ${SOIL}L462 ${SOIL}`} stroke={INK} strokeWidth="1.1" />
          <path d={FIG.grass} stroke={INK} strokeWidth=".55" />

          {/* NTU: royal palm */}
          <path d={p.trunk.fill} fill={PAPER} stroke="none" />
          <path d={p.trunk.shade} fill="url(#hatch)" stroke="none" opacity=".75" />
          <path d={p.rings} stroke={INK} strokeWidth=".35" opacity=".8" />
          <path d={p.trunk.sides} stroke={INK} strokeWidth="1" />
          <path d={p.shaft.fill} fill="url(#hatchW)" stroke={INK} strokeWidth=".8" />
          <path d={p.leaflets} stroke={INK} strokeWidth=".45" />
          <path d={p.rachis} stroke={INK} strokeWidth="1" />

          {/* NYCU: bamboo */}
          {b.culms.map((c, i) => (
            <path key={`o${i}`} d={c.d} stroke={INK} strokeWidth={c.w + 1.6} />
          ))}
          {b.culms.map((c, i) => (
            <g key={`f${i}`}>
              <path d={c.d} stroke={PAPER} strokeWidth={c.w} />
              <path d={c.shade} stroke="url(#hatch)" strokeWidth={c.w * 0.42} />
            </g>
          ))}
          <path d={b.nodes} stroke={INK} strokeWidth=".9" />
          <path d={b.twigs} stroke={INK} strokeWidth=".7" />
          <path d={b.leaves.hatch} fill="url(#hatch)" stroke={INK} strokeWidth=".5" />
          <path d={b.leaves.paper} fill={PAPER} stroke={INK} strokeWidth=".5" />
          <path d={b.leaves.ribs} stroke={INK} strokeWidth=".3" />

          {/* 兼容並續: the coral fungus fruiting above the node */}
          {FIG.fungi.map((fu, k) => (
            <g key={`c${k}`}>
              {fu.segs.map((s, i) => (
                <path key={`o${i}`} d={s.d} stroke={INK} strokeWidth={s.w + 2} />
              ))}
              {fu.segs.map((s, i) => (
                <path key={`p${i}`} d={s.d} stroke={PAPER} strokeWidth={s.w} />
              ))}
              {fu.segs.map((s, i) => (s.w > 2.2 ? <path key={`h${i}`} d={s.shade} stroke="url(#hatch)" strokeWidth={s.w * 0.4} /> : null))}
              {fu.segs.map((s, i) => (s.w > 3 ? <path key={`l${i}`} d={s.lit} stroke={INK} strokeWidth=".35" /> : null))}
              <path d={fu.dots} fill={INK} stroke="none" />
            </g>
          ))}

          {/* SOS: a fine leader from the sky label down into the network */}
          <path d={`M222 104C210 140 190 170 190 ${SOIL}S196 246 206 262`} stroke={SEP} strokeWidth=".6" strokeDasharray="1 2.6" />
          <circle cx="206" cy="262" r="1.6" fill={SEP} stroke="none" />
        </g>
        <use href="#grasshopper" x="116" y={SOIL - 29} width="56" height="29.4" color={INK} />

        {/* labels: abbreviations only (full names in the tooltips) */}
        <g className="pmf-labels">
          <text x="96" y="148" className="pmf-code" fill={INK}>
            NTU
          </text>
          <text x="384" y="148" textAnchor="end" className="pmf-code" fill={INK}>
            NYCU
          </text>
          <text x="240" y="92" textAnchor="middle" className="pmf-code" fill={INK}>
            SOS
          </text>
          {zh ? (
            <>
              <text x="240" y="354" textAnchor="middle" className="pmf-zh" fill={CIN}>
                兼容並續
              </text>
              <text x="240" y="374" textAnchor="middle" className="pmf-lat" fill={CIN}>
                Ecotonus
              </text>
            </>
          ) : (
            <>
              <text x="240" y="356" textAnchor="middle" className="pmf-code" fill={CIN}>
                Ecotone
              </text>
              <text x="240" y="375" textAnchor="middle" className="pmf-zh pmf-zh--sm" fill={CIN} lang="zh-Hant-TW">
                兼容並續
              </text>
            </>
          )}
        </g>
      </svg>
      <PartnerTips
        spots={SPOTS}
        order={ORDER}
        labels={{ ntu: "NTU", nycu: "NYCU", sos: "SOS", eco: t.labels.eco }}
        tips={t.tips}
        vb={[VB.w, VB.h]}
        lang={lang}
      />
    </div>
  );
}
