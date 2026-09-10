"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser, requireProfessionalUser } from "@/lib/auth/helpers";
import {
  adminAddManualOffer,
  adminPauseDistributionRun,
  adminRequeueLeadDistribution,
  adminSkipDistributionCandidate,
  declineDistributionOffer,
  processDistributionExpirations,
  markDistributionOfferViewed,
  startLeadDistribution,
} from "@/lib/distribution/engine";
import {
  adminDistributionLeadSchema,
  adminDistributionManualOfferSchema,
  adminDistributionPauseSchema,
  adminDistributionRunSchema,
  professionalOfferDeclineSchema,
  professionalOfferViewSchema,
} from "@/lib/validation/distribution";

function redirectWithMessage(path: string, key: "error" | "success", message: string): never {
  const params = new URLSearchParams({ [key]: message });
  redirect(`${path}?${params.toString()}`);
}

export async function startDistributionRunAction(formData: FormData) {
  const user = await requireAdminUser();
  const payload = adminDistributionLeadSchema.safeParse({
    leadId: formData.get("lead_id"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/distributie", "error", "Distributierun kon niet worden gestart.");
  }

  try {
    await startLeadDistribution(payload.data.leadId, user.id);
  } catch (error) {
    redirectWithMessage(payload.data.redirectTo, "error", error instanceof Error ? error.message : "Distributierun kon niet worden gestart.");
  }

  revalidatePath("/admin/distributie");
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Distributierun gestart.");
}

export async function skipDistributionCandidateAction(formData: FormData) {
  const user = await requireAdminUser();
  const payload = adminDistributionRunSchema.safeParse({
    candidateId: formData.get("candidate_id"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/distributie", "error", "Kandidaat kon niet worden overgeslagen.");
  }

  await adminSkipDistributionCandidate(payload.data.candidateId, user.id);

  revalidatePath("/admin/distributie");
  redirectWithMessage(payload.data.redirectTo, "success", "Kandidaat overgeslagen.");
}

export async function requeueLeadDistributionAction(formData: FormData) {
  const user = await requireAdminUser();
  const payload = adminDistributionLeadSchema.safeParse({
    leadId: formData.get("lead_id"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/distributie", "error", "Lead kon niet opnieuw in distributie worden gezet.");
  }

  export async function pauseDistributionRunAction(formData: FormData) {
    const user = await requireAdminUser();
    const payload = adminDistributionPauseSchema.safeParse({
      runId: formData.get("run_id"),
      redirectTo: formData.get("redirect_to"),
    });

    if (!payload.success) {
      redirectWithMessage("/admin/distributie", "error", "Run kon niet worden gepauzeerd.");
    }

    await adminPauseDistributionRun(payload.data.runId, user.id);
    revalidatePath("/admin/distributie");
    redirectWithMessage(payload.data.redirectTo, "success", "Run gepauzeerd.");
  }

  await adminRequeueLeadDistribution(payload.data.leadId, user.id);

  revalidatePath("/admin/distributie");
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Lead opnieuw in distributie gezet.");
}

export async function addManualDistributionOfferAction(formData: FormData) {
  const user = await requireAdminUser();
  const payload = adminDistributionManualOfferSchema.safeParse({
    leadId: formData.get("lead_id"),
    professionalId: formData.get("professional_id"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/admin/distributie", "error", "Vakman kon niet handmatig worden toegevoegd.");
  }

  await adminAddManualOffer(payload.data.leadId, payload.data.professionalId, user.id);

  revalidatePath("/admin/distributie");
  revalidatePath(`/admin/leads/${payload.data.leadId}`);
  redirectWithMessage(payload.data.redirectTo, "success", "Handmatige offer toegevoegd.");
}

export async function declineDistributionOfferAction(formData: FormData) {
  const user = await requireProfessionalUser();
  const payload = professionalOfferDeclineSchema.safeParse({
    candidateId: formData.get("candidate_id"),
    reason: formData.get("reason"),
    redirectTo: formData.get("redirect_to"),
  });

  if (!payload.success) {
    redirectWithMessage("/vakman/aanvragen", "error", payload.error.issues[0]?.message ?? "Aanbod kon niet worden geweigerd.");
  }

  export async function viewDistributionOfferAction(formData: FormData) {
    const user = await requireProfessionalUser();
    const payload = professionalOfferViewSchema.safeParse({
      candidateId: formData.get("candidate_id"),
      redirectTo: formData.get("redirect_to"),
    });

    if (!payload.success) {
      redirectWithMessage("/vakman/aanvragen", "error", "Offer kon niet worden geopend.");
    }

    await markDistributionOfferViewed(payload.data.candidateId, user.professional.id);
    revalidatePath("/vakman/aanvragen");
    redirect(payload.data.redirectTo);
  }

  try {
    await declineDistributionOffer(payload.data.candidateId, user.professional.id, payload.data.reason);
  } catch (error) {
    redirectWithMessage(payload.data.redirectTo, "error", error instanceof Error ? error.message : "Aanbod kon niet worden geweigerd.");
  }

  revalidatePath("/vakman/aanvragen");
  revalidatePath(payload.data.redirectTo);
  redirectWithMessage(payload.data.redirectTo, "success", "Aanbod geweigerd.");
}

export async function processDistributionExpirationsAction() {
  await requireAdminUser();
  const updated = await processDistributionExpirations();
  revalidatePath("/admin/distributie");
  redirectWithMessage("/admin/distributie", "success", `${updated} offer(s) verwerkt.`);
}
