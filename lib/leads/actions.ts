"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser, requireProfessionalUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  assignmentCreationSchema,
  assignmentDecisionSchema,
  assignmentProgressUpdateSchema,
  leadStatusUpdateSchema,
} from "@/lib/validation/leads";
import { addLeadActivity } from "@/lib/leads/activity";
import { isProfessionalOwner } from "@/lib/auth/ownership";
import { isValidLeadProgressTransition, normalizeLeadLossReason } from "@/lib/leads/progress";

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
    .select("id, lead_id, professional_id")
    .eq("lead_id", payload.data.leadId)
    .eq("professional_id", user.professional.id)
    .maybeSingle();

  if (assignmentError || !assignment || !isProfessionalOwner(user.professional.id, assignment.professional_id)) {
    redirectWithMessage(payload.data.redirectTo, "error", "Deze aanvraag is niet beschikbaar voor jouw account.");
  }

  const now = new Date().toISOString();
  const nextStatus = payload.data.decision;
  const { error } = await supabase
    .from("lead_assignments")
    .update({
      status: nextStatus,
      accepted_at: nextStatus === "accepted" ? now : null,
      rejected_at: nextStatus === "rejected" ? now : null,
      viewed_at: now,
      progress_status: "new",
      progress_updated_at: nextStatus === "accepted" ? now : null,
      loss_reason: null,
    })
    .eq("id", assignment.id)
    .eq("professional_id", user.professional.id);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De aanvraag kon niet worden bijgewerkt.");
  }

  const admin = createAdminSupabaseClient();
  await admin.from("leads").update({ status: nextStatus, updated_at: now }).eq("id", payload.data.leadId);
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
  const payload = assignmentProgressUpdateSchema.safeParse({
    leadId: formData.get("lead_id"),
    progressStatus: formData.get("progress_status"),
    lossReason: formData.get("loss_reason"),
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

  const normalizedLossReason = toStatus === "lost" ? normalizeLeadLossReason(payload.data.lossReason) : null;
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("lead_assignments")
    .update({
      progress_status: toStatus,
      progress_updated_at: now,
      loss_reason: normalizedLossReason,
    })
    .eq("id", assignment.id)
    .eq("professional_id", user.professional.id)
    .eq("status", "accepted");

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "Status kon niet worden bijgewerkt.");
  }

  if (toStatus === "won" || toStatus === "lost") {
    const admin = createAdminSupabaseClient();
    await admin.from("leads").update({ status: toStatus, updated_at: now }).eq("id", payload.data.leadId);
  }

  await addLeadActivity({
    leadId: payload.data.leadId,
    professionalId: user.professional.id,
    actorUserId: user.id,
    activityType: "progress_updated",
    fromStatus,
    toStatus,
  });

  if (normalizedLossReason) {
    await addLeadActivity({
      leadId: payload.data.leadId,
      professionalId: user.professional.id,
      actorUserId: user.id,
      activityType: "loss_reason_recorded",
      fromStatus,
      toStatus,
      metadata: { reason: normalizedLossReason },
    });
  }

  revalidatePath("/vakman");
  revalidatePath("/vakman/aanvragen");
  revalidatePath(`/vakman/aanvragen/${payload.data.leadId}`);
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Voortgang bijgewerkt.");
}
