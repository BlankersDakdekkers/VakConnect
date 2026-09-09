import { SetupRequired } from "@/components/setup-required";
import { LeadRequestForm } from "@/components/forms/lead-request-form";
import { PageHeader } from "@/components/ui/page-header";
import { getActiveServices } from "@/lib/services/queries";
import { isSupabaseConfigured } from "@/lib/env";

export default async function RequestPage() {
  const services = await getActiveServices();

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
      <LeadRequestForm services={services} />
    </div>
  );
}
