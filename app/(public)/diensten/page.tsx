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
    <div className="container-shell space-y-10 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Broodkruimel"><Link href="/">Home</Link> / Diensten</nav>
      <section className="space-y-4">
        <p className="text-sm font-medium text-primary">Vakgebieden</p>
        <h1 className="text-4xl font-semibold tracking-tight">Vind een vakman voor jouw soort klus</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          Bekijk waar vakmensen je mee kunnen helpen. Kies een vakgebied voor meer informatie of start direct met het beschrijven van je klus.
        </p>
        <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "lg" })}>Plaats je klus</Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {clusters.map((cluster) => (
          <Card key={cluster.href} className="flex flex-col items-start gap-3">
            <h2 className="text-xl font-semibold tracking-tight">{cluster.title}</h2>
            <p className="flex-1 text-sm leading-6 text-muted-foreground">{cluster.description}</p>
            <Link href={cluster.href} className="text-sm font-medium text-primary underline underline-offset-4">
              Bekijk {cluster.title.toLowerCase()}
            </Link>
            <Link href="/aanvraag" className={buttonClassName({ variant: "secondary", size: "sm" })}>Plaats je klus</Link>
          </Card>
        ))}
      </section>

      {additionalServices.length ? (
        <section className="space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">Andere diensten die je kunt aanvragen</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
