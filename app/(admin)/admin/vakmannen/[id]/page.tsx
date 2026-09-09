import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateProfessionalStatusAction } from "@/lib/professionals/actions";
import { getAdminProfessionalDetail } from "@/lib/professionals/queries";
import { professionalStatusValues } from "@/lib/validation";
import { formatDate } from "@/lib/utils";

export default async function AdminProfessionalDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const professional = await getAdminProfessionalDetail(id);

  if (!professional) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={professional.company_name} title="Vakman detail" description="Bekijk accountstatus, diensten en werkgebieden." />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <StatusBadge value={professional.status} />
            <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Aangemaakt: {formatDate(professional.created_at)}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Contactpersoon</p>
              <p className="mt-1 font-medium">{professional.contact_name}</p>
              <p className="text-sm text-muted-foreground">{professional.email}</p>
              <p className="text-sm text-muted-foreground">{professional.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bedrijfsgegevens</p>
              <p className="mt-1 font-medium">{professional.company_name}</p>
              <p className="text-sm text-muted-foreground">KvK: {professional.kvk_number ?? "niet ingevuld"}</p>
              <p className="text-sm text-muted-foreground">Website: {professional.website ?? "niet ingevuld"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Diensten</p>
            <p className="mt-2">{professional.serviceNames.join(", ") || "Geen gekoppelde diensten"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Werkgebieden</p>
            <p className="mt-2">{professional.postalCodePrefixes.join(", ") || "Geen werkgebieden"}</p>
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Status beheren</h2>
          <form action={updateProfessionalStatusAction} className="space-y-4">
            <input type="hidden" name="professional_id" value={professional.id} />
            <input type="hidden" name="redirect_to" value={`/admin/vakmannen/${professional.id}`} />
            <Select name="status" defaultValue={professional.status}>
              {professionalStatusValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
            <SubmitButton pendingLabel="Status wordt opgeslagen...">Status opslaan</SubmitButton>
          </form>
        </Card>
      </div>
    </div>
  );
}
