import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getProfessionalDashboardStats } from "@/lib/leads/queries";

export default async function ProfessionalDashboardPage() {
  const user = await requireProfessionalUser();
  const stats = await getProfessionalDashboardStats(user.professional.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overzicht"
        description="Jouw KPI’s op basis van eigen assignments en leadprogressie."
      />
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
