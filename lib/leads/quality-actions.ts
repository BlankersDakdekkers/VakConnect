"use server";

import { updateLeadProgressAction } from "./actions";

export async function updateAssignmentQualityAction(formData: FormData) {
  return updateLeadProgressAction(formData);
}
