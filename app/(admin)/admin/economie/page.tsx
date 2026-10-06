import Link from "next/link";
import { EconomicsDashboard } from "@/components/admin/economics-dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdminUser } from "@/lib/auth/helpers";
import { parseEconomicsDays, type EconomicsReport } from "@/lib/economics/metrics";
import { getAdminEconomicsReport } from "@/lib/economics/queries";

export const dynamic = "force-dynamic";

export default async function EconomicsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminUser();
  const days = parseEconomicsDays((await searchParams).days);
  let report: EconomicsReport;
  try {
    report = await getAdminEconomicsReport(days);
  } catch {
    return (
      <section className="min-w-0 rounded-3xl border bg-surface p-5">
        <PageHeader title="Lead-economie" description="Alleen-lezen rapport over aankoopcohorten en credits." />
        <p className="mt-4" role="alert">Het economierapport is momenteel niet beschikbaar. Probeer het opnieuw.</p>
        <Link className="mt-4 inline-block underline" href={`/admin/economie?days=${days}`}>Opnieuw proberen</Link>
      </section>
    );
  }
  return <EconomicsDashboard report={report} />;
}
