import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export { buildProfessionalDocumentPath, validateProfessionalDocument } from "./professional-document-utils";

export const professionalDocumentsBucket = "professional-documents";
export const professionalDocumentSignedUrlExpirySeconds = 60 * 5;

export async function createSignedProfessionalDocumentUrl(path: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.storage
    .from(professionalDocumentsBucket)
    .createSignedUrl(path, professionalDocumentSignedUrlExpirySeconds);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
