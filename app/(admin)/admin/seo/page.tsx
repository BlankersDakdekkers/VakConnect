import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { buttonClassName } from "@/components/ui/button";
import { getSeoLocalDashboardSummary, getSeoLocalPages } from "@/lib/seo/local-pages/queries";

export default async function AdminSeoDashboardPage() {
  const [summary, pages] = await Promise.all([getSeoLocalDashboardSummary(), getSeoLocalPages()]);

  const stats = [
    ["Locaties", summary.totalLocations],
    ["Lokale pagina&apos;s", summary.totalLocalPages],
    ["Draft", summary.drafts],
    ["In review", summary.review],
    ["Approved", summary.approved],
    ["Published status", summary.publishedStatus],
    ["Published flag", summary.published],
    ["Indexeerbaar", summary.indexable],
    ["Niet-indexeerbaar", summary.nonIndexable],
    ["Gem. quality", summary.averageQualityScore],
    ["Waarschuwingen", summary.warningPages],
    ["Coverage geen", summary.coverageNone],
    ["Coverage beperkt", summary.coverageLimited],
    ["Coverage voldoende", summary.coverageSufficient],
  ];

  const warnings = pages
    .filter((page) => page.qualityLabel === "onvoldoende" || page.duplicateRisk !== "low")
    .sort((a, b) => a.qualityScore - b.qualityScore)
    .slice(0, 12);

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO overzicht"
        description="Database-gedreven lokale SEO-status, kwaliteit en publicatiecontrole."
        actions={
          <div className="flex gap-2">
            <Link href="/admin/seo/locaties" className={buttonClassName({ variant: "secondary", size: "sm" })}>
              Locaties
            </Link>
            <Link href="/admin/seo/lokaal" className={buttonClassName({ variant: "secondary", size: "sm" })}>
              Lokale pagina&apos;s
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label} className="space-y-2">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Pagina&apos;s met waarschuwing</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Canonical</th>
                <th className="py-3">Status</th>
                <th className="py-3">Quality</th>
                <th className="py-3">Duplicatie</th>
              </tr>
            </thead>
            <tbody>
              {warnings.map((page) => (
                <tr key={page.id} className="border-t">
                  <td className="py-3">
                    <Link href={`/admin/seo/lokaal/${page.id}`} className="text-primary hover:underline">
                      {page.canonicalPath}
                    </Link>
                  </td>
                  <td className="py-3">{page.contentStatus}</td>
                  <td className="py-3">{page.qualityScore} ({page.qualityLabel})</td>
                  <td className="py-3">{page.duplicateRisk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
