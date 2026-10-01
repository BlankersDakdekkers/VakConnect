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
    description: "Laat daklekkage, dakpannen, een plat dak of renovatie beoordelen en bespreek een passende aanpak.",
  },
  {
    href: "/schilder",
    title: "Schilder",
    description: "Van muren en plafonds binnen tot onderhoud van buitenkozijnen en ander houtwerk.",
  },
  {
    href: "/loodgieter",
    title: "Loodgieter",
    description: "Bespreek lekkage, leidingen, sanitair of een afvoerprobleem met een passende loodgieter.",
  },
  {
    href: "/elektricien",
    title: "Elektricien",
    description: "Zoek hulp bij elektra-storingen, een groepenkast, verlichting of nieuwe aansluitingen.",
  },
  {
    href: "/kozijnen",
    title: "Kozijnen",
    description: "Vergelijk herstel of vervanging van raam- en deurkozijnen in hout, kunststof of aluminium.",
  },
  {
    href: "/badkamer",
    title: "Badkamer",
    description: "Breng renovatie, sanitair, tegelwerk en de benodigde installaties voor je badkamer in kaart.",
  },
  {
    href: "/isolatie",
    title: "Isolatie",
    description: "Bekijk dak-, vloer-, spouw- en gevelisolatie met aandacht voor constructie en ventilatie.",
  },
  {
    href: "/verbouwing",
    title: "Verbouwing",
    description: "Plan een aanbouw, zolder-, keuken- of badkamerverbouwing of een bredere woningrenovatie.",
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
