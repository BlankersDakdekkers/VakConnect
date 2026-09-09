"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser, requireProfessionalUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { assignmentCreationSchema, assignmentDecisionSchema, leadStatusUpdateSchema } from "@/lib/validation/leads";

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

  const { error: assignmentError } = await supabase.from("lead_assignments").insert({
    lead_id: payload.data.leadId,
    professional_id: payload.data.professionalId,
    status: "pending",
    assigned_at: new Date().toISOString(),
  });

  if (assignmentError) {
    redirectWithMessage(payload.data.redirectTo, "error", "De lead kon niet worden gekoppeld. Mogelijk bestaat de toewijzing al.");
  }

  await supabase.from("leads").update({ status: "assigned", updated_at: new Date().toISOString() }).eq("id", payload.data.leadId);

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
    .select("id, lead_id")
    .eq("lead_id", payload.data.leadId)
    .eq("professional_id", user.professional.id)
    .maybeSingle();

  if (assignmentError || !assignment) {
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
    })
    .eq("id", assignment.id)
    .eq("professional_id", user.professional.id);

  if (error) {
    redirectWithMessage(payload.data.redirectTo, "error", "De aanvraag kon niet worden bijgewerkt.");
  }

  const admin = createAdminSupabaseClient();
  await admin.from("leads").update({ status: nextStatus, updated_at: now }).eq("id", payload.data.leadId);

  revalidatePath("/vakman");
  revalidatePath("/vakman/aanvragen");
  revalidatePath(`/vakman/aanvragen/${payload.data.leadId}`);
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(payload.data.redirectTo, "success", nextStatus === "accepted" ? "Aanvraag geaccepteerd." : "Aanvraag geweigerd.");
}
