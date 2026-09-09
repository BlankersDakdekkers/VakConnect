import type { Service } from "@/types/database";

export type EditorialCluster = {
  href: string;
  title: string;
  description: string;
};

export const serviceDetailRoutes: Record<string, string> = {
  dakdekker: "/dakdekker",
  schilder: "/schilder",
  loodgieter: "/loodgieter",
  elektricien: "/elektricien",
  isolatie: "/isolatie",
  badkamer: "/badkamer",
  "badkamer-verbouwen": "/badkamer",
  kozijnen: "/kozijnen",
  verbouwing: "/verbouwing",
};

const editorialClusters: EditorialCluster[] = [
  {
    href: "/kozijnen",
    title: "Kozijnen",
    description: "Materiaalkeuze, montage, glasopties en onderhoud voor ramen en deuren.",
  },
  {
    href: "/badkamer",
    title: "Badkamer",
    description: "Renovatie, sanitair, tegelwerk, ventilatie en planning tussen vakgebieden.",
  },
  {
    href: "/verbouwing",
    title: "Verbouwing",
    description: "Aanbouw, uitbouw en renovatie met aandacht voor fasering en uitvoerbaarheid.",
  },
];

export function getServiceDetailHref(slug: string) {
  return serviceDetailRoutes[slug];
}

export function getEditorialClusters(services: Pick<Service, "slug">[]) {
  const detailDestinations = new Set(
    services
      .map((service) => getServiceDetailHref(service.slug))
      .filter((href): href is string => Boolean(href)),
  );

  return editorialClusters.filter((cluster) => !detailDestinations.has(cluster.href));
}
