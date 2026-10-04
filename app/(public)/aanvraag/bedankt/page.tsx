import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { buildMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Aanvraag ontvangen",
  description: "Bevestiging van je aanvraag bij VakConnect.",
  alternates: { canonical: "/aanvraag/bedankt" },
  keywords: ["aanvraag ontvangen"],
  robots: { index: false, follow: false },
  openGraph: {
    title: "Aanvraag ontvangen | VakConnect",
    description: "Bevestiging van je aanvraag bij VakConnect.",
    url: "/aanvraag/bedankt",
    siteName: "VakConnect",
    locale: "nl_NL",
    type: "website",
  },
});

export default async function ThankYouPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const reference = typeof params.ref === "string" ? params.ref : null;

  if (!reference || !/^VC-[A-Z0-9]{8}$/.test(reference)) {
    notFound();
  }

  return (
    <div className="container-shell py-8 sm:py-16">
      <Card className="mx-auto max-w-2xl space-y-6 text-center">
        <p className="text-sm font-medium text-primary">Aanvraag ontvangen</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Je aanvraag is ontvangen.</h1>
        <p className="text-sm text-muted-foreground">
          Publieke aanvraagreferentie: <span className="font-semibold text-foreground">{reference}</span>
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Bewaar deze referentie als je contact met ons wilt opnemen. We bekijken je aanvraag en zoeken op basis van je klus en regio naar een passende vakman.
        </p>
        <ol className="space-y-3 text-left text-sm text-muted-foreground">
          <li>1. We controleren wat er nodig is.</li>
          <li>2. We kijken welke vakmensen bij je klus en regio passen.</li>
          <li>3. Een passende vakman kan contact met je opnemen.</li>
        </ol>
        <p className="text-sm leading-6 text-muted-foreground">Of een vakman contact kan opnemen, hangt af van de dienst, regio en beschikbaarheid. Je beslist zelf hoe je verdergaat.</p>
        <div className="flex justify-center">
          <Link href="/" className={buttonClassName({ variant: "primary" })}>
            Terug naar homepage
          </Link>
        </div>
        <Link href="/contact" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">Een vraag over je aanvraag?</Link>
      </Card>
    </div>
  );
}
