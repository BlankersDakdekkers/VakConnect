import { FaqSummary } from "@/components/public/faq-summary";
import type { AnalyticsPageContext } from "@/lib/analytics/page-types";

type FaqItem = Readonly<{
  question: string;
  answer: string;
}>;

export function FaqList({ items, analyticsContext }: Readonly<{ items: FaqItem[]; analyticsContext?: AnalyticsPageContext }>) {
  return (
    <div className="max-w-4xl space-y-3">
      {items.map((item, index) => (
        <details key={item.question} className="group rounded-2xl border bg-surface px-5">
          <FaqSummary questionId={`faq_${index + 1}`} analyticsContext={analyticsContext}>{item.question}</FaqSummary>
          <p className="max-w-prose pb-5 pr-8 text-sm leading-7 text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
