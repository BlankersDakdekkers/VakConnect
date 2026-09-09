import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ServiceContentPage } from "@/components/public/service-content-page";
import { siteConfig, buildPageMetadata } from "@/lib/config/site";
import { getLocalLinksForServiceSub, getSeoLocalStaticParams, resolvePublicServiceRoute } from "@/lib/seo/local-pages/queries";

export async function generateStaticParams() {
  return getSeoLocalStaticParams();
}

function buildLocalStructuredData(localPage: { page: { breadcrumbs: Array<{ label: string; href?: string }>; faqs: Array<{ question: string; answer: string }> } }) {
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
  const resolved = await resolvePublicServiceRoute(vakgebied, slug);

  if (!resolved) {
    return {};
  }

  if (resolved.type === "local") {
    if (!resolved.localPage.published || resolved.localPage.contentStatus !== "published") {
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
  const resolved = await resolvePublicServiceRoute(vakgebied, slug);

  if (!resolved) {
    notFound();
  }

  if (resolved.type === "local") {
    const hasRequiredContent =
      resolved.localPage.page.intro.length > 0 &&
      resolved.localPage.page.sections.length >= 2 &&
      resolved.localPage.page.faqs.length > 0;

    if (!resolved.localPage.published || !resolved.localPage.indexable || resolved.localPage.contentStatus !== "published" || !hasRequiredContent) {
      notFound();
    }

    const schema = buildLocalStructuredData(resolved.localPage);

    return (
      <>
        <Script
          id={`breadcrumb-${resolved.localPage.canonicalPath}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.breadcrumbList) }}
        />
        <Script id={`faq-${resolved.localPage.canonicalPath}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.faqSchema) }} />
        <ServiceContentPage page={resolved.localPage.page} />
      </>
    );
  }

  const localLinks = await getLocalLinksForServiceSub(vakgebied, slug[0]);
  const relatedLinks = [...resolved.serviceSubPage.relatedLinks, ...localLinks].filter(
    (link, index, list) => list.findIndex((candidate) => candidate.href === link.href) === index,
  );

  return <ServiceContentPage page={{ ...resolved.serviceSubPage, relatedLinks }} />;
}
