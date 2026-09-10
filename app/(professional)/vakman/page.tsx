import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { formatCredits } from "@/lib/commercial/labels";
import { getProfessionalWalletOverview } from "@/lib/commercial/queries";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalDashboardStats } from "@/lib/leads/queries";

export default async function ProfessionalDashboardPage() {
  const user = await requireProfessionalUser();
  const [stats, wallet] = await Promise.all([
    getProfessionalDashboardStats(user.professional.id),
    getProfessionalWalletOverview(user.professional.id),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overzicht"
        description="Jouw KPI’s op basis van eigen assignments en leadprogressie."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card className="space-y-2">
        <p className="text-sm text-muted-foreground">Creditsaldo</p>
        <p className="text-4xl font-semibold tracking-tight">{formatCredits(wallet.cachedBalance)}</p>
        <p className="text-sm text-muted-foreground">Direct beschikbaar voor nieuwe leadaankopen.</p>
      </Card>
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
