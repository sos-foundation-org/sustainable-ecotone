import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title={<>這裡還是一片<em>未開墾</em>的交界。</>} lead="你要找的頁面不存在，或已經搬家了。">
      <div className="hero-actions">
        <Link className="btn btn--gold" href="/">
          回到首頁 <span className="arrow">→</span>
        </Link>
      </div>
    </PageHero>
  );
}
