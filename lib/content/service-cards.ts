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

const popularServiceClusters: EditorialCluster[] = [
  {
    href: "/dakdekker",
    title: "Dakdekker",
    description: "Voor lekkage, dakonderhoud, reparatie of renovatie van een plat of hellend dak.",
  },
  {
    href: "/schilder",
    title: "Schilder",
    description: "Voor binnen- en buitenschilderwerk, houtwerk en het herstellen van schilderwerk.",
  },
  {
    href: "/loodgieter",
    title: "Loodgieter",
    description: "Voor lekkages, sanitair, leidingwerk en problemen met afvoer of riolering.",
  },
  {
    href: "/elektricien",
    title: "Elektricien",
    description: "Voor elektra, verlichting, storingen en aanpassingen aan de groepenkast.",
  },
  {
    href: "/kozijnen",
    title: "Kozijnen",
    description: "Voor het vervangen, plaatsen of herstellen van kozijnen, ramen en deuren.",
  },
  {
    href: "/badkamer",
    title: "Badkamer",
    description: "Voor een badkamerrenovatie, nieuw sanitair, tegelwerk of een inloopdouche.",
  },
  {
    href: "/isolatie",
    title: "Isolatie",
    description: "Voor dak-, vloer-, gevel- of spouwmuurisolatie en advies over de aanpak.",
  },
  {
    href: "/verbouwing",
    title: "Verbouwing",
    description: "Voor een aanbouw, uitbouw, zolderverbouwing of renovatie van je woning.",
  },
];

export function getPopularServiceClusters() {
  return popularServiceClusters;
}

export function getServiceDetailHref(slug: string) {
  return serviceDetailRoutes[slug];
}

export function getEditorialClusters(services: Pick<Service, "slug">[]) {
  const detailDestinations = new Set(
    services
      .map((service) => getServiceDetailHref(service.slug))
      .filter((href): href is string => Boolean(href)),
  );

  return popularServiceClusters.filter((cluster) => !detailDestinations.has(cluster.href));
}
