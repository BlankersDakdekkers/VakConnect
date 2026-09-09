import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { updateOwnProfessionalProfileAction } from "@/lib/professionals/actions";
import { getAdminProfessionalDetail } from "@/lib/professionals/queries";
import { formatDate } from "@/lib/utils";

export default async function ProfessionalProfilePage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const user = await requireProfessionalUser();
  const params = await searchParams;
  const success = typeof params.success === "string" ? params.success : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;
  const professional = await getAdminProfessionalDetail(user.professional.id);

  if (!professional) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profiel" description="Bekijk je profiel en wijzig alleen toegestane basisgegevens." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
      <Card className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <StatusBadge value={professional.status} />
          <StatusBadge value={professional.verification_status} />
          <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Aangemaakt: {formatDate(professional.created_at)}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Bedrijf</p>
            <p className="mt-1 font-medium">{professional.company_name}</p>
            <p className="text-sm text-muted-foreground">KvK: {professional.kvk_number ?? "niet ingevuld"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">E-mail (alleen-lezen)</p>
            <p className="mt-1 font-medium">{professional.email}</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Bewerkbare gegevens</h2>
        <form action={updateOwnProfessionalProfileAction} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField id="contact_name" label="Contactpersoon">
              <Input id="contact_name" name="contact_name" defaultValue={professional.contact_name} required />
            </FormField>
            <FormField id="phone" label="Telefoonnummer">
              <Input id="phone" name="phone" defaultValue={professional.phone} required />
            </FormField>
            <FormField id="website" label="Website">
              <Input id="website" name="website" type="url" defaultValue={professional.website ?? ""} placeholder="https://" />
            </FormField>
            <FormField id="description" label="Bedrijfsomschrijving">
              <Input id="description" name="description" defaultValue={professional.description ?? ""} />
            </FormField>
          </div>
          <SubmitButton pendingLabel="Profiel wordt opgeslagen...">Opslaan</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
