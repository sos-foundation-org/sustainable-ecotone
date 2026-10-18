import { llmsText } from "@/lib/llms";

// Plain-text fact sheet for AI search and answer engines (llmstxt.org). Built from src/content at build time.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsText(true), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
