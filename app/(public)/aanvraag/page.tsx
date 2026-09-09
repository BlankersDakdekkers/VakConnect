import type { Metadata } from "next";
import { SetupRequired } from "@/components/setup-required";
import { LeadRequestForm } from "@/components/forms/lead-request-form";
import { PageHeader } from "@/components/ui/page-header";
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
    <div className="container-shell space-y-8 py-12">
      <PageHeader
        eyebrow="Aanvraag"
        title="Vertel ons wat er moet gebeuren"
        description="De intake werkt mobiel eerst, valideert client-side voor directe feedback en valideert server-side bij verzending opnieuw."
      />
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
    </div>
  );
}
