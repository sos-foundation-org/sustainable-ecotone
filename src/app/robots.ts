import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

// AI search and answer engines, named so the welcome is explicit (they are already allowed by "*").
// Being crawlable by them is what lets ChatGPT, Claude, Perplexity, Gemini and Copilot cite the site.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
