"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser, requireProfessionalUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  assignmentCreationSchema,
  assignmentDecisionSchema,
  leadStatusUpdateSchema,
} from "@/lib/validation/leads";
import { addLeadActivity } from "@/lib/leads/activity";
import { isProfessionalOwner } from "@/lib/auth/ownership";
import { isValidLeadProgressTransition } from "@/lib/leads/progress";
import { assignmentQualityUpdateSchema, assignmentRejectionFeedbackSchema } from "@/lib/leads/quality-taxonomy";

function redirectWithMessage(path: string, key: "error" | "success", message: string): never {
  const search = new URLSearchParams({ [key]: message });
  redirect(`${path}?${search.toString()}`);
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireAdminUser();

  const payload = leadStatusUpdateSchema.safeParse({
    leadId: formData.get("lead_id"),
    status: formData.get("status"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/leads", "error", "Leadstatus kon niet worden bijgewerkt.");
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("leads")
    .update({ status: payload.data.status, updated_at: new Date().toISOString() })
    .eq("id", payload.data.leadId);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Leadstatus kon niet worden bijgewerkt.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Leadstatus bijgewerkt.");
}

export async function assignLeadAction(formData: FormData) {
  await requireAdminUser();

  const payload = assignmentCreationSchema.safeParse({
    leadId: formData.get("lead_id"),
    professionalId: formData.get("professional_id"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/leads", "error", "Lead kon niet worden toegewezen.");
  }

  const supabase = createAdminSupabaseClient();
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id, service_id")
    .eq("id", payload.data.leadId)
    .maybeSingle();
  const { data: professional, error: professionalError } = await supabase
    .from("professionals")
    .select("id, status")
    .eq("id", payload.data.professionalId)
    .maybeSingle();

  if (leadError || professionalError || !lead || !professional || professional.status !== "active") {
    redirectWithMessage(payload.data.redirectTo, "error", "Lead kon niet worden toegewezen aan deze vakman.");
  }

  const { data: validServiceLink } = await supabase
    .from("professional_services")
    .select("id")
    .eq("professional_id", payload.data.professionalId)
    .eq("service_id", lead.service_id)
    .eq("active", true)
    .maybeSingle();

  if (!validServiceLink) {
    redirectWithMessage(payload.data.redirectTo, "error", "Deze vakman biedt de gekozen dienst niet aan.");
  }

  const now = new Date().toISOString();
  const { error: assignmentError } = await supabase.from("lead_assignments").insert({
    lead_id: payload.data.leadId,
    professional_id: payload.data.professionalId,
    status: "pending",
    progress_status: "new",
    assigned_at: now,
  });

  if (assignmentError) {
    redirectWithMessage(payload.data.redirectTo, "error", "De lead kon niet worden gekoppeld. Mogelijk bestaat de toewijzing al.");
  }

  await supabase.from("leads").update({ status: "assigned", updated_at: now }).eq("id", payload.data.leadId);
  await addLeadActivity({
    leadId: payload.data.leadId,
    professionalId: payload.data.professionalId,
    activityType: "lead_assigned",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Lead toegewezen aan vakman.");
}

export async function respondToAssignmentAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = assignmentDecisionSchema.safeParse({
    leadId: formData.get("lead_id"),
    decision: formData.get("decision"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/vakman/aanvragen", "error", "De aanvraag kon niet worden bijgewerkt.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: assignment, error: assignmentError } = await supabase
    .from("lead_assignments")
    .select("id, lead_id, professional_id, status, progress_status, quality_updated_at")
    .eq("lead_id", payload.data.leadId)
    .eq("professional_id", user.professional.id)
    .maybeSingle();

  if (assignmentError || !assignment || !isProfessionalOwner(user.professional.id, assignment.professional_id)
    || !["pending", "viewed"].includes(assignment.status) || ["won", "lost"].includes(assignment.progress_status)) {
    redirectWithMessage(payload.data.redirectTo, "error", "Deze aanvraag is niet beschikbaar voor jouw account.");
  }

  const now = new Date().toISOString();
  const nextStatus = payload.data.decision;
  const feedback = assignmentRejectionFeedbackSchema.safeParse({
    mismatchReason: formData.get("mismatch_reason"),
    feedbackNote: formData.get("feedback_note"),
  });
  const hasFeedback = Boolean(formData.get("mismatch_reason") || formData.get("feedback_note"));
  const expectedUpdatedAt = formData.get("expected_quality_updated_at");
  if (!feedback.success || (hasFeedback && (nextStatus !== "rejected"
    || typeof expectedUpdatedAt !== "string" || !expectedUpdatedAt))) {
    redirectWithMessage(payload.data.redirectTo, "error", "Kies een geldige reden en vernieuw de aanvraag voordat je feedback opslaat.");
  }
  const { error } = await supabase
    .from("lead_assignments")
    .update({
      status: nextStatus,
      accepted_at: nextStatus === "accepted" ? now : null,
      rejected_at: nextStatus === "rejected" ? now : null,
      viewed_at: now,
      ...(hasFeedback ? {
        mismatch_reason: feedback.data.mismatchReason,
        feedback_note: feedback.data.feedbackNote,
      } : {}),
    })
    .eq("id", assignment.id)
    .eq("professional_id", user.professional.id)
    .eq("status", assignment.status)
    .eq("quality_updated_at", hasFeedback ? expectedUpdatedAt as string : assignment.quality_updated_at)
    .select("id")
    .single();

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De aanvraag kon niet worden bijgewerkt.");
  }

  await addLeadActivity({
    leadId: payload.data.leadId,
    professionalId: user.professional.id,
    actorUserId: user.id,
    activityType: nextStatus === "accepted" ? "assignment_accepted" : "assignment_rejected",
  });

  revalidatePath("/vakman");
  revalidatePath("/vakman/aanvragen");
  revalidatePath(`/vakman/aanvragen/${payload.data.leadId}`);
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(payload.data.redirectTo, "success", nextStatus === "accepted" ? "Aanvraag geaccepteerd." : "Aanvraag geweigerd.");
}

export async function updateLeadProgressAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = assignmentQualityUpdateSchema.safeParse({
    leadId: formData.get("lead_id"),
    progressStatus: formData.get("progress_status"),
    lossReason: formData.get("loss_reason"),
    expectedUpdatedAt: formData.get("expected_quality_updated_at"),
    reachability: formData.get("reachability"),
    appointmentStatus: formData.get("appointment_status"),
    mismatchReason: formData.get("mismatch_reason"),
    feedbackNote: formData.get("feedback_note"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/vakman/aanvragen", "error", payload.error.issues[0]?.message ?? "Status kon niet worden bijgewerkt.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: assignment, error: assignmentError } = await supabase
    .from("lead_assignments")
    .select("id, status, progress_status, professional_id")
    .eq("lead_id", payload.data.leadId)
    .eq("professional_id", user.professional.id)
    .maybeSingle();

  if (assignmentError || !assignment || assignment.status !== "accepted" || !isProfessionalOwner(user.professional.id, assignment.professional_id)) {
    redirectWithMessage(payload.data.redirectTo, "error", "Je kunt alleen geaccepteerde leads opvolgen.");
  }

  const fromStatus = assignment.progress_status;
  const toStatus = payload.data.progressStatus;
  if (!isValidLeadProgressTransition(fromStatus, toStatus)) {
    redirectWithMessage(payload.data.redirectTo, "error", `Ongeldige statuswijziging van ${fromStatus} naar ${toStatus}.`);
  }

  const { error } = await supabase.rpc("update_assignment_quality", {
    p_assignment_id: assignment.id,
    p_expected_updated_at: payload.data.expectedUpdatedAt,
    p_progress_status: toStatus,
    p_reachability: payload.data.reachability,
    p_appointment_status: payload.data.appointmentStatus,
    p_loss_reason: payload.data.lossReason,
    p_mismatch_reason: payload.data.mismatchReason,
    p_feedback_note: payload.data.feedbackNote,
  });

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", error.message.includes("QUALITY_STALE_WRITE")
      ? "Deze aanvraag is intussen gewijzigd. Vernieuw de pagina en probeer opnieuw."
      : "Status kon niet worden bijgewerkt.");
  }

  revalidatePath("/vakman");
  revalidatePath("/vakman/aanvragen");
  revalidatePath(`/vakman/aanvragen/${payload.data.leadId}`);
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Voortgang bijgewerkt.");
}
