import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCredits } from "@/lib/commercial/labels";
import { getProfessionalWalletOverview } from "@/lib/commercial/queries";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalDashboardStats } from "@/lib/leads/queries";
import { getOwnProfessionalDetail } from "@/lib/professionals/queries";

export default async function ProfessionalDashboardPage() {
  const user = await requireProfessionalUser();
  const [stats, wallet, professional] = await Promise.all([
    getProfessionalDashboardStats(user.professional.id),
    getProfessionalWalletOverview(user.professional.id),
    getOwnProfessionalDetail(user.professional.id),
  ]);

  if (!professional) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Overzicht" description="Volg je onboarding, verificatie, profielkwaliteit en huidige capaciteit." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Creditsaldo</p>
          <p className="text-4xl font-semibold tracking-tight">{formatCredits(wallet.cachedBalance)}</p>
          <p className="text-sm text-muted-foreground">Direct beschikbaar voor nieuwe leadaankopen.</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm text-muted-foreground">Onboarding</p>
          <StatusBadge value={professional.onboarding_status} />
          <p className="text-2xl font-semibold tracking-tight">{professional.onboarding_completion}%</p>
          <Link href="/vakman/onboarding" className="text-sm font-medium text-primary hover:underline">Profiel afronden</Link>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm text-muted-foreground">Verificatie</p>
          <StatusBadge value={professional.verification_status} />
          <p className="text-sm text-muted-foreground">Kwaliteit {professional.quality_score}/100 ({professional.qualityLabel})</p>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm text-muted-foreground">Beschikbaarheid</p>
          <StatusBadge value={professional.distributionSettings?.availability_status ?? "available"} />
          <p className="text-sm text-muted-foreground">Max open offers {professional.distributionSettings?.max_open_offers ?? 0}</p>
          <p className="text-sm text-muted-foreground">Max actieve opdrachten {professional.distributionSettings?.max_active_assignments ?? 0}</p>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Actiepunten</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {professional.missingSteps.length ? professional.missingSteps.map((step) => <li key={step}>{step}</li>) : <li>Geen ontbrekende onboardingstappen.</li>}
          </ul>
          <p className="text-sm text-muted-foreground">Distributie-eligibility: <strong>{professional.distributionEligible ? "eligible" : "nog niet eligible"}</strong></p>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Huidige profielstatus</h2>
          <p className="text-sm text-muted-foreground">Diensten: {professional.serviceNames.join(", ") || "geen"}</p>
          <p className="text-sm text-muted-foreground">Werkgebieden: {professional.postalCodePrefixes.join(", ") || "geen"}</p>
          <p className="text-sm text-muted-foreground">Documenten: {professional.documents.length}</p>
          <Link href="/vakman/profiel" className="text-sm font-medium text-primary hover:underline">Profiel beheren</Link>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="space-y-2">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-4xl font-semibold tracking-tight">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
