"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { requestExperimentAssignment, trackCtaImpression, trackFunnelEvent, type ClientExperimentAssignment } from "@/lib/analytics/client";
import { funnelEventNames, type AnalyticsCtaLocation } from "@/lib/analytics/events";
import type { AnalyticsPageContext } from "@/lib/analytics/page-types";

type TrackedLinkProps = Omit<ComponentProps<typeof Link>, "href"> &
  LinkProps & {
    ctaId: string;
    ctaLocation: AnalyticsCtaLocation;
    destinationType: "request" | "service" | "contact" | "professional" | "public";
    pageContext?: AnalyticsPageContext;
    serviceSlug?: string;
    experimentSlot?: string;
    experimentLabels?: Record<string, string>;
  };

export function TrackedLink({
  ctaId,
  ctaLocation,
  destinationType,
  pageContext,
  serviceSlug,
  experimentSlot,
  experimentLabels,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  const pathname = usePathname();
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [assignment, setAssignment] = useState<(ClientExperimentAssignment & { route: string }) | null>(null);

  useEffect(() => {
    if (!experimentSlot) return;
    let active = true;
    let interval: number | undefined;
    const refreshAssignment = async () => {
      const result = await requestExperimentAssignment(experimentSlot, pageContext);
      if (!active) return;
      setAssignment(result ? { ...result, route: pathname ?? window.location.pathname } : null);
      if (result && interval === undefined) interval = window.setInterval(refreshAssignment, 15_000);
      if (!result && interval !== undefined) {
        window.clearInterval(interval);
        interval = undefined;
      }
    };
    void refreshAssignment();
    return () => {
      active = false;
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [experimentSlot, pageContext, pathname]);

  const activeAssignment = assignment?.route === pathname ? assignment : null;

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    let recorded = false;
    const recordImpression = () => {
      if (recorded) return;
      recorded = true;
      trackCtaImpression({
        ctaId,
        ctaLocation,
        destinationType,
        pageContext,
        assignment: activeAssignment,
      });
    };

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0)) {
          recordImpression();
          observer.disconnect();
        }
      }, { threshold: 0.01 });
      observer.observe(anchor);
      return () => observer.disconnect();
    }

    const bounds = anchor.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.right > 0 && bounds.top < window.innerHeight && bounds.left < window.innerWidth) {
      recordImpression();
    }
  }, [activeAssignment, ctaId, ctaLocation, destinationType, pageContext, pathname]);

  const variantLabel = activeAssignment ? experimentLabels?.[activeAssignment.variantKey] : undefined;
  const renderedChildren = variantLabel && typeof children === "string" ? variantLabel : children;

  return (
    <Link
      {...props}
      ref={anchorRef}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          void trackFunnelEvent(funnelEventNames.publicCtaClicked, {
            cta_id: ctaId,
            cta_location: ctaLocation,
            destination_type: destinationType,
            ...(serviceSlug ? { service_slug: serviceSlug } : {}),
            ...(activeAssignment
              ? {
                  experiment_id: activeAssignment.experimentId,
                  experiment_key: activeAssignment.experimentKey,
                  variant_id: activeAssignment.variantId,
                  variant_key: activeAssignment.variantKey,
                  experiment_slot: activeAssignment.slot,
                }
              : {}),
          }, pageContext);
        }
      }}
    >
      {renderedChildren}
    </Link>
  );
}
