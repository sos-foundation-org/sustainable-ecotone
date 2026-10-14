/** The Ecotone mark: a hand lens with a tide line and a 水筆仔 propagule crossing it. */
export default function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} aria-hidden="true">
      <use href="#mark" />
    </svg>
  );
}
