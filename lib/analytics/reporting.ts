import { funnelEventNames, leadFunnelSteps } from "./events.ts";
import type { AnalyticsEvent, Lead, Service } from "../../types/database.ts";

export type AnalyticsReportEvent = Pick<
  AnalyticsEvent,
  "event_name" | "anonymous_session_id" | "lead_id" | "service_id" | "metadata" | "created_at"
>;

type LeadReportRow = Pick<Lead, "id" | "service_id">;

export type AnalyticsReport = {
  eventCount: number;
  pageViews: number;
  ctaClicks: number;
  funnelStarts: number;
  observedSubmissions: number;
  convertedSessions: number;
  storedLeads: number;
  reconciliationDifference: number;
  sampleLimited: boolean;
  serviceRows: Array<{
    service: string;
    slug: string;
    pageViews: number;
    ctaClicks: number;
    funnelStarts: number;
    submissions: number;
    conversionRate: number | null;
    lowSample: boolean;
  }>;
  localRows: Array<{
    route: string;
    city: string;
    service: string;
    views: number;
    ctaClicks: number;
    starts: number;
    submissions: number;
  }>;
  funnelRows: Array<{
    step: string;
    viewed: number;
    completed: number;
    completionRate: number | null;
    dropOffRate: number | null;
    errors: number;
    durationBuckets: Record<string, number>;
  }>;
  deviceRows: Array<{ device: string; starts: number; submissions: number }>;
  channelRows: Array<{ channel: string; starts: number; submissions: number }>;
  ctaRows: Array<{ ctaId: string; location: string; clicks: number; startedSessions: number; submittedSessions: number }>;
  utmRows: Array<{ source: string; medium: string; campaign: string; starts: number; submissions: number }>;
};

type SessionSummary = {
  started: boolean;
  submitted: boolean;
  serviceSlug: string | null;
  sourceRoute: string | null;
  device: string;
  channel: string;
  ctaId: string | null;
  ctaLocation: string | null;
  ctaIdAtStart: string | null;
  ctaLocationAtStart: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmSourceAtStart: string | null;
  utmMediumAtStart: string | null;
  utmCampaignAtStart: string | null;
};

function readMetadata(event: AnalyticsReportEvent) {
  return event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata)
    ? (event.metadata as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : null;
}

function getRate(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 1000) / 10 : null;
}

