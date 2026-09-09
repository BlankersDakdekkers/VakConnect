import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "VakConnect",
  description:
    "VakConnect koppelt consumenten aan geschikte lokale vakmensen met een schaalbare lead marketplace-basis.",
  url: baseUrl,
};

export function buildMetadata(overrides?: Metadata): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} | Vind de juiste vakman voor jouw klus`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    openGraph: {
      title: `${siteConfig.name} | Vind de juiste vakman voor jouw klus`,
      description: siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: "nl_NL",
      type: "website",
    },
    alternates: {
      canonical: "/",
    },
    ...overrides,
  };
}
