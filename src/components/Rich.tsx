import type { ElementType } from "react";

/** Renders trusted, repo-authored copy that contains inline markup such as <span class="en">. */
export default function Rich({ html, as: Tag = "span", className }: { html: string; as?: ElementType; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
