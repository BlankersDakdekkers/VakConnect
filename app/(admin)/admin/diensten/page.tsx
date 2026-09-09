import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { createServiceAction, toggleServiceStatusAction } from "@/lib/services/actions";
import { getAdminServices } from "@/lib/services/queries";

export default async function AdminServicesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const success = typeof params.success === "string" ? params.success : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;
  const services = await getAdminServices();

  return (
    <div className="space-y-6">
      <PageHeader title="Diensten" description="Beheer de actieve lijst met diensten die op de homepage en in de aanvraagfunnel wordt gebruikt." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-5">
          <h2 className="text-lg font-semibold tracking-tight">Nieuwe dienst</h2>
          <form action={createServiceAction} className="space-y-4">
            <FormField id="name" label="Naam">
              <Input id="name" name="name" required />
            </FormField>
            <FormField id="slug" label="Slug">
              <Input id="slug" name="slug" required />
            </FormField>
            <FormField id="category" label="Categorie">
              <Input id="category" name="category" required />
            </FormField>
            <FormField id="description" label="Beschrijving" description="Optioneel">
              <Input id="description" name="description" />
            </FormField>
            <label className="flex items-center gap-3 text-sm font-medium">
              <Checkbox name="active" defaultChecked />
              Meteen actief maken
            </label>
            <SubmitButton pendingLabel="Dienst wordt opgeslagen...">Dienst toevoegen</SubmitButton>
          </form>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Bestaande diensten</h2>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex flex-col gap-4 rounded-3xl border p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium">{service.name}</p>
                    <StatusBadge value={service.active ? "active" : "inactive"} />
                  </div>
                  <p className="text-sm text-muted-foreground">{service.category} · /{service.slug}</p>
                  {service.description ? <p className="text-sm text-muted-foreground">{service.description}</p> : null}
                </div>
                <form action={toggleServiceStatusAction}>
                  <input type="hidden" name="service_id" value={service.id} />
                  <input type="hidden" name="active" value={String(!service.active)} />
                  <input type="hidden" name="redirect_to" value="/admin/diensten" />
                  <SubmitButton variant="secondary" pendingLabel="Bijwerken...">
                    {service.active ? "Deactiveren" : "Activeren"}
                  </SubmitButton>
                </form>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
