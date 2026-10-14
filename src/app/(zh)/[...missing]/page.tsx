import { notFound } from "next/navigation";

// Any unmatched URL renders this language's not-found page.
export default function Missing() {
  notFound();
}
