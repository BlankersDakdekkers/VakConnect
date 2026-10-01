import "server-only";
import { requireAdminUser } from "@/lib/auth/helpers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export { buildProfessionalDocumentPath, validateProfessionalDocument } from "./professional-document-utils";

export const professionalDocumentsBucket = "professional-documents";
export const professionalDocumentSignedUrlExpirySeconds = 60 * 5;

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isOwnedProfessionalDocumentPath(storagePath: unknown, professionalId: unknown, documentId: unknown) {
  if (typeof storagePath !== "string" || typeof professionalId !== "string" || typeof documentId !== "string") {
    return false;
  }
  if (!uuidPattern.test(professionalId) || !uuidPattern.test(documentId)) {
    return false;
  }
  const prefix = `professionals/${professionalId}/documents/${documentId}/`;
  if (!storagePath.startsWith(prefix)) {
    return false;
  }
  const filename = storagePath.slice(prefix.length);
  return /^[A-Za-z0-9._-]+$/.test(filename) && filename !== "." && filename !== "..";
}

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

  if (typeof documentId !== "string" || !uuidPattern.test(documentId)) {
    return null;
  }

  const supabase = dependencies.createAdminSupabaseClient();
  const { data: document, error: documentError } = await supabase
    .from("professional_documents")
    .select("id, professional_id, storage_path")
    .eq("id", documentId)
    .maybeSingle();

  if (documentError || !document?.storage_path) {
    return null;
  }

  if (!isOwnedProfessionalDocumentPath(document.storage_path, document.professional_id, document.id)) {
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
