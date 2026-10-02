"use client";

import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import { trackFunnelEvent } from "@/lib/analytics/client";
import { funnelEventNames, type AnalyticsCtaLocation } from "@/lib/analytics/events";
import type { AnalyticsPageContext } from "@/lib/analytics/page-types";

type TrackedLinkProps = Omit<ComponentProps<typeof Link>, "href"> &
  LinkProps & {
    ctaId: string;
    ctaLocation: AnalyticsCtaLocation;
    destinationType: "request" | "service" | "contact" | "professional" | "public";
    pageContext?: AnalyticsPageContext;
    serviceSlug?: string;
  };

export function TrackedLink({
  ctaId,
  ctaLocation,
  destinationType,
  pageContext,
  serviceSlug,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          void trackFunnelEvent(funnelEventNames.publicCtaClicked, {
            cta_id: ctaId,
            cta_location: ctaLocation,
            destination_type: destinationType,
            ...(serviceSlug ? { service_slug: serviceSlug } : {}),
          }, pageContext);
        }
      }}
    />
  );
}
