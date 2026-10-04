import { FaqSummary } from "@/components/public/faq-summary";
import type { AnalyticsPageContext } from "@/lib/analytics/page-types";

type FaqItem = Readonly<{
  question: string;
  answer: string;
}>;

export function FaqList({ items, analyticsContext }: Readonly<{ items: FaqItem[]; analyticsContext?: AnalyticsPageContext }>) {
  return (
    <div className="max-w-4xl divide-y border-y">
      {items.map((item, index) => (
        <details key={item.question} className="group px-1">
          <FaqSummary questionId={`faq_${index + 1}`} analyticsContext={analyticsContext}>{item.question}</FaqSummary>
          <p className="max-w-prose pb-5 text-base leading-7 text-muted-foreground sm:pr-8">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
