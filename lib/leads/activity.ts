import "server-only";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { LeadActivityType, LeadProgressStatus } from "@/types/database";
import { sanitizeAnalyticsMetadata } from "@/lib/analytics/privacy";

export async function addLeadActivity(input: {
  leadId: string;
  activityType: LeadActivityType;
  professionalId?: string | null;
  actorUserId?: string | null;
  fromStatus?: LeadProgressStatus | null;
  toStatus?: LeadProgressStatus | null;
  metadata?: Record<string, unknown> | null;
}) {
  const supabase = createAdminSupabaseClient();
  await supabase.from("lead_activity").insert({
    lead_id: input.leadId,
    activity_type: input.activityType,
    professional_id: input.professionalId ?? null,
    actor_user_id: input.actorUserId ?? null,
    from_status: input.fromStatus ?? null,
    to_status: input.toStatus ?? null,
    metadata: sanitizeAnalyticsMetadata(input.metadata ?? null),
  });
}
