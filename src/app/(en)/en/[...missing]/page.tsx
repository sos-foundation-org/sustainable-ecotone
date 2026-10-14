import { notFound } from "next/navigation";

// Any unmatched URL under /en renders this language's not-found page.
export default function Missing() {
  notFound();
}
