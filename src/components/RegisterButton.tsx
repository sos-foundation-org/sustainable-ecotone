import Link from "next/link";
import { SITE } from "@/content/site";

/** Primary registration CTA. Uses SITE.registrationUrl when set; otherwise links to the contact page's "opening soon" note. */
export default function RegisterButton({ variant = "gold", label = "立即報名" }: { variant?: "gold" | "dark"; label?: string }) {
  const cls = `btn btn--${variant}`;
  if (SITE.registrationUrl) {
    return (
      <a className={cls} href={SITE.registrationUrl} target="_blank" rel="noopener noreferrer">
        {label} <span className="arrow">→</span>
      </a>
    );
  }
  return (
    <Link className={cls} href="/contact#register">
      報名即將開放 <span className="arrow">→</span>
    </Link>
  );
}
