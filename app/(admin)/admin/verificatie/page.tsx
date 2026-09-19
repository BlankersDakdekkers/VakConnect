import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { getVerificationQueue } from "@/lib/professionals/queries";
import { formatDate } from "@/lib/utils";

export default async function AdminVerificationPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const filter = typeof params.filter === "string" ? params.filter as "submitted" | "pending" | "changes_requested" | "verified" | "rejected" | "all" : "all";
  const sort = typeof params.sort === "string" ? params.sort as "oldest" | "newest" : "oldest";
  const professionals = await getVerificationQueue(filter, sort);

  return (
    <div className="space-y-6">
      <PageHeader title="Verificatie" description="Review queue voor onboarding, documenten en verificatiebesluiten." />
      <Card className="flex flex-wrap gap-3">
        {(["all", "submitted", "pending", "changes_requested", "verified", "rejected"] as const).map((value) => (
          <Link key={value} href={`/admin/verificatie?filter=${value}&sort=${sort}`} className={`rounded-full px-4 py-2 text-sm ${filter === value ? "bg-primary text-white" : "border"}`}>{value}</Link>
        ))}
        <Link href={`/admin/verificatie?filter=${filter}&sort=${sort === "oldest" ? "newest" : "oldest"}`} className="rounded-full border px-4 py-2 text-sm">Sorteer: {sort}</Link>
      </Card>
      <Card className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-3">Bedrijf</th>
              <th className="py-3">Onboarding</th>
              <th className="py-3">Verificatie</th>
              <th className="py-3">Kwaliteit</th>
              <th className="py-3">Ontbreekt</th>
              <th className="py-3">Ingediend</th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((professional) => (
              <tr key={professional.id} className="border-t align-top">
                <td className="py-4"><Link href={`/admin/vakmannen/${professional.id}`} className="font-medium text-primary hover:underline">{professional.company_name}</Link><div className="text-muted-foreground">{professional.contact_name}</div></td>
                <td className="py-4"><StatusBadge value={professional.onboarding_status} /></td>
                <td className="py-4"><StatusBadge value={professional.verification_status} /></td>
                <td className="py-4">{professional.quality_score}/100 ({professional.qualityLabel})</td>
                <td className="py-4 text-muted-foreground">{professional.missingSteps.join(", ") || "-"}</td>
                <td className="py-4 text-muted-foreground">{professional.submittedAt ? formatDate(professional.submittedAt) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!professionals.length ? <p className="p-4 text-sm text-muted-foreground">Geen vakmannen in deze queue.</p> : null}
      </Card>
    </div>
  );
}
