/* eslint-disable @next/next/no-img-element -- static SVG logos; next/image adds nothing here */
export default function Logo({ src, alt = "", className }: { src: string; alt?: string; className?: string }) {
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
