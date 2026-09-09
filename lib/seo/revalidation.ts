import "server-only";

import { revalidatePath } from "next/cache";
import type { DatabaseBackedLocalPage } from "@/lib/seo/types";

export function getRevalidationTargets(input: {
  locationSlug: string;
  serviceSlug?: string;
  subserviceSlug?: string | null;
  existingPaths?: string[];
}) {
  const set = new Set<string>(["/regios", "/admin/seo", "/admin/seo/locaties", "/admin/seo/lokaal", "/sitemap.xml"]);

  if (input.serviceSlug) {
    set.add(`/${input.serviceSlug}/${input.locationSlug}`);
    if (input.subserviceSlug) {
      set.add(`/${input.serviceSlug}/${input.subserviceSlug}/${input.locationSlug}`);
    }
  }

  for (const path of input.existingPaths ?? []) {
    if (path.includes(`/${input.locationSlug}`)) {
      set.add(path);
    }
  }

  return [...set];
}

export function revalidateSeoTargets(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

export function getLocationRelatedPaths(locationSlug: string, pages: DatabaseBackedLocalPage[]) {
  return pages.filter((page) => page.citySlug === locationSlug).map((page) => page.canonicalPath);
}
