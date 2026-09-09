import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buildLeadImagePath, leadImagesBucket, validateLeadImages } from "@/lib/storage/leads";
import { leadSubmissionSchema } from "@/lib/validation/leads";

export async function createLeadSubmission(formData: FormData) {
  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  validateLeadImages(files);

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
    throw new Error(payload.error.issues[0]?.message ?? "De aanvraaggegevens zijn ongeldig.");
  }

  const supabase = createAdminSupabaseClient();
  const { data: service } = await supabase
    .from("services")
    .select("id")
    .eq("id", payload.data.serviceId)
    .eq("active", true)
    .maybeSingle();

  if (!service) {
    throw new Error("De gekozen dienst is niet beschikbaar.");
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
    throw new Error("De aanvraag kon niet worden opgeslagen.");
  }

  const uploadedPaths: string[] = [];

  try {
    for (const file of files) {
      const path = buildLeadImagePath(lead.id, file.type);
      const { error: uploadError } = await supabase.storage
        .from(leadImagesBucket)
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        throw new Error("Een of meer afbeeldingen konden niet worden opgeslagen.");
      }

      uploadedPaths.push(path);
      const { error: imageError } = await supabase.from("lead_images").insert({
        lead_id: lead.id,
        storage_path: path,
        mime_type: file.type,
        file_size: file.size,
      });

      if (imageError) {
        throw new Error("De afbeeldingsmetadata kon niet worden opgeslagen.");
      }
    }
  } catch (error) {
    if (uploadedPaths.length) {
      await supabase.storage.from(leadImagesBucket).remove(uploadedPaths);
    }
    await supabase.from("leads").delete().eq("id", lead.id);
    throw error;
  }

  return { reference: lead.public_reference };
}
