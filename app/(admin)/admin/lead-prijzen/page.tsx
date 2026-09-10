import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { toggleLeadPricingRuleAction, upsertLeadPricingRuleAction } from "@/lib/commercial/actions";
import { formatCredits } from "@/lib/commercial/labels";
import { getAdminLeadPricingRules } from "@/lib/commercial/queries";
import { getAdminServices } from "@/lib/services/queries";

export default async function AdminLeadPricingPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const query = await searchParams;
  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;
  const [rules, services] = await Promise.all([getAdminLeadPricingRules(), getAdminServices()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Lead prijzen" description="Beheer server-side prijsregels per dienst, subdienst, scoreband en commercial type." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Nieuwe prijsregel</h2>
        <form action={upsertLeadPricingRuleAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input type="hidden" name="redirect_to" value="/admin/lead-prijzen" />
          <FormField id="service_id" label="Dienst">
            <Select id="service_id" name="service_id" defaultValue="">
              <option value="">Algemene fallback</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField id="subservice_slug" label="Subdienst slug">
            <Input id="subservice_slug" name="subservice_slug" placeholder="optioneel" />
          </FormField>
          <FormField id="lead_type" label="Type">
            <Select id="lead_type" name="lead_type" defaultValue="shared">
              <option value="shared">shared</option>
              <option value="exclusive">exclusive</option>
            </Select>
          </FormField>
          <FormField id="base_price_credits" label="Basisprijs">
            <Input id="base_price_credits" name="base_price_credits" type="number" min="1" required />
          </FormField>
          <FormField id="priority" label="Prioriteit">
            <Input id="priority" name="priority" type="number" min="0" defaultValue="0" required />
          </FormField>
          <FormField id="exclusive_multiplier" label="Exclusive multiplier">
            <Input id="exclusive_multiplier" name="exclusive_multiplier" type="number" min="0.1" step="0.01" defaultValue="1.00" />
          </FormField>
          <FormField id="shared_multiplier" label="Shared multiplier">
            <Input id="shared_multiplier" name="shared_multiplier" type="number" min="0.1" step="0.01" defaultValue="1.00" />
          </FormField>
          <FormField id="min_score" label="Min score">
            <Input id="min_score" name="min_score" type="number" min="0" max="100" />
          </FormField>
          <FormField id="max_score" label="Max score">
            <Input id="max_score" name="max_score" type="number" min="0" max="100" />
          </FormField>
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" name="active" defaultChecked /> Actief</label>
          <div className="xl:col-span-5">
            <SubmitButton pendingLabel="Prijsregel wordt opgeslagen...">Prijsregel toevoegen</SubmitButton>
          </div>
        </form>
      </Card>
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{rule.serviceName ?? "Algemene fallback"} {rule.subserviceSlug ? `· ${rule.subserviceSlug}` : ""}</p>
                <p className="text-sm text-muted-foreground">{rule.leadType} · {formatCredits(rule.basePriceCredits)} · score {rule.minScore ?? 0}-{rule.maxScore ?? 100}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge value={rule.active ? "active" : "inactive"} />
                <StatusBadge value={rule.leadType} />
              </div>
            </div>
            <form action={upsertLeadPricingRuleAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <input type="hidden" name="rule_id" value={rule.id} />
              <input type="hidden" name="redirect_to" value="/admin/lead-prijzen" />
              <FormField id={`service-${rule.id}`} label="Dienst">
                <Select id={`service-${rule.id}`} name="service_id" defaultValue={rule.serviceId ?? ""}>
                  <option value="">Algemene fallback</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </Select>
              </FormField>
              <FormField id={`subservice-${rule.id}`} label="Subdienst slug">
                <Input id={`subservice-${rule.id}`} name="subservice_slug" defaultValue={rule.subserviceSlug ?? ""} />
              </FormField>
              <FormField id={`lead-type-${rule.id}`} label="Type">
                <Select id={`lead-type-${rule.id}`} name="lead_type" defaultValue={rule.leadType}>
                  <option value="shared">shared</option>
                  <option value="exclusive">exclusive</option>
                </Select>
              </FormField>
              <FormField id={`base-${rule.id}`} label="Basisprijs">
                <Input id={`base-${rule.id}`} name="base_price_credits" type="number" min="1" defaultValue={rule.basePriceCredits} required />
              </FormField>
              <FormField id={`priority-${rule.id}`} label="Prioriteit">
                <Input id={`priority-${rule.id}`} name="priority" type="number" min="0" defaultValue={rule.priority} required />
              </FormField>
              <FormField id={`exclusive-${rule.id}`} label="Exclusive multiplier">
                <Input id={`exclusive-${rule.id}`} name="exclusive_multiplier" type="number" step="0.01" min="0.1" defaultValue={rule.exclusiveMultiplier ?? 1} />
              </FormField>
              <FormField id={`shared-${rule.id}`} label="Shared multiplier">
                <Input id={`shared-${rule.id}`} name="shared_multiplier" type="number" step="0.01" min="0.1" defaultValue={rule.sharedMultiplier ?? 1} />
              </FormField>
              <FormField id={`min-${rule.id}`} label="Min score">
                <Input id={`min-${rule.id}`} name="min_score" type="number" min="0" max="100" defaultValue={rule.minScore ?? ""} />
              </FormField>
              <FormField id={`max-${rule.id}`} label="Max score">
                <Input id={`max-${rule.id}`} name="max_score" type="number" min="0" max="100" defaultValue={rule.maxScore ?? ""} />
              </FormField>
              <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" name="active" defaultChecked={rule.active} /> Actief</label>
              <div className="xl:col-span-5">
                <SubmitButton pendingLabel="Regel wordt bijgewerkt...">Opslaan</SubmitButton>
              </div>
            </form>
            <form action={toggleLeadPricingRuleAction}>
              <input type="hidden" name="rule_id" value={rule.id} />
              <input type="hidden" name="redirect_to" value="/admin/lead-prijzen" />
              <input type="hidden" name="active" value={String(!rule.active)} />
              <SubmitButton variant="secondary" pendingLabel="Status wordt bijgewerkt...">{rule.active ? "Deactiveer" : "Activeer"}</SubmitButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
