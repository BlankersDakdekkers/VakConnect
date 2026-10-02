import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { FaqList } from "@/components/public/faq-list";
import { ProcessSteps } from "@/components/public/process-steps";
import type { ServiceContentPageData } from "@/lib/content/service-pages";

function Breadcrumbs({ items }: Readonly<{ items: ServiceContentPageData["breadcrumbs"] }>) {
  return (
    <nav aria-label="Broodkruimel" className="text-xs text-muted-foreground sm:text-sm">
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
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
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
    info: "space-y-3 rounded-r-xl border-l-4 border-primary/30 bg-primary/5 px-5 py-4",
    warning: "space-y-3 rounded-r-xl border-l-4 border-accent/50 bg-accent/10 px-5 py-4",
  };

  return (
    <div className="container-shell space-y-12 py-10 sm:py-14">
      <Breadcrumbs items={page.breadcrumbs} />

      <section className="space-y-5">
        <h1 className="max-w-4xl break-words text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">{page.h1}</h1>
        <div className="max-w-prose space-y-3 text-base leading-7 text-muted-foreground">
          {page.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={applicationHref} className={buttonClassName({ variant: "primary", size: "lg" })}>
            {page.cta.label}
          </Link>
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">
            VakConnect gebruikt je klus en regio om passende professionals te zoeken. Een vakman beoordeelt zelf de aanvraag; jij kiest hoe je verdergaat.
          </p>
        </div>
      </section>

      {page.sections.length >= 4 ? (
        <nav aria-label="Op deze pagina" className="rounded-2xl border bg-surface-muted p-5">
          <p className="mb-3 text-sm font-semibold">Op deze pagina</p>
          <ul className="flex flex-wrap gap-2">
            {page.sections.map((section, index) => (
              <li key={section.heading}>
                <a
                  href={`#service-section-${index + 1}`}
                  className="inline-flex min-h-10 items-center rounded-full border bg-surface px-3 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="space-y-10">
        {page.sections.map((section, index) => (
          <div key={section.heading} className="space-y-8">
            <section
              id={`service-section-${index + 1}`}
              className={`scroll-mt-28 ${sectionStyles[section.type ?? "default"]}`}
            >
              <h2 className="break-words text-xl font-semibold tracking-tight sm:text-2xl">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="max-w-prose text-base leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="max-w-prose list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground marker:text-primary">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
            {index === 2 ? (
              <section>
                <div className="flex flex-col gap-3 rounded-2xl border bg-surface-muted p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="break-words text-lg font-semibold">Weet je wat er moet gebeuren?</h2>
                    <p className="text-sm text-muted-foreground">Beschrijf je klus en regio; een passende vakman beoordeelt de aanvraag.</p>
                  </div>
                  <Link href={applicationHref} className={buttonClassName({ variant: "primary", size: "lg" })}>
                    Plaats je klus
                  </Link>
                </div>
              </section>
            ) : null}
          </div>
        ))}
      </div>

      {page.warning ? (
        <section>
          <div className="space-y-3 rounded-r-xl border-l-4 border-amber-400 bg-amber-50/70 px-5 py-4">
            <h2 className="break-words text-xl font-semibold tracking-tight">{page.warning.title}</h2>
            <p className="max-w-prose text-sm leading-7 text-muted-foreground">{page.warning.body}</p>
          </div>
        </section>
      ) : null}

      <section>
        <Card className="space-y-3">
          <h2 className="break-words text-2xl font-semibold tracking-tight">Kostenfactoren</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {page.costFactors.map((factor) => (
              <li key={factor} className="rounded-xl bg-surface-muted px-4 py-3 text-sm leading-6 text-muted-foreground">
                {factor}
              </li>
            ))}
          </ul>
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">De uiteindelijke prijs hangt af van de situatie en afgesproken werkzaamheden. Vraag om een offerte waarin scope en eventuele extra’s duidelijk staan.</p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="break-words text-2xl font-semibold tracking-tight">Hoe VakConnect werkt</h2>
        <ProcessSteps
          columns={4}
          steps={page.processSteps.map((description, index) => ({ title: `Stap ${index + 1}`, description }))}
        />
        {page.path.split("/").length === 3 ? (
          <Link href="/hoe-werkt-het" className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4">
            Bekijk hoe VakConnect werkt
          </Link>
        ) : null}
      </section>

      <section className="space-y-4">
        <h2 className="break-words text-2xl font-semibold tracking-tight">Subdiensten en verdere informatie</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {page.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group rounded-2xl border bg-surface px-4 py-4 transition hover:-translate-y-px hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 motion-reduce:transform-none motion-reduce:transition-none">
              <p className="text-sm font-semibold text-foreground">{link.title}</p>
              <p className="mt-1 max-w-prose text-sm leading-6 text-muted-foreground">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="break-words text-2xl font-semibold tracking-tight">Veelgestelde vragen</h2>
        <FaqList items={page.faqs} />
      </section>

      <section>
        <Card className="space-y-4 bg-primary text-primary-foreground">
          <h2 className="break-words text-2xl font-semibold tracking-tight">{page.cta.title}</h2>
          <p className="text-sm leading-7 text-primary-foreground/90">{page.cta.description}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
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
