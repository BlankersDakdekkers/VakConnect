import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/config/site";
import { getEditorialClusters, getServiceDetailHref } from "@/lib/content/service-cards";
import { getActiveServices } from "@/lib/services/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Diensten",
  description: "Bekijk welke diensten je via VakConnect kunt aanvragen en start direct je aanvraag.",
  path: "/diensten",
  keywords: ["diensten vakconnect", "dakdekker aanvragen", "vakgebieden"],
});

export default async function ServicesPage() {
  const services = await getActiveServices();
  const editorialClusters = getEditorialClusters(services);

  return (
    <div className="container-shell space-y-10 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / Diensten</nav>
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Diensten via VakConnect</h1>
        <p className="max-w-3xl text-muted-foreground">Actieve diensten worden rechtstreeks geladen uit de bestaande service-architectuur.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const detailHref = getServiceDetailHref(service.slug);
          return (
            <Card key={service.id} className="space-y-3">
              <Badge>{service.category}</Badge>
              <h2 className="text-xl font-semibold tracking-tight">{service.name}</h2>
              <p className="text-sm text-muted-foreground">{service.description ?? "Beschikbaar voor intake en matching via VakConnect."}</p>
              <div className="flex gap-2">
                <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "sm" })}>Vind een vakman</Link>
                {detailHref ? (
                  <Link href={detailHref} className={buttonClassName({ variant: "secondary", size: "sm" })}>Meer info</Link>
                ) : null}
              </div>
            </Card>
          );
        })}
      </section>

      {editorialClusters.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Meer vakgebieden op VakConnect</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {editorialClusters.map((cluster) => (
              <Card key={cluster.href} className="space-y-3">
                <h3 className="text-xl font-semibold tracking-tight">{cluster.title}</h3>
                <p className="text-sm text-muted-foreground">{cluster.description}</p>
                <div className="flex gap-2">
                  <Link href={cluster.href} className={buttonClassName({ variant: "secondary", size: "sm" })}>Bekijk vakgebied</Link>
                  <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "sm" })}>Plaats je aanvraag</Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
