import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";
import { getPopularServiceClusters, getServiceDetailHref } from "@/lib/content/service-cards";
import { getActiveServices } from "@/lib/services/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Diensten en vakgebieden",
  description: "Bekijk de vakgebieden op VakConnect, ontdek veelvoorkomende klussen en start je aanvraag.",
  path: "/diensten",
  keywords: ["diensten vakconnect", "vakman aanvragen", "vakgebieden"],
});

export default async function ServicesPage() {
  const services = await getActiveServices();
  const additionalServices = services.filter((service) => !getServiceDetailHref(service.slug));
  const clusters = getPopularServiceClusters();

  return (
    <div className="container-shell space-y-12 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Broodkruimel"><Link href="/">Home</Link> / Diensten</nav>
      <section className="space-y-4">
        <p className="text-sm font-medium text-primary">Vakgebieden</p>
        <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">Vind een vakman voor jouw soort klus</h1>
        <p className="max-w-prose text-base leading-7 text-muted-foreground sm:text-lg">
          Bekijk waar vakmensen je mee kunnen helpen. Kies een vakgebied voor meer informatie of start direct met het beschrijven van je klus.
        </p>
        <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}>Plaats je klus</Link>
      </section>

      <section aria-label="Vakgebieden" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {clusters.map((cluster) => (
          <Link key={cluster.href} href={cluster.href} className="group rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            <Card className="flex h-full flex-col items-start gap-3 transition duration-150 group-hover:-translate-y-px group-hover:border-primary/30 group-hover:shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">{cluster.title}</h2>
              <p className="flex-1 text-sm leading-6 text-muted-foreground">{cluster.description}</p>
              <span className="inline-flex min-h-11 items-center text-sm font-medium text-primary">
                Bekijk {cluster.title.toLowerCase()} <span aria-hidden="true" className="ml-2">→</span>
              </span>
            </Card>
          </Link>
        ))}
      </section>

      {additionalServices.length ? (
        <section className="space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">Andere diensten die je kunt aanvragen</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {additionalServices.map((service) => (
              <Card key={service.id} className="flex flex-col items-start gap-3">
                <p className="text-sm font-medium text-primary">{service.category}</p>
                <h3 className="text-lg font-semibold">{service.name}</h3>
                {service.description ? <p className="flex-1 text-sm leading-6 text-muted-foreground">{service.description}</p> : null}
                <Link
                  href={`/aanvraag?dienst=${encodeURIComponent(service.slug)}`}
                  className={buttonClassName({ variant: "secondary", size: "sm" })}
                >
                  Start je aanvraag
                </Link>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
