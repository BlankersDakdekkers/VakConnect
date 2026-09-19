import { randomUUID } from "node:crypto";
import { allowedProfessionalDocumentTypes, maxProfessionalDocumentSizeBytes } from "../validation/constants.ts";

function normalizeFilename(name: string) {
  const base = name.split(/[\\/]/).pop() ?? "document";
  const safe = base
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);
  return safe || "document";
}

function extensionForMimeType(mimeType: string) {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType === "image/png") return "png";
  return "jpg";
}

export function validateProfessionalDocument(file: File) {
  if (!allowedProfessionalDocumentTypes.includes(file.type as (typeof allowedProfessionalDocumentTypes)[number])) {
    throw new Error("Alleen PDF, JPG en PNG documenten zijn toegestaan.");
  }

  if (file.size <= 0 || file.size > maxProfessionalDocumentSizeBytes) {
    throw new Error("Documenten mogen maximaal 10 MB groot zijn.");
  }

  const normalized = normalizeFilename(file.name);
  if (!normalized || normalized === "." || normalized === "..") {
    throw new Error("Ongeldige bestandsnaam.");
  }

  return {
    originalFilename: normalized,
    extension: extensionForMimeType(file.type),
  };
}

export function buildProfessionalDocumentPath(professionalId: string, documentId: string, file: File) {
  const { extension } = validateProfessionalDocument(file);
  return `professionals/${professionalId}/documents/${documentId}/${randomUUID()}.${extension}`;
}
