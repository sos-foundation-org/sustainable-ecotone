/** The Ecotone mark: a coral fungus whose outer branches curl into the rim, a cinnabar tide line, mycelial threads below. */
export default function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} aria-hidden="true">
      <use href="#mark" />
    </svg>
  );
}
