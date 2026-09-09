import "server-only";

import { revalidatePath } from "next/cache";
import { getLocationRelatedPaths, getRevalidationTargets } from "./revalidation-targets";

export { getRevalidationTargets, getLocationRelatedPaths };

export function revalidateSeoTargets(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}
