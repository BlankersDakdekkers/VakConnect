"use client";

import type { ReactNode } from "react";
import { trackFunnelEvent } from "@/lib/analytics/client";
import { funnelEventNames } from "@/lib/analytics/events";
import type { AnalyticsPageContext } from "@/lib/analytics/page-types";

export function FaqSummary({
  questionId,
  children,
  analyticsContext,
}: Readonly<{ questionId: string; children: ReactNode; analyticsContext?: AnalyticsPageContext }>) {
  return (
    <summary
      className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 [&::-webkit-details-marker]:hidden"
      onClick={(event) => {
        const details = event.currentTarget.parentElement;
        if (details instanceof HTMLDetailsElement && !details.open) {
          void trackFunnelEvent(funnelEventNames.faqOpened, { question_id: questionId }, analyticsContext);
        }
      }}
    >
      <span>{children}</span>
      <span aria-hidden="true" className="shrink-0 text-xl font-normal text-primary transition-transform group-open:rotate-45 motion-reduce:transition-none">
        +
      </span>
    </summary>
  );
}
