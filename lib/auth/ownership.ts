export function isProfessionalOwner(currentProfessionalId: string, resourceProfessionalId: string | null | undefined) {
  return Boolean(currentProfessionalId && resourceProfessionalId && currentProfessionalId === resourceProfessionalId);
}
