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
    <div className="container-shell py-16">
      <Card className="mx-auto max-w-2xl space-y-6 text-center">
        <p className="text-sm font-medium text-primary">Aanvraag ontvangen</p>
        <h1 className="text-4xl font-semibold tracking-tight">Je aanvraag is ontvangen.</h1>
        <p className="text-sm text-muted-foreground">
          Publieke aanvraagreferentie: <span className="font-semibold text-foreground">{reference}</span>
        </p>
        <ol className="space-y-3 text-left text-sm text-muted-foreground">
          <li>1. We controleren de aanvraag.</li>
          <li>2. We zoeken een passende vakman.</li>
          <li>3. Een vakman kan daarna contact met je opnemen.</li>
        </ol>
        <div className="flex justify-center">
          <Link href="/" className={buttonClassName({ variant: "primary" })}>
            Terug naar homepage
          </Link>
        </div>
      </Card>
    </div>
  );
}
