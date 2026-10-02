import { serviceDetailRoutes } from "../content/service-cards.ts";
import type { AnalyticsPageType } from "./events.ts";

export type AnalyticsPageContext = {
  pageType?: AnalyticsPageType;
  serviceSlug?: string | null;
  subserviceSlug?: string | null;
  citySlug?: string | null;
  provinceSlug?: string | null;
};

export type ClassifiedPage = {
  route: string;
  pageType: AnalyticsPageType | null;
  serviceSlug: string | null;
  subserviceSlug: string | null;
  citySlug: string | null;
  provinceSlug: string | null;
};

const knownServiceSlugs = new Set(Object.keys(serviceDetailRoutes));
const staticPageTypes: Record<string, AnalyticsPageType> = {
  "/": "homepage",
  "/aanvraag": "lead_funnel",
  "/aanvraag/bedankt": "lead_funnel",
  "/voor-vakmannen": "professional_landing",
  "/aanmelden-vakman": "professional_landing",
  "/contact": "contact",
  "/kosten": "costs",
};

function safeSlug(value: string | null | undefined) {
  return value && /^[a-z0-9-]{1,80}$/.test(value) ? value : null;
}

export function classifyPublicPage(pathname: string, context: AnalyticsPageContext = {}): ClassifiedPage {
  const route = pathname.split(/[?#]/, 1)[0] || "/";
  const segments = route.split("/").filter(Boolean);
  const first = safeSlug(segments[0]);
  const serviceSlug = safeSlug(context.serviceSlug) ?? (first && knownServiceSlugs.has(first) ? first : null);
  const remainder = serviceSlug ? segments.slice(1).map(safeSlug) : [];
  const pageType =
    context.pageType ??
    staticPageTypes[route] ??
    (route.startsWith("/regios/") && segments.length === 2
      ? "province"
      : serviceSlug && segments.length === 1
        ? "service"
        : serviceSlug && segments.length === 2
          ? "subservice"
          : serviceSlug && segments.length === 3
            ? "subservice_city"
            : route === "/diensten" || route === "/hoe-werkt-het" || route === "/over-vakconnect" || route === "/privacy"
              ? "core_public"
              : segments.length === 0
                ? "homepage"
                : serviceSlug
                  ? null
                  : "core_public");

  return {
    route,
    pageType,
    serviceSlug,
    subserviceSlug: safeSlug(context.subserviceSlug) ?? (pageType === "subservice" || pageType === "subservice_city" ? remainder[0] ?? null : null),
    citySlug: safeSlug(context.citySlug) ?? (pageType === "service_city" ? remainder[0] ?? null : pageType === "subservice_city" ? remainder[1] ?? null : null),
    provinceSlug: safeSlug(context.provinceSlug) ?? (pageType === "province" ? safeSlug(segments[1]) : null),
  };
}

export function getPageViewEventName(pageType: AnalyticsPageType) {
  if (pageType === "service" || pageType === "subservice") return "service_page_view" as const;
  if (pageType === "service_city" || pageType === "subservice_city" || pageType === "province") return "local_page_view" as const;
  return "public_page_view" as const;
}
