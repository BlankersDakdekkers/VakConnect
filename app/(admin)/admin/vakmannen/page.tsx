import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { createProfessionalAction } from "@/lib/professionals/actions";
import { getAdminProfessionals } from "@/lib/professionals/queries";
import { getAdminServices } from "@/lib/services/queries";
import { professionalStatusValues, professionalVerificationStatusValues } from "@/lib/validation";
import { formatDate } from "@/lib/utils";

export default async function AdminProfessionalsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const success = typeof params.success === "string" ? params.success : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;
  const [professionals, services] = await Promise.all([getAdminProfessionals(), getAdminServices()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Vakmannen" description="Beheer vakmannen, onboardingstatus, verificatie en profielkwaliteit." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-5">
          <h2 className="text-lg font-semibold tracking-tight">Nieuwe vakman toevoegen</h2>
          <form action={createProfessionalAction} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="company_name" label="Bedrijfsnaam"><Input id="company_name" name="company_name" required /></FormField>
              <FormField id="contact_name" label="Contactpersoon"><Input id="contact_name" name="contact_name" required /></FormField>
              <FormField id="email" label="E-mailadres"><Input id="email" name="email" type="email" required /></FormField>
              <FormField id="phone" label="Telefoonnummer"><Input id="phone" name="phone" required /></FormField>
              <FormField id="password" label="Tijdelijk wachtwoord"><Input id="password" name="password" type="password" required /></FormField>
              <FormField id="status" label="Status"><Select id="status" name="status" defaultValue="active">{professionalStatusValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select></FormField>
              <FormField id="verification_status" label="Verificatie"><Select id="verification_status" name="verification_status" defaultValue="unverified">{professionalVerificationStatusValues.map((value) => <option key={value} value={value}>{value}</option>)}</Select></FormField>
              <FormField id="kvk_number" label="KvK-nummer"><Input id="kvk_number" name="kvk_number" /></FormField>
              <FormField id="website" label="Website"><Input id="website" name="website" type="url" placeholder="https://" /></FormField>
            </div>
            <FormField id="description" label="Bedrijfsomschrijving"><Input id="description" name="description" /></FormField>
            <FormField id="service_ids" label="Diensten"><div className="grid gap-3 md:grid-cols-2">{services.filter((service) => service.active).map((service) => <label key={service.id} className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm"><Checkbox name="service_ids" value={service.id} /><span>{service.name}</span></label>)}</div></FormField>
            <FormField id="postal_code_prefixes" label="Werkgebieden" description="Viercijferige prefixen, gescheiden door komma's"><Input id="postal_code_prefixes" name="postal_code_prefixes" required /></FormField>
            <SubmitButton pendingLabel="Vakman wordt aangemaakt...">Vakman toevoegen</SubmitButton>
          </form>
        </Card>
        <Card className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Bedrijf</th>
                <th className="py-3">Status</th>
                <th className="py-3">Onboarding</th>
                <th className="py-3">Verificatie</th>
                <th className="py-3">Kwaliteit</th>
                <th className="py-3">Werkgebieden</th>
                <th className="py-3">Aangemaakt</th>
              </tr>
            </thead>
            <tbody>
              {professionals.map((professional) => (
                <tr key={professional.id} className="border-t align-top">
                  <td className="py-4"><Link href={`/admin/vakmannen/${professional.id}`} className="font-medium text-primary hover:underline">{professional.company_name}</Link><div className="text-muted-foreground">{professional.contact_name}</div></td>
                  <td className="py-4"><StatusBadge value={professional.status} /></td>
                  <td className="py-4"><StatusBadge value={professional.onboarding_status} /></td>
                  <td className="py-4"><StatusBadge value={professional.verification_status} /></td>
                  <td className="py-4">{professional.quality_score}/100 ({professional.qualityLabel})</td>
                  <td className="py-4">{professional.postalCodePrefixes.join(", ") || "-"}</td>
                  <td className="py-4 text-muted-foreground">{formatDate(professional.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
