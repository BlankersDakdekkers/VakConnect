import type { Metadata } from "next";
import { SetupRequired } from "@/components/setup-required";
import { LeadRequestForm } from "@/components/forms/lead-request-form";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/config/site";
import { isSupabaseConfigured } from "@/lib/env";
import { getActiveServicesWithQuestions } from "@/lib/services/queries";
import { formatPostalCode, normalizePostalCode } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Aanvraag plaatsen",
  description: "Vertel wat er moet gebeuren en plaats in enkele stappen je aanvraag bij VakConnect.",
  path: "/aanvraag",
  keywords: ["vakman aanvragen", "klus aanvraag", "VakConnect aanvraag"],
});

export default async function RequestPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [services, params] = await Promise.all([getActiveServicesWithQuestions(), searchParams]);
  const serviceSlug = typeof params.dienst === "string" ? params.dienst : "";
  const postalQuery = typeof params.postcode === "string" ? params.postcode : "";
  const initialServiceId = services.find((service) => service.slug === serviceSlug)?.id ?? "";
  const normalizedPostalCode = normalizePostalCode(postalQuery);

  return (
    <div className="container-shell space-y-6 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Je aanvraag</p>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">Vertel ons wat er moet gebeuren</h1>
        <p className="max-w-prose text-base leading-7 text-muted-foreground">Beschrijf je klus stap voor stap. Je controleert alles voordat je verstuurt. Een aanvraag plaatsen is gratis en je beslist zelf of je met een vakman verdergaat.</p>
      </div>
      {!isSupabaseConfigured() ? (
        <SetupRequired
          title="Supabase configuratie ontbreekt"
          description="Configureer eerst de variabelen uit .env.example en voer daarna de SQL-migratie uit om de aanvraagfunnel met echte data te gebruiken."
        />
      ) : null}
      <LeadRequestForm
        services={services}
        prefill={{
          serviceId: initialServiceId,
          postalCode: normalizedPostalCode ? formatPostalCode(normalizedPostalCode) : "",
        }}
      />
      <p className="mx-auto max-w-3xl text-sm leading-6 text-muted-foreground">
        Vragen over je aanvraag? <Link href="/contact" className="inline-flex min-h-11 items-center underline underline-offset-4">Neem contact op</Link>.
        {" "}Lees hoe we met je gegevens omgaan in ons <Link href="/privacy" className="inline-flex min-h-11 items-center underline underline-offset-4">privacybeleid</Link>.
      </p>
    </div>
  );
}
