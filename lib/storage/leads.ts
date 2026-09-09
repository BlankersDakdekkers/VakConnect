import "server-only";
import { randomUUID } from "node:crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  allowedLeadImageTypes,
  maxLeadImageCount,
  maxLeadImageSizeBytes,
} from "@/lib/validation/constants";

export const leadImagesBucket = "lead-images";

export function validateLeadImages(files: File[]) {
  if (files.length > maxLeadImageCount) {
    throw new Error(`Je kunt maximaal ${maxLeadImageCount} afbeeldingen uploaden.`);
  }

  for (const file of files) {
    if (!allowedLeadImageTypes.includes(file.type as (typeof allowedLeadImageTypes)[number])) {
      throw new Error("Alleen JPG, PNG en WebP afbeeldingen zijn toegestaan.");
    }

    if (file.size > maxLeadImageSizeBytes) {
      throw new Error("Elke afbeelding mag maximaal 5 MB groot zijn.");
    }
  }
}

export function buildLeadImagePath(leadId: string, mimeType: string) {
  const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  return `leads/${leadId}/${randomUUID()}.${extension}`;
}

export async function createSignedLeadImageUrls(paths: string[]) {
  if (!paths.length) {
    return [] as Array<{ path: string; url: string | null }>;
  }

  const supabase = createAdminSupabaseClient();
  const results = await Promise.all(
    paths.map(async (path) => {
      const { data, error } = await supabase.storage.from(leadImagesBucket).createSignedUrl(path, 60 * 30);
      return { path, url: error ? null : data.signedUrl };
    }),
  );

  return results;
}
