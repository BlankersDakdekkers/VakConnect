import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceContentPage } from "@/components/public/service-content-page";
import { buildPageMetadata } from "@/lib/config/site";
import { getServiceSubPage, serviceSubSlugs } from "@/lib/content/service-pages";

export function generateStaticParams() {
  return serviceSubSlugs;
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ vakgebied: string; subdienst: string }> }>): Promise<Metadata> {
  const { vakgebied, subdienst } = await params;
  const page = getServiceSubPage(vakgebied, subdienst);

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

export default async function ServiceSubPage({
  params,
}: Readonly<{ params: Promise<{ vakgebied: string; subdienst: string }> }>) {
  const { vakgebied, subdienst } = await params;
  const page = getServiceSubPage(vakgebied, subdienst);

  if (!page) {
    notFound();
  }

  return <ServiceContentPage page={page} />;
}
