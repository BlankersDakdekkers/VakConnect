import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getAdminProfessionalDetail } from "@/lib/professionals/queries";
import { formatDate } from "@/lib/utils";

export default async function ProfessionalProfilePage() {
  const user = await requireProfessionalUser();
  const professional = await getAdminProfessionalDetail(user.professional.id);

  if (!professional) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profiel" description="Een overzicht van jouw gekoppelde bedrijfsgegevens, diensten en werkgebieden." />
      <Card className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <StatusBadge value={professional.status} />
          <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Aangemaakt: {formatDate(professional.created_at)}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Bedrijf</p>
            <p className="mt-1 font-medium">{professional.company_name}</p>
            <p className="text-sm text-muted-foreground">Contact: {professional.contact_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bereikbaarheid</p>
            <p className="mt-1 font-medium">{professional.email}</p>
            <p className="text-sm text-muted-foreground">{professional.phone}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Diensten</p>
          <p className="mt-1">{professional.serviceNames.join(", ") || "Geen gekoppelde diensten"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Werkgebieden</p>
          <p className="mt-1">{professional.postalCodePrefixes.join(", ") || "Geen werkgebieden"}</p>
        </div>
      </Card>
    </div>
  );
}