export function buildAnalyticsReport({
  events,
  leads,
  services,
  sampleLimited = false,
  storedLeadTotal,
}: {
  events: AnalyticsReportEvent[];
  leads: LeadReportRow[];
  services: Pick<Service, "id" | "slug" | "name">[];
  sampleLimited?: boolean;
  storedLeadTotal?: number;
}): AnalyticsReport {
  const serviceById = new Map(services.map((service) => [service.id, service]));
  const servicesBySlug = new Map(services.map((service) => [service.slug, service]));
  const serviceStats = new Map<string, { views: number; clicks: number; starts: Set<string>; submittedSessions: Set<string> }>();
  const localStats = new Map<
    string,
    { city: string; service: string; views: number; clicks: number; starts: number; submissions: number }
  >();
  const funnelStats = new Map<
    string,
    { viewed: Set<string>; completed: Set<string>; errors: number; durations: Record<string, number> }
  >();
  const sessions = new Map<string, SessionSummary>();
  const ctaStats = new Map<string, { ctaId: string; location: string; clicks: number; startedSessions: number; submittedSessions: number }>();
  const utmStats = new Map<string, { source: string; medium: string; campaign: string; starts: number; submissions: number }>();
  const stepOrder = new Map<string, number>(leadFunnelSteps.map((step, index) => [step, index]));
  let pageViews = 0;
  let ctaClicks = 0;
  let observedSubmissions = 0;
  let convertedSessions = 0;

  function sessionFor(id: string) {
    let session = sessions.get(id);
    if (!session) {
      session = {
        started: false,
        submitted: false,
        serviceSlug: null,
        sourceRoute: null,
        device: "unknown",
        channel: "unknown",
        ctaId: null,
        ctaLocation: null,
        ctaIdAtStart: null,
        ctaLocationAtStart: null,
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        utmSourceAtStart: null,
        utmMediumAtStart: null,
        utmCampaignAtStart: null,
      };
      sessions.set(id, session);
    }
    return session;
  }

  for (const event of events) {
    const metadata = readMetadata(event);
    const session = sessionFor(event.anonymous_session_id);
    const eventServiceSlug = stringValue(metadata.service_slug);
    const sourceRoute = stringValue(metadata.source_route);
    if (eventServiceSlug) session.serviceSlug = eventServiceSlug;
    if (sourceRoute) session.sourceRoute = sourceRoute;
    const device = stringValue(metadata.device_category);
    const channel = stringValue(metadata.referral_channel);
    const ctaId = stringValue(metadata.cta_id);
    const ctaLocation = stringValue(metadata.cta_location);
    if (device) session.device = device;
    if (channel) session.channel = channel;
    if (stringValue(metadata.utm_source)) session.utmSource = stringValue(metadata.utm_source);
    if (stringValue(metadata.utm_medium)) session.utmMedium = stringValue(metadata.utm_medium);
    if (stringValue(metadata.utm_campaign)) session.utmCampaign = stringValue(metadata.utm_campaign);

    if (event.event_name === funnelEventNames.publicPageViewed) pageViews += 1;
    if (event.event_name === funnelEventNames.servicePageViewed) {
      pageViews += 1;
      const slug = eventServiceSlug;
      if (slug) {
        const stats = serviceStats.get(slug) ?? { views: 0, clicks: 0, starts: new Set<string>(), submittedSessions: new Set<string>() };
        stats.views += 1;
        serviceStats.set(slug, stats);
      }
    }
    if (event.event_name === funnelEventNames.localPageViewed) {
      pageViews += 1;
      const route = stringValue(metadata.route);
      if (route) {
        const stats = localStats.get(route) ?? {
          city: stringValue(metadata.city_slug) ?? "",
          service: eventServiceSlug ?? "",
          views: 0,
          clicks: 0,
          starts: 0,
          submissions: 0,
        };
        stats.views += 1;
        localStats.set(route, stats);
      }
    }
    if (event.event_name === funnelEventNames.publicCtaClicked) {
      ctaClicks += 1;
      if (ctaId && ctaLocation) {
        const key = `${ctaId}:${ctaLocation}`;
        const stats = ctaStats.get(key) ?? { ctaId, location: ctaLocation, clicks: 0, startedSessions: 0, submittedSessions: 0 };
        stats.clicks += 1;
        ctaStats.set(key, stats);
        session.ctaId = ctaId;
        session.ctaLocation = ctaLocation;
      }
      if (eventServiceSlug) {
        const stats = serviceStats.get(eventServiceSlug) ?? { views: 0, clicks: 0, starts: new Set<string>(), submittedSessions: new Set<string>() };
        stats.clicks += 1;
        serviceStats.set(eventServiceSlug, stats);
      }
      if (metadata.page_type === "service_city" || metadata.page_type === "subservice_city") {
        const route = stringValue(metadata.route);
        if (route) {
          const stats = localStats.get(route) ?? {
            city: stringValue(metadata.city_slug) ?? "",
            service: eventServiceSlug ?? "",
            views: 0,
            clicks: 0,
            starts: 0,
            submissions: 0,
          };
          stats.clicks += 1;
          localStats.set(route, stats);
        }
      }
    }
    if (event.event_name === funnelEventNames.leadFunnelStarted) {
      session.started = true;
      session.ctaIdAtStart = session.ctaId;
      session.ctaLocationAtStart = session.ctaLocation;
      session.utmSourceAtStart = session.utmSource;
      session.utmMediumAtStart = session.utmMedium;
      session.utmCampaignAtStart = session.utmCampaign;
      if (typeof metadata.device_category === "string") session.device = metadata.device_category;
      if (typeof metadata.referral_channel === "string") session.channel = metadata.referral_channel;
    }
    if (event.event_name === funnelEventNames.leadSubmitted && event.lead_id) {
      observedSubmissions += 1;
      session.submitted = true;
      const route = stringValue(metadata.source_route) ?? session.sourceRoute;
      if (route) {
        const stats = localStats.get(route);
        if (stats) stats.submissions += 1;
      }
    }
    if (
      event.event_name === funnelEventNames.leadFunnelStepViewed ||
      event.event_name === funnelEventNames.leadFunnelStepCompleted ||
      event.event_name === funnelEventNames.leadFunnelValidationError
    ) {
      const step = stringValue(metadata.step_key);
      if (step && stepOrder.has(step)) {
        const stats = funnelStats.get(step) ?? { viewed: new Set<string>(), completed: new Set<string>(), errors: 0, durations: {} };
        if (event.event_name === funnelEventNames.leadFunnelStepViewed) stats.viewed.add(event.anonymous_session_id);
        if (event.event_name === funnelEventNames.leadFunnelStepCompleted) {
          stats.completed.add(event.anonymous_session_id);
          const duration = stringValue(metadata.duration_bucket);
          if (duration) stats.durations[duration] = (stats.durations[duration] ?? 0) + 1;
        }
        if (event.event_name === funnelEventNames.leadFunnelValidationError) stats.errors += 1;
        funnelStats.set(step, stats);
      }
    }
  }

  const submissionsByService = new Map<string, number>();
  for (const lead of leads) {
    const service = lead.service_id ? serviceById.get(lead.service_id) : null;
    if (service) submissionsByService.set(service.slug, (submissionsByService.get(service.slug) ?? 0) + 1);
  }

  for (const [sessionId, session] of sessions) {
    if (!session.started) continue;
    if (session.serviceSlug) {
      const service = servicesBySlug.get(session.serviceSlug);
      const stats = serviceStats.get(session.serviceSlug) ?? { views: 0, clicks: 0, starts: new Set<string>(), submittedSessions: new Set<string>() };
      stats.starts.add(sessionId);
      if (session.submitted) stats.submittedSessions.add(sessionId);
      serviceStats.set(session.serviceSlug, stats);
      if (service) {
        const local = session.sourceRoute ? localStats.get(session.sourceRoute) : null;
        if (local) local.starts += 1;
      }
    }
  }

  const deviceCounts = new Map<string, { starts: number; submissions: number }>();
  const channelCounts = new Map<string, { starts: number; submissions: number }>();
  let funnelStarts = 0;
  for (const session of sessions.values()) {
    if (!session.started) continue;
    funnelStarts += 1;
    if (session.submitted) convertedSessions += 1;
    const device = deviceCounts.get(session.device) ?? { starts: 0, submissions: 0 };
    device.starts += 1;
    if (session.submitted) device.submissions += 1;
    deviceCounts.set(session.device, device);
    const channel = channelCounts.get(session.channel) ?? { starts: 0, submissions: 0 };
    channel.starts += 1;
    if (session.submitted) channel.submissions += 1;
    channelCounts.set(session.channel, channel);

    if (session.ctaIdAtStart && session.ctaLocationAtStart) {
      const cta = ctaStats.get(`${session.ctaIdAtStart}:${session.ctaLocationAtStart}`);
      if (cta) {
        cta.startedSessions += 1;
        if (session.submitted) cta.submittedSessions += 1;
      }
    }

    if (session.utmSourceAtStart || session.utmMediumAtStart || session.utmCampaignAtStart) {
      const source = session.utmSourceAtStart ?? "unknown";
      const medium = session.utmMediumAtStart ?? "unknown";
      const campaign = session.utmCampaignAtStart ?? "unknown";
      const key = `${source}:${medium}:${campaign}`;
      const utm = utmStats.get(key) ?? { source, medium, campaign, starts: 0, submissions: 0 };
      utm.starts += 1;
      if (session.submitted) utm.submissions += 1;
      utmStats.set(key, utm);
    }
  }

  return {
    eventCount: events.length,
    pageViews,
    ctaClicks,
    funnelStarts,
    observedSubmissions,
    convertedSessions,
    storedLeads: storedLeadTotal ?? leads.length,
    reconciliationDifference: (storedLeadTotal ?? leads.length) - observedSubmissions,
    sampleLimited,
    serviceRows: services.map((service) => {
      const stats = serviceStats.get(service.slug) ?? {
        views: 0,
        clicks: 0,
        starts: new Set<string>(),
        submittedSessions: new Set<string>(),
      };
      const submissions = submissionsByService.get(service.slug) ?? 0;
      return {
        service: service.name,
        slug: service.slug,
        pageViews: stats.views,
        ctaClicks: stats.clicks,
        funnelStarts: stats.starts.size,
        submissions,
        conversionRate: getRate(stats.submittedSessions.size, stats.starts.size),
        lowSample: stats.starts.size < 20,
      };
    }),
    localRows: Array.from(localStats.entries())
      .map(([route, stats]) => ({
        route,
        city: stats.city,
        service: stats.service,
        views: stats.views,
        ctaClicks: stats.clicks,
        starts: stats.starts,
        submissions: stats.submissions,
      }))
      .sort((a, b) => b.views - a.views || a.route.localeCompare(b.route)),
    funnelRows: leadFunnelSteps.map((step) => {
      const stats = funnelStats.get(step) ?? { viewed: new Set<string>(), completed: new Set<string>(), errors: 0, durations: {} };
      const viewed = stats.viewed.size;
      const completed = stats.completed.size;
      return {
        step,
        viewed,
        completed,
        completionRate: getRate(completed, viewed),
        dropOffRate: getRate(Math.max(0, viewed - completed), viewed),
        errors: stats.errors,
        durationBuckets: stats.durations,
      };
    }),
    deviceRows: Array.from(deviceCounts, ([device, counts]) => ({ device, ...counts })),
    channelRows: Array.from(channelCounts, ([channel, counts]) => ({ channel, ...counts })),
    ctaRows: Array.from(ctaStats.values()).sort((a, b) => b.clicks - a.clicks),
    utmRows: Array.from(utmStats.values()).sort((a, b) => b.starts - a.starts),
  };
}
