import "server-only";
import { LeadSubmissionError } from "@/lib/leads/errors";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buildLeadImagePath, leadImagesBucket, validateLeadImages } from "@/lib/storage/leads";
import { leadSubmissionSchema } from "@/lib/validation/leads";

export async function createLeadSubmission(formData: FormData) {
  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  try {
    validateLeadImages(files);
  } catch (error) {
    throw new LeadSubmissionError(error instanceof Error ? error.message : "De geüploade afbeeldingen zijn ongeldig.", 400);
  }

  const payload = leadSubmissionSchema.safeParse({
    serviceId: formData.get("serviceId"),
    postalCode: formData.get("postalCode"),
    houseNumber: formData.get("houseNumber"),
    houseNumberAddition: formData.get("houseNumberAddition"),
    description: formData.get("description"),
    urgency: formData.get("urgency"),
    preferredTiming: formData.get("preferredTiming"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  });

  if (!payload.success) {
    throw new LeadSubmissionError(payload.error.issues[0]?.message ?? "De aanvraaggegevens zijn ongeldig.", 400);
  }

  const supabase = createAdminSupabaseClient();
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id")
    .eq("id", payload.data.serviceId)
    .eq("active", true)
    .maybeSingle();

  if (serviceError) {
    throw new LeadSubmissionError("De aanvraag kon niet worden opgeslagen.", 500);
  }

  if (!service) {
    throw new LeadSubmissionError("De gekozen dienst is niet beschikbaar.", 400);
  }

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      service_id: payload.data.serviceId,
      first_name: payload.data.firstName,
      last_name: payload.data.lastName,
      email: payload.data.email,
      phone: payload.data.phone,
      postal_code: payload.data.postalCode,
      house_number: payload.data.houseNumber,
      house_number_addition: payload.data.houseNumberAddition || null,
      city: null,
      description: payload.data.description,
      urgency: payload.data.urgency,
      preferred_timing: payload.data.preferredTiming,
      status: "new",
      source: "website",
    })
    .select("id, public_reference")
    .single();

  if (leadError || !lead) {
    throw new LeadSubmissionError("De aanvraag kon niet worden opgeslagen.", 500);
  }

  const uploadedPaths: string[] = [];

  try {
    for (const file of files) {
      const path = buildLeadImagePath(lead.id, file.type);
      const { error: uploadError } = await supabase.storage
        .from(leadImagesBucket)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        throw new LeadSubmissionError("Een of meer afbeeldingen konden niet worden opgeslagen.", 500);
      }

      uploadedPaths.push(path);
      const { error: imageError } = await supabase.from("lead_images").insert({
        lead_id: lead.id,
        storage_path: path,
        mime_type: file.type,
        file_size: file.size,
      });

      if (imageError) {
        throw new LeadSubmissionError("De afbeeldingsmetadata kon niet worden opgeslagen.", 500);
      }
    }
  } catch (error) {
    if (uploadedPaths.length) {
      await supabase.storage.from(leadImagesBucket).remove(uploadedPaths);
    }
    await supabase.from("leads").delete().eq("id", lead.id);
    if (error instanceof LeadSubmissionError) {
      throw error;
    }
    throw new LeadSubmissionError("De aanvraag kon niet worden opgeslagen.", 500);
  }

  return { reference: lead.public_reference };
}
