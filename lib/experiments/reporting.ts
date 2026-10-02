export type ExperimentReportEvent = {
  event_name: string;
  anonymous_session_id: string;
  lead_id: string | null;
  metadata: unknown;
  created_at: string;
};

export type ExperimentReportVariant = {
  id: string;
  key: string;
  label: string;
  weight: number;
  is_control: boolean;
};

const exposureOrderingToleranceMs = 120_000;

function metadataFor(event: ExperimentReportEvent) {
  return event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata)
    ? (event.metadata as Record<string, unknown>)
    : {};
}

function rate(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 1000) / 10 : null;
}

export function buildExperimentPerformance(input: {
  experimentId: string;
  goalEvent: string;
  variants: ExperimentReportVariant[];
  events: ExperimentReportEvent[];
}) {
  const variantRows = input.variants.map((variant) => {
    const exposedAt = new Map<string, number>();
    const deviceSessions = new Map<string, Map<string, number>>();
    const clicks = new Set<string>();
    const starts = new Set<string>();
    const leads = new Set<string>();
    const submittedSessions = new Set<string>();

    for (const event of input.events) {
      const metadata = metadataFor(event);
      if (metadata.experiment_id !== input.experimentId || metadata.variant_id !== variant.id) continue;

      if (event.event_name === "experiment_exposed") {
        const timestamp = Date.parse(event.created_at);
        const current = exposedAt.get(event.anonymous_session_id);
        if (current === undefined || timestamp < current) exposedAt.set(event.anonymous_session_id, timestamp);
        const device = metadata.device_category;
        if (device === "mobile" || device === "tablet" || device === "desktop") {
          const sessions = deviceSessions.get(device) ?? new Map<string, number>();
          const currentDeviceExposure = sessions.get(event.anonymous_session_id);
          if (currentDeviceExposure === undefined || timestamp < currentDeviceExposure) {
            sessions.set(event.anonymous_session_id, timestamp);
          }
          deviceSessions.set(device, sessions);
        }
      }
    }

    for (const event of input.events) {
      const metadata = metadataFor(event);
      const exposedTimestamp = exposedAt.get(event.anonymous_session_id);
      if (exposedTimestamp === undefined || Date.parse(event.created_at) < exposedTimestamp - exposureOrderingToleranceMs) continue;

      const hasVariantContext = metadata.experiment_id === input.experimentId && metadata.variant_id === variant.id;
      if (event.event_name === "public_cta_click" && hasVariantContext) clicks.add(event.anonymous_session_id);
      if (event.event_name === "lead_funnel_started") starts.add(event.anonymous_session_id);
      if (event.event_name === "lead_submitted" && event.lead_id) {
        leads.add(event.lead_id);
        submittedSessions.add(event.anonymous_session_id);
      }
    }

    return {
      ...variant,
      exposures: exposedAt.size,
      ctaClicks: clicks.size,
      funnelStarts: starts.size,
      leads: leads.size,
      ctaCtr: rate(clicks.size, exposedAt.size),
      funnelStartRate: rate(starts.size, exposedAt.size),
      leadConversionRate: rate(submittedSessions.size, exposedAt.size),
      goalConversions: input.goalEvent === "public_cta_click" ? clicks.size : input.goalEvent === "lead_funnel_started" ? starts.size : submittedSessions.size,
      deviceRows: Array.from(deviceSessions, ([device, sessions]) => {
        const deviceClicks = new Set<string>();
        const deviceStarts = new Set<string>();
        const deviceLeads = new Set<string>();
        const deviceSubmittedSessions = new Set<string>();
        for (const event of input.events) {
          const exposedTimestamp = sessions.get(event.anonymous_session_id);
          if (exposedTimestamp === undefined || Date.parse(event.created_at) < exposedTimestamp - exposureOrderingToleranceMs) continue;
          const metadata = metadataFor(event);
          if (event.event_name === "public_cta_click" && metadata.experiment_id === input.experimentId && metadata.variant_id === variant.id) {
            deviceClicks.add(event.anonymous_session_id);
          }
          if (event.event_name === "lead_funnel_started") deviceStarts.add(event.anonymous_session_id);
          if (event.event_name === "lead_submitted" && event.lead_id) {
            deviceLeads.add(event.lead_id);
            deviceSubmittedSessions.add(event.anonymous_session_id);
          }
        }
        return {
          device,
          exposures: sessions.size,
          ctaClicks: deviceClicks.size,
          funnelStarts: deviceStarts.size,
          leads: deviceLeads.size,
          leadConversionRate: rate(deviceSubmittedSessions.size, sessions.size),
          lowSample: sessions.size < 50,
        };
      }).sort((left, right) => left.device.localeCompare(right.device)),
      goalRate: rate(
        input.goalEvent === "public_cta_click" ? clicks.size : input.goalEvent === "lead_funnel_started" ? starts.size : submittedSessions.size,
        exposedAt.size,
      ),
    };
  });

  const control = variantRows.find((variant) => variant.is_control);
  const rows = variantRows.map((variant) => ({
    ...variant,
    differenceFromControl: control?.goalRate !== null && control?.goalRate !== undefined && variant.goalRate !== null
      ? Math.round((variant.goalRate - control.goalRate) * 10) / 10
      : null,
    warnings: [
      ...(variant.exposures < 50 ? ["Minder dan 50 exposures"] : []),
      ...(variant.funnelStarts < 20 ? ["Minder dan 20 funnelstarts"] : []),
      ...(variant.leads < 10 ? ["Minder dan 10 inzendingen"] : []),
    ],
  }));

  return {
    rows,
    eventSampleLimited: input.events.length >= 5000,
  };
}
