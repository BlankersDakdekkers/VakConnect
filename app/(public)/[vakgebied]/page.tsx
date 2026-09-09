import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceContentPage } from "@/components/public/service-content-page";
import { buildPageMetadata } from "@/lib/config/site";
import { getLocalLinksForServiceMain } from "@/lib/content/local-service-pages";
import { getServiceMainPage, serviceMainSlugs } from "@/lib/content/service-pages";

export function generateStaticParams() {
  return serviceMainSlugs.map((vakgebied) => ({ vakgebied }));
}

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ vakgebied: string }> }>): Promise<Metadata> {
  const { vakgebied } = await params;
  const page = getServiceMainPage(vakgebied);

  if (!page) {
    return {};
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: page.keywords,
  });
}

export default async function ServiceMainPage({ params }: Readonly<{ params: Promise<{ vakgebied: string }> }>) {
  const { vakgebied } = await params;
  const page = getServiceMainPage(vakgebied);

  if (!page) {
    notFound();
  }

  const localLinks = getLocalLinksForServiceMain(vakgebied);
  const relatedLinks = [...page.relatedLinks, ...localLinks].filter(
    (link, index, list) => list.findIndex((candidate) => candidate.href === link.href) === index,
  );

  return <ServiceContentPage page={{ ...page, relatedLinks }} />;
}
