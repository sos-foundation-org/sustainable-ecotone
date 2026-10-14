/**
 * Global engraving library: hatch patterns, discipline linetypes and the
 * engraved creature symbols. Rendered once in the root layout (hidden) and
 * referenced everywhere with url(#…) and <use href="#…">.
 */
import { FungusSymbols } from "./fungi/library";

const INK = "#1C1A17";


export default function EngraveDefs() {
  return (
    <svg className="engrave-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        {/* ── hatches ── */}
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="2.6" height="2.6" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="2.6" stroke={INK} strokeWidth=".5" />
        </pattern>
        <pattern id="hatchW" patternUnits="userSpaceOnUse" width="3.4" height="3.4" patternTransform="rotate(-42)">
          <line x1="0" y1="0" x2="0" y2="3.4" stroke={INK} strokeWidth=".45" />
        </pattern>
        <pattern id="hatchC" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#A8321F" strokeWidth=".6" />
        </pattern>
        <pattern id="hatchL" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="3" stroke="#E9EEF0" strokeWidth=".5" />
        </pattern>
        <pattern id="stip" patternUnits="userSpaceOnUse" width="5" height="5">
          <circle cx="1" cy="1" r=".45" fill={INK} />
          <circle cx="3.6" cy="3.3" r=".35" fill={INK} />
        </pattern>

        {/* ── discipline linetypes (map-legend style) ── */}
        <pattern id="lt-literature" patternUnits="userSpaceOnUse" width="11" height="11">
          <rect x=".5" y=".5" width="10" height="10" fill="none" stroke={INK} strokeWidth=".5" />
        </pattern>
        <pattern id="lt-history" patternUnits="userSpaceOnUse" width="16" height="16">
          <g fill="none" stroke={INK} strokeWidth=".5">
            <circle cx="8" cy="8" r="6.6" />
            <circle cx="8.3" cy="7.8" r="4.2" />
            <circle cx="8.5" cy="7.7" r="1.8" />
          </g>
        </pattern>
        <pattern id="lt-finance" patternUnits="userSpaceOnUse" width="12" height="20">
          <g stroke={INK} strokeWidth=".55">
            <line x1="3" y1="2" x2="3" y2="17" />
            <rect x="1.6" y="6" width="2.8" height="7" fill={INK} />
            <line x1="9" y1="5" x2="9" y2="18" />
            <rect x="7.6" y="9" width="2.8" height="5" fill="none" />
          </g>
        </pattern>
        <pattern id="lt-law" patternUnits="userSpaceOnUse" width="16" height="10">
          <g stroke={INK} strokeWidth=".6" strokeDasharray="5 3">
            <line x1="0" y1="3" x2="16" y2="3" />
            <line x1="0" y1="7" x2="16" y2="7" />
          </g>
        </pattern>
        <pattern id="lt-politics" patternUnits="userSpaceOnUse" width="20" height="9">
          <path d="M0 4.5h8M11 4.5h1.6M15.4 4.5H20" stroke={INK} strokeWidth=".8" />
        </pattern>
        <pattern id="lt-ee" patternUnits="userSpaceOnUse" width="22" height="14">
          <path d="M0 4h8l5 6h9" fill="none" stroke={INK} strokeWidth=".6" />
          <circle cx="8" cy="4" r="1.6" fill="#FAF6EC" stroke={INK} strokeWidth=".5" />
        </pattern>
        <pattern id="lt-hightech" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect x="1" y="1" width="6" height="6" fill="none" stroke={INK} strokeWidth=".45" />
        </pattern>
        <pattern id="lt-mech" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth=".6" />
        </pattern>
        <pattern id="lt-agriculture" patternUnits="userSpaceOnUse" width="24" height="8">
          <path d="M0 4Q6 1.5 12 4T24 4" fill="none" stroke={INK} strokeWidth=".55" />
          <circle cx="6" cy="6.6" r=".6" fill={INK} />
        </pattern>
        <pattern id="lt-fisheries" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <path d="M0 0h8M0 0v8" stroke={INK} strokeWidth=".5" />
        </pattern>
        <pattern id="lt-medicine" patternUnits="userSpaceOnUse" width="40" height="14">
          <path d="M0 8h10l2-2 2 2h3l2-7 2 12 2-5h17" fill="none" stroke={INK} strokeWidth=".6" />
        </pattern>
        <pattern id="lt-ecology" patternUnits="userSpaceOnUse" width="40" height="10">
          <path d="M0 3C10 0 14 6 20 3s10-3 20 0M0 8c10-3 14 3 20 0s10-3 20 0" fill="none" stroke={INK} strokeWidth=".5" />
        </pattern>
        <pattern id="lt-design" patternUnits="userSpaceOnUse" width="14" height="14">
          <circle cx="7" cy="7" r="4.6" fill="none" stroke={INK} strokeWidth=".5" />
          <circle cx="7" cy="7" r=".7" fill={INK} />
        </pattern>

        {/* ── mangrove leaf (origin = petiole) ── */}
        <g id="leaf">
          <path className="lf-up" d="M0 0C8-9 26-13 40-9C48-6 51-2 52 0Z" />
          <path className="lf-dn" d="M0 0L52 0C51 2 48 6 40 9C26 13 8 9 0 0Z" />
          <path className="lf-o" d="M0 0C8-9 26-13 40-9C48-6 51-2 52 0C51 2 48 6 40 9C26 13 8 9 0 0Z" />
          <path className="lv" d="M0 0C16-.6 34-.4 50 0M10-.4C14-4 17-6 21-7.4M20-.4C24-4.5 28-7 32-8.2M30-.3C34-4 37-6 41-6.6" />
        </g>

        {/* ── grasshopper, facing right; feet at y≈99. The one drawing for every
              grasshopper on the site; the hind tibia follows --kick (see lib/leap) ── */}
        <symbol id="grasshopper" viewBox="0 0 210 110" overflow="visible">
          <g transform="translate(0 4.5) scale(1.75)" stroke="currentColor" strokeWidth=".75" strokeLinejoin="round" strokeLinecap="round">
            <path fill="none" strokeWidth=".55" d="M101 26C106 16 112 9 119 5M98.5 26C101 15 105 8 110 2" />
            <path fill="none" d="M84 41L82 49L76 53M94 41.5L98 49L103 52.5" />
            <path className="pf" d="M30 36C40 31 60 30 76 31L76 41C60 43 42 42 30 36Z" />
            <path fill="none" strokeWidth=".4" d="M42 32.6L43 41.5M50 31.6L51 42.2M58 31L58.6 42.4M66 30.8L66.4 42" />
            <path className="pf" d="M92 31C74 27 46 27 19 33C24 35.6 30 36.2 36 35.8C56 34.3 76 34.3 92 35.4Z" />
            <path fill="none" strokeWidth=".35" d="M88 32.5C66 30.2 44 30.6 24 33.7M80 33.6C62 32.2 46 32.4 32 34.6" />
            <path className="pf" d="M74 29C80 26 90 26 94 29L95 41C88 43 80 43 75 41Z" />
            <path className="pf" d="M93 28C99 25 106 28 107 35C107 41 102 44 96 42L94 40Z" />
            <ellipse cx="100.5" cy="31.5" rx="2.4" ry="3" fill="currentColor" />
            <g style={{ transformOrigin: "42px 22.5px", transform: "rotate(var(--kick, 0deg))", transition: "transform .18s ease-out" }}>
              <path fill="none" d="M42 23L57 52L65 53.5" />
              <path fill="none" strokeWidth=".5" d="M46 31l2.6-1.2M49.5 37.6l2.6-1.2M53 44.4l2.6-1.2" />
            </g>
            <path className="pf" d="M78 40.5C74 33 60 25 44 21C41.6 20.4 40.6 22.6 42.2 23.8C54 29.5 66 36.5 73 42.5Z" />
            <path fill="none" strokeWidth=".4" d="M70 36.5l-2-4.4M64.5 32.6l-2-4.2M59 29.4l-2-4M53.5 26.6l-2-3.6M48 24.2l-1.6-2.6" />
          </g>
        </symbol>

        {/* ── milkfish, facing left ── */}
        <symbol id="fish" viewBox="0 0 120 50" overflow="visible">
          <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
            <path className="pf" d="M4 25C14 12 40 8 66 12C84 15 94 20 100 24L116 10C114 18 112 22 112 25C112 28 114 32 116 40L100 26C94 30 84 35 66 38C40 42 14 38 4 25Z" />
            <path d="M8 22C20 14 44 12 66 15C82 17 92 21 99 24C80 20 50 18 8 22Z" fill="url(#hatch)" stroke="none" />
            <path d="M50 11L58 3L66 12" />
            <path d="M58 38L64 45L68 37" />
            <path d="M27 13C23 21 23 30 28 37" />
            <path d="M30 25C50 23 76 24 98 25" strokeWidth=".5" strokeDasharray="1.5 2" />
            <circle cx="15" cy="22" r="2.6" />
            <circle cx="15" cy="22" r=".9" fill="currentColor" />
          </g>
        </symbol>

        {/* ── mudskipper, facing left (a fish that walks on land) ── */}
        <symbol id="mudskipper" viewBox="0 0 100 40" overflow="visible">
          <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
            <path className="pf" d="M34 17C38 4 52 1 60 18Z" />
            <path d="M40 15L42 7M46 16L48 5M52 17L53 7" strokeWidth=".5" />
            <path className="pf" d="M6 26C6 16 18 12 28 16C48 18 70 20 84 22L96 14L95 32L84 28C66 32 40 34 20 33C10 32 6 30 6 26Z" />
            <path d="M14 18C30 18 56 20 82 23C60 22 34 21 14 18Z" fill="url(#hatch)" stroke="none" />
            <path d="M20 30C40 31 62 29 82 26" strokeWidth=".45" strokeDasharray="1 2" />
            <circle className="pf" cx="15" cy="13.5" r="3.6" />
            <circle cx="15.6" cy="13" r="1.3" fill="currentColor" />
            <circle className="pf" cx="21.5" cy="12.6" r="3" />
            <circle cx="22" cy="12.2" r="1.1" fill="currentColor" />
            <path className="pf" d="M24 30C23 37 29 41 36 38C33 36 31 33 30 30" />
            <path d="M6 26L12 27" />
          </g>
        </symbol>

        {/* ── humpback whale, facing left ── */}
        <symbol id="whale" viewBox="0 0 300 120" overflow="visible">
          <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
            <path className="pf" d="M92 78C108 92 130 106 162 114C166 112 164 108 160 106C134 98 116 88 104 80Z" />
            <path className="pf" d="M14 62C22 46 56 36 104 36C160 36 214 46 250 56L276 40C284 38 292 40 296 44C288 48 282 54 280 60C284 66 290 72 296 76C292 80 284 82 276 80L250 66C214 78 160 88 104 86C60 84 26 78 14 62Z" />
            <path d="M14 62C30 64 52 66 76 64" />
            <path d="M24 68C50 74 80 78 120 80M28 72C56 78 86 81 118 83M38 76C60 80 90 84 112 85" strokeWidth=".5" />
            <path d="M22 54C40 44 70 40 104 40C160 40 210 48 246 58" strokeWidth=".5" />
            <circle cx="70" cy="57" r="1.6" fill="currentColor" />
            <path d="M28 52l1 0M38 48l1 0M48 45.5l1 0M34 56l1 0" strokeWidth="2.2" />
            <path className="pf" d="M196 46C200 40 206 38 212 40C208 42 206 46 206 49Z" />
            <path d="M100 84l-2 2M110 91l-2 2M122 98l-2 2M136 104l-2 2M148 109l-1 2" strokeWidth=".7" />
          </g>
        </symbol>

        {/* ── fiddler crab ── */}
        <symbol id="crab" viewBox="-6 -8 54 30" overflow="visible">
          <g fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12l-6 5M8 13l-4 6M16 13l4 6M20 12l6 5" />
            <path d="M8 4l-1-7M16 4l1-7" />
            <circle cx="7" cy="-4" r="1.4" fill="currentColor" />
            <circle cx="17" cy="-4" r="1.4" fill="currentColor" />
            <path className="pf" d="M0 10C2 2 22 2 24 10C22 13 2 13 0 10Z" />
            <path d="M2 9C6 5 18 5 22 9C18 8 6 8 2 9Z" fill="url(#hatch)" stroke="none" />
            <path className="pf" d="M23 8C28 0 40-2 44 5C42 10 32 12 25 11Z" />
            <path d="M30 4C34 2 38 2 41 5" strokeWidth=".5" />
          </g>
        </symbol>

        {/* ── fungi: the species library (components/fungi/library) as <symbol id="fungus-<species>"> ── */}
        <FungusSymbols />

        {/* ── brand mark: a lens with a tide line and a propagule ── */}
        <symbol id="mark" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth=".4" />
          <clipPath id="mark-clip">
            <circle cx="20" cy="20" r="15.6" />
          </clipPath>
          <g clipPath="url(#mark-clip)">
            <path d="M2 22C8 19 12 25 20 22C28 19 32 25 38 22L38 40L2 40Z" fill="url(#hatch)" />
            <path d="M2 22C8 19 12 25 20 22C28 19 32 25 38 22" fill="none" stroke="#A8321F" strokeWidth="1" />
            <path d="M20 6C18.6 14 18.6 24 20 33C21.4 24 21.4 14 20 6Z" fill="#F2ECDF" stroke="currentColor" strokeWidth=".8" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
