"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPublicPageView } from "@/lib/analytics/client";
import { classifyPublicPage, type AnalyticsPageContext } from "@/lib/analytics/page-types";

export function PublicAnalytics() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (classifyPublicPage(pathname).serviceSlug) return;
    trackPublicPageView(pathname);
  }, [pathname]);

  return null;
}

export function PublicPageAnalytics({ context }: Readonly<{ context: AnalyticsPageContext }>) {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || previousPath.current === pathname) return;
    previousPath.current = pathname;
    trackPublicPageView(pathname, context);
  }, [context, pathname]);

  return null;
}
