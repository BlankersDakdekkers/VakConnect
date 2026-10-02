import { localDepthHome } from "./local-depth-home.ts";
import { localDepthTrades } from "./local-depth-trades.ts";
import type { LocalContentDepth } from "./local-depth-types.ts";

export const localContentDepth: Record<string, LocalContentDepth> = {
  ...localDepthTrades,
  ...localDepthHome,
};

export function matchesLocalContentDepth(
  content: Pick<LocalContentDepth, "intro" | "sections" | "faqs">,
  proposal: LocalContentDepth,
) {
  const signature = (value: Pick<LocalContentDepth, "intro" | "sections" | "faqs">) => JSON.stringify([
    value.intro,
    value.sections.map((section) => [section.heading, section.paragraphs, section.bullets ?? [], section.type ?? "default"]),
    value.faqs.map((faq) => [faq.question, faq.answer]),
  ]);
  return signature(content) === signature(proposal);
}
