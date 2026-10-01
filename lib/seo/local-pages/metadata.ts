export function buildLocalPageMetadata(input: { serviceName: string; cityName: string; subserviceName?: string | null }) {
  const service = input.subserviceName ?? input.serviceName;
  const titleService = service
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const subject = `${titleService} in ${input.cityName}`;
  return {
    title: `${subject} | VakConnect`,
    description: input.subserviceName
      ? `Laat ${input.subserviceName.toLowerCase()} in ${input.cityName} beoordelen. Deel situatie, planning en bereikbaarheid via VakConnect.`
      : `Op zoek naar ${input.serviceName.toLowerCase()} in ${input.cityName}? Beschrijf je klus en planning. VakConnect zoekt passende vakmensen.`,
  };
}
