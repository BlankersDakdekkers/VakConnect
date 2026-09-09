export function sanitizeProfessionalSelfUpdateInput(input: {
  contactName: string;
  phone: string;
  website?: string | null;
  description?: string | null;
}) {
  return {
    contact_name: input.contactName,
    phone: input.phone,
    website: input.website?.trim() ? input.website.trim() : null,
    description: input.description?.trim() ? input.description.trim() : null,
    updated_at: new Date().toISOString(),
  };
}
