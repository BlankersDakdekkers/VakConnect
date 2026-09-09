import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ServiceContentPage } from "@/components/public/service-content-page";
import { siteConfig, buildPageMetadata } from "@/lib/config/site";
import {
  getLocalMainPage,
  getLocalSubservicePage,
  getLocalStaticParams,
  getLocalLinksForServiceSub,
  type LocalServicePage,
} from "@/lib/content/local-service-pages";
import { getServiceSubPage, serviceSubSlugs } from "@/lib/content/service-pages";

export function generateStaticParams() {
  const serviceParams = serviceSubSlugs.map(({ vakgebied, subdienst }) => ({ vakgebied, slug: [subdienst] }));
  return [...serviceParams, ...getLocalStaticParams()];
}

export function resolvePublicServiceRoute(vakgebied: string, slug: string[]) {
  if (slug.length === 1) {
    const [secondSegment] = slug;
    const localMainPage = getLocalMainPage(vakgebied, secondSegment);

    if (localMainPage) {
      return { type: "local" as const, localPage: localMainPage };
    }

    const serviceSubPage = getServiceSubPage(vakgebied, secondSegment);
    if (serviceSubPage) {
      return { type: "service-sub" as const, serviceSubPage };
    }

    return null;
  }

  if (slug.length === 2) {
    const [subdienst, stad] = slug;
    const localSubPage = getLocalSubservicePage(vakgebied, subdienst, stad);

    if (localSubPage) {
      return { type: "local" as const, localPage: localSubPage };
    }
  }

  return null;
}

function buildLocalStructuredData(localPage: LocalServicePage) {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: localPage.page.breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: localPage.page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return { breadcrumbList, faqSchema };
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ vakgebied: string; slug: string[] }> }>): Promise<Metadata> {
  const { vakgebied, slug } = await params;
  const resolved = resolvePublicServiceRoute(vakgebied, slug);

  if (!resolved) {
    return {};
  }

  if (resolved.type === "local") {
    if (!resolved.localPage.published) {
      return {};
    }

    return buildPageMetadata({
      title: resolved.localPage.page.title,
      description: resolved.localPage.page.description,
      path: resolved.localPage.canonicalPath,
      keywords: resolved.localPage.page.keywords,
      indexable: resolved.localPage.indexable,
    });
  }

  return buildPageMetadata({
    title: resolved.serviceSubPage.title,
    description: resolved.serviceSubPage.description,
    path: resolved.serviceSubPage.path,
    keywords: resolved.serviceSubPage.keywords,
  });
}

export default async function ServiceOrLocalPage({
  params,
}: Readonly<{ params: Promise<{ vakgebied: string; slug: string[] }> }>) {
  const { vakgebied, slug } = await params;
  const resolved = resolvePublicServiceRoute(vakgebied, slug);

  if (!resolved) {
    notFound();
  }

  if (resolved.type === "local") {
    if (!resolved.localPage.published) {
      notFound();
    }

    const schema = buildLocalStructuredData(resolved.localPage);

    return (
      <>
        <Script id={`breadcrumb-${resolved.localPage.canonicalPath}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.breadcrumbList) }} />
        <Script id={`faq-${resolved.localPage.canonicalPath}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.faqSchema) }} />
        <ServiceContentPage page={resolved.localPage.page} />
      </>
    );
  }

  const localLinks = getLocalLinksForServiceSub(vakgebied, slug[0]);
  const relatedLinks = [...resolved.serviceSubPage.relatedLinks, ...localLinks].filter(
    (link, index, list) => list.findIndex((candidate) => candidate.href === link.href) === index,
  );

  return <ServiceContentPage page={{ ...resolved.serviceSubPage, relatedLinks }} />;
}
