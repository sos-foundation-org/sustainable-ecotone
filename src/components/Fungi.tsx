import { FUNGUS_SPECIES, hypha, hyphaLink, mulberry32, r2, roman, seedFrom } from "@/lib/engrave";

/**
 * Genet strip for a specimen sheet. In mycology one individual (a genet) can
 * fruit as many mushrooms; here every fruiting body is one of the speaker's
 * identities, all joined by the same mycelium under the soil line.
 */
export function Genet({ seed, count, names }: { seed: string; count: number; names: string[] }) {
  const rnd = mulberry32(seedFrom(seed));
  const W = 300;
  const soil = 78;
  const xs = Array.from({ length: count }, (_, i) => r2((W * (i + 1)) / (count + 1)));
  const sizes = xs.map(() => 0.62 + rnd() * 0.22);
  const threads: string[] = [];
  xs.forEach((x) => {
    for (let k = 0; k < 4; k++) threads.push(hypha(rnd, x, soil + 1, 40 + rnd() * 100, 6 + Math.floor(rnd() * 6), 5, { x0: 4, x1: W - 4, y0: soil + 1, y1: 118 }));
  });
  for (let i = 0; i < xs.length - 1; i++) threads.push(hyphaLink(rnd, xs[i], soil + 1, xs[i + 1], soil + 1, 18));
  if (xs.length === 1) threads.push(hyphaLink(rnd, xs[0], soil + 1, W - 20, soil + 14, 10), hyphaLink(rnd, xs[0], soil + 1, 20, soil + 16, 10));

  return (
    <figure className="genet">
      <svg viewBox={`0 0 ${W} 120`} role="img" aria-label={`一個菌絲體，${count} 個子實體：${names.join("、")}`}>
        <rect x="0" y={soil} width={W} height={120 - soil} fill="url(#stip)" opacity=".18" />
        <g fill="none" stroke="#1C1A17" strokeWidth=".55" opacity=".75" strokeLinecap="round" strokeLinejoin="round">
          {threads.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <path d={`M0 ${soil}C60 ${soil - 2} 120 ${soil + 2} 180 ${soil}S260 ${soil - 2} ${W} ${soil}`} fill="none" stroke="#1C1A17" strokeWidth=".8" />
        {xs.map((x, i) => {
          const s = sizes[i];
          const w = 60 * s;
          const h = 80 * s;
          return (
            <g key={i}>
              <use href={`#${FUNGUS_SPECIES[i % 3]}`} x={r2(x - w / 2)} y={r2(soil - h)} width={r2(w)} height={r2(h)} color="#1C1A17" />
              <text x={r2(x + w / 2 - 4)} y={soil - 4} className="svg-mono svg-mono--xs" fill="#A8321F">
                {roman(i + 1)}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mono">
        Genet · 一個菌絲體，{count} 個子實體 <span className="k-zh">· 每一朵菇，是一種身份</span>
      </figcaption>
    </figure>
  );
}
