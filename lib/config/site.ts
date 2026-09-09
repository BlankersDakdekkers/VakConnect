import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "VakConnect",
  description:
    "VakConnect koppelt consumenten aan geschikte lokale vakmensen met een schaalbare lead marketplace-basis.",
  url: baseUrl,
  contactEmail: "info@vakconnect.nl",
};

function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

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

export function buildPageMetadata(input: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  indexable?: boolean;
}): Metadata {
  return buildMetadata({
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.path,
    },
    openGraph: {
      title: `${input.title} | ${siteConfig.name}`,
      description: input.description,
      url: toAbsoluteUrl(input.path),
      siteName: siteConfig.name,
      locale: "nl_NL",
      type: "website",
    },
    robots: input.indexable === false ? { index: false, follow: true } : { index: true, follow: true },
    keywords: input.keywords,
  });
}
