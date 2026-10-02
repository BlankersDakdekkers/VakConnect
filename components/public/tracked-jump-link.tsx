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
      className="inline-flex min-h-11 items-center py-2 text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
      onClick={() => void trackFunnelEvent(funnelEventNames.jumpLinkClicked, { jump_link_id: id }, pageContext)}
    >
      {children}
    </a>
  );
}
