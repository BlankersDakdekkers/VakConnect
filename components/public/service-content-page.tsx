import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import type { ServiceContentPageData } from "@/lib/content/service-pages";

function Breadcrumbs({ items }: Readonly<{ items: ServiceContentPageData["breadcrumbs"] }>) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="underline-offset-2 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {index < items.length - 1 ? <span>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ServiceContentPage({ page }: Readonly<{ page: ServiceContentPageData }>) {
  const applicationHref = page.cta.serviceSlug
    ? `/aanvraag?dienst=${encodeURIComponent(page.cta.serviceSlug)}`
    : "/aanvraag";
  const sectionStyles: Record<NonNullable<ServiceContentPageData["sections"][number]["type"]>, string> = {
    default: "space-y-3",
    info: "space-y-3 border-blue-200 bg-blue-50",
    warning: "space-y-3 border-amber-200 bg-amber-50",
  };

  return (
    <div className="container-shell space-y-10 py-14">
      <Breadcrumbs items={page.breadcrumbs} />

      <section className="space-y-4">
        <h1 className="break-words text-4xl font-semibold tracking-tight text-balance">{page.h1}</h1>
        <div className="max-w-3xl space-y-3 text-muted-foreground">
          {page.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={applicationHref} className={buttonClassName({ variant: "primary", size: "lg" })}>
            {page.cta.label}
          </Link>
          <p className="max-w-2xl text-sm text-muted-foreground">
            VakConnect gebruikt je klus en regio om passende professionals te zoeken. Een vakman beoordeelt zelf de aanvraag; jij kiest hoe je verdergaat.
          </p>
        </div>
      </section>

      <div className="space-y-4">
        {page.sections.map((section, index) => (
          <div key={section.heading} className="space-y-4">
            <section>
              <Card className={sectionStyles[section.type ?? "default"]}>
                <h2 className="break-words text-2xl font-semibold tracking-tight">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>• {bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </Card>
            </section>
            {index === 2 ? (
              <section>
                <Card className="flex flex-col gap-3 bg-surface-muted sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="break-words text-lg font-semibold">Weet je wat er moet gebeuren?</h2>
                    <p className="text-sm text-muted-foreground">Beschrijf je klus en regio; een passende vakman beoordeelt de aanvraag.</p>
                  </div>
                  <Link href={applicationHref} className={buttonClassName({ variant: "primary", size: "lg" })}>
                    Plaats je klus
                  </Link>
                </Card>
              </section>
            ) : null}
          </div>
        ))}
      </div>

      {page.warning ? (
        <section>
          <Card className="space-y-3 border-amber-200 bg-amber-50">
            <h2 className="break-words text-xl font-semibold tracking-tight text-amber-900">{page.warning.title}</h2>
            <p className="text-sm leading-7 text-amber-900/90">{page.warning.body}</p>
          </Card>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="break-words text-2xl font-semibold tracking-tight">Kostenfactoren</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {page.costFactors.map((factor) => (
              <li key={factor}>• {factor}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">De uiteindelijke prijs hangt af van de situatie en afgesproken werkzaamheden. Vraag om een offerte waarin scope en eventuele extra’s duidelijk staan.</p>
        </Card>
        <Card className="space-y-3">
          <h2 className="break-words text-2xl font-semibold tracking-tight">Hoe VakConnect werkt</h2>
          <ol className="space-y-2 text-sm text-muted-foreground">
            {page.processSteps.map((step, index) => (
              <li key={step}>
                <span className="font-medium text-foreground">Stap {index + 1}:</span> {step}
              </li>
            ))}
          </ol>
          {page.path.split("/").length === 3 ? (
            <Link href="/hoe-werkt-het" className="inline-block text-sm font-medium underline underline-offset-2">
              Bekijk hoe VakConnect werkt
            </Link>
          ) : null}
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="break-words text-2xl font-semibold tracking-tight">Subdiensten en verdere informatie</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {page.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl border bg-surface px-4 py-3 transition hover:bg-surface-muted">
              <p className="text-sm font-semibold text-foreground">{link.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="break-words text-2xl font-semibold tracking-tight">Veelgestelde vragen</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {page.faqs.map((item) => (
            <Card key={item.question} className="space-y-2">
              <h3 className="break-words font-semibold">{item.question}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card className="space-y-4 bg-primary text-primary-foreground">
          <h2 className="break-words text-2xl font-semibold tracking-tight">{page.cta.title}</h2>
          <p className="text-sm leading-7 text-primary-foreground/90">{page.cta.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={applicationHref} className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/25 bg-white text-primary hover:bg-slate-100" })}>
              {page.cta.label}
            </Link>
            {page.cta.secondaryHref && page.cta.secondaryLabel ? (
              <Link href={page.cta.secondaryHref} className={buttonClassName({ variant: "secondary", size: "lg", className: "border-white/35 bg-transparent text-white hover:bg-white/10" })}>
                {page.cta.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </Card>
      </section>
    </div>
  );
}
