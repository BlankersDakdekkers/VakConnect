"use client";

import type { ReactNode } from "react";
import { trackFunnelEvent } from "@/lib/analytics/client";
import { funnelEventNames } from "@/lib/analytics/events";
import type { AnalyticsPageContext } from "@/lib/analytics/page-types";

export function TrackedJumpLink({
  href,
  id,
  children,
  pageContext,
}: Readonly<{ href: string; id: string; children: ReactNode; pageContext?: AnalyticsPageContext }>) {
  return (
    <a
      href={href}
      className="inline-flex min-h-10 items-center rounded-full border bg-surface px-3 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      onClick={() => void trackFunnelEvent(funnelEventNames.jumpLinkClicked, { jump_link_id: id }, pageContext)}
    >
      {children}
    </a>
  );
}
