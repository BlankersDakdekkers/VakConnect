import "server-only";
import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export { buildProfessionalDocumentPath, validateProfessionalDocument } from "./professional-document-utils";

export const professionalDocumentsBucket = "professional-documents";
export const professionalDocumentSignedUrlExpirySeconds = 60 * 5;

type ProfessionalDocumentUrlDependencies = {
  requireAdminUser: typeof requireAdminUser;
  createAdminSupabaseClient: typeof createAdminSupabaseClient;
};

export async function createSignedProfessionalDocumentUrl(
  documentId: string,
  dependencies: ProfessionalDocumentUrlDependencies = {
    requireAdminUser,
    createAdminSupabaseClient,
  },
) {
  await dependencies.requireAdminUser();
  const supabase = dependencies.createAdminSupabaseClient();
  const { data: document, error: documentError } = await supabase
    .from("professional_documents")
    .select("storage_path")
    .eq("id", documentId)
    .maybeSingle();

  if (documentError || !document?.storage_path) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(professionalDocumentsBucket)
    .createSignedUrl(String(document.storage_path), professionalDocumentSignedUrlExpirySeconds);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
