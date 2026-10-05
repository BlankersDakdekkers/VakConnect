"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/helpers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { reviewMutationSchema, reviewErrorMessage, reviewUuidSchema } from "@/lib/leads/review-taxonomy";

export async function updateLeadQualityReviewAction(formData: FormData) {
  await requireAdminUser();
  const id = formData.get("lead_id");
  const path = reviewUuidSchema.safeParse(id).success ? `/admin/leadkwaliteit/review/${id}` : "/admin/leadkwaliteit/review";
  const payload = reviewMutationSchema.safeParse({
    leadId: id, expectedUpdatedAt: formData.get("expected_updated_at"), status: formData.get("status"),
    resolution: formData.get("resolution"), note: formData.get("note"), confirmed: formData.get("confirmed") === "on",
  });
  if (!payload.success) {
    redirect(`${path}?${new URLSearchParams({ error: "Controleer status, reden en notitie (maximaal 2000 tekens). Bevestig afsluiten; kies geen afhandelreden bij heropenen." })}`);
  }
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("admin_update_lead_quality_review", {
    p_lead_id: payload.data.leadId, p_expected_updated_at: payload.data.expectedUpdatedAt,
    p_status: payload.data.status, p_resolution: payload.data.resolution, p_note: payload.data.note,
  });
  if (error) redirect(`${path}?${new URLSearchParams({ error: reviewErrorMessage(error.message) })}`);
  revalidatePath("/admin/leadkwaliteit");
  revalidatePath("/admin/leadkwaliteit/review");
  revalidatePath(path);
  redirect(`${path}?${new URLSearchParams({ success: "Review opgeslagen. Geen aankoop, refund of uitkomst gewijzigd." })}`);
}
