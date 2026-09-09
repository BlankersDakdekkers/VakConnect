import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { bulkCreateSeoLocalDraftsAction, bulkUpdateSeoLocalStatusAction } from "@/lib/seo/actions";
import { getSeoLocations } from "@/lib/seo/locations/queries";
import { getSeoLocalPagesAdminList } from "@/lib/seo/local-pages/queries";
import { serviceMainSlugs, serviceSubSlugs } from "@/lib/content/service-pages";

function buildPageHref(input: { page: number; pageSize: number; params: URLSearchParams }) {
  const next = new URLSearchParams(input.params);
  next.set("page", String(input.page));
  next.set("pageSize", String(input.pageSize));
  return `/admin/seo/lokaal?${next.toString()}`;
}

export default async function AdminSeoLocalPagesPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const params = await searchParams;
  const success = typeof params.success === "string" ? params.success : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;

  const serviceFilter = typeof params.service === "string" ? params.service : "";
  const subserviceFilter = typeof params.subservice === "string" ? params.subservice : "";
  const cityFilter = typeof params.city === "string" ? params.city : "";
  const provinceFilter = typeof params.province === "string" ? params.province : "";
  const statusFilter = typeof params.status === "string" ? params.status : "";
  const publishedFilter = typeof params.published === "string" ? params.published : "";
  const indexableFilter = typeof params.indexable === "string" ? params.indexable : "";
  const coverageFilter = typeof params.coverage === "string" ? params.coverage : "";
  const duplicateFilter = typeof params.duplicate === "string" ? params.duplicate : "";
  const sortFilter = typeof params.sort === "string" ? params.sort : "updated_desc";
  const qualityLt = typeof params.quality_lt === "string" && params.quality_lt ? Number(params.quality_lt) : undefined;
  const page = typeof params.page === "string" && Number(params.page) > 0 ? Number(params.page) : 1;
  const pageSize = typeof params.pageSize === "string" && Number(params.pageSize) > 0 ? Number(params.pageSize) : 25;

  const [result, locations] = await Promise.all([
    getSeoLocalPagesAdminList({
      service: serviceFilter || undefined,
      subservice: subserviceFilter || undefined,
      city: cityFilter || undefined,
      province: provinceFilter || undefined,
      status: statusFilter || undefined,
      published: publishedFilter || undefined,
      indexable: indexableFilter || undefined,
      coverage: coverageFilter || undefined,
      duplicate: (duplicateFilter as "" | "high" | "none" | "any-warning") || undefined,
      qualityLt,
      page,
      pageSize,
      sort: sortFilter === "quality_asc" || sortFilter === "quality_desc" ? sortFilter : "updated_desc",
    }),
    getSeoLocations(),
  ]);

  const provinces = [...new Set(locations.map((location) => location.province))].sort((a, b) => a.localeCompare(b, "nl"));
  const routeParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") routeParams.set(key, value);
  }

  const idsOnPage = result.rows.map((row) => row.id).filter((id) => !id.startsWith("fallback"));

  return (
    <div className="space-y-6">
      <PageHeader title="SEO lokale pagina&apos;s" description="Beheer lokale combinaties, coverage en reviewworkflow op schaal." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Filters</h2>
        <form method="get" className="grid gap-4 md:grid-cols-5">
          <FormField id="service" label="Vakgebied">
            <select id="service" name="service" defaultValue={serviceFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle</option>
              {serviceMainSlugs.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </FormField>
          <FormField id="subservice" label="Subdienst">
            <select id="subservice" name="subservice" defaultValue={subserviceFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle</option>
              {serviceSubSlugs.map((item) => (
                <option key={`${item.vakgebied}-${item.subdienst}`} value={item.subdienst}>
                  {item.vakgebied}/{item.subdienst}
                </option>
              ))}
            </select>
          </FormField>
          <FormField id="city" label="Stad">
            <select id="city" name="city" defaultValue={cityFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle</option>
              {locations.map((location) => (
                <option key={location.slug} value={location.slug}>
                  {location.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField id="province" label="Provincie">
            <select id="province" name="province" defaultValue={provinceFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </FormField>
          <FormField id="status" label="Content status">
            <select id="status" name="status" defaultValue={statusFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle</option>
              <option value="draft">draft</option>
              <option value="review">review</option>
              <option value="approved">approved</option>
              <option value="published">published</option>
            </select>
          </FormField>
          <FormField id="coverage" label="Coverage">
            <select id="coverage" name="coverage" defaultValue={coverageFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle</option>
              <option value="none">geen</option>
              <option value="limited">beperkt</option>
              <option value="sufficient">voldoende</option>
            </select>
          </FormField>
          <FormField id="duplicate" label="Duplicate">
            <select id="duplicate" name="duplicate" defaultValue={duplicateFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle</option>
              <option value="any-warning">waarschuwing</option>
              <option value="high">hoog</option>
              <option value="none">geen</option>
            </select>
          </FormField>
          <FormField id="quality_lt" label="Quality &lt;">
            <Input id="quality_lt" name="quality_lt" type="number" min="0" max="100" defaultValue={qualityLt ? String(qualityLt) : ""} />
          </FormField>
          <FormField id="published" label="Published">
            <select id="published" name="published" defaultValue={publishedFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle</option>
              <option value="true">ja</option>
              <option value="false">nee</option>
            </select>
          </FormField>
          <FormField id="indexable" label="Indexable">
            <select id="indexable" name="indexable" defaultValue={indexableFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle</option>
              <option value="true">ja</option>
              <option value="false">nee</option>
            </select>
          </FormField>
          <FormField id="sort" label="Sortering">
            <select id="sort" name="sort" defaultValue={sortFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="updated_desc">laatst bijgewerkt</option>
              <option value="quality_asc">quality laag→hoog</option>
              <option value="quality_desc">quality hoog→laag</option>
            </select>
          </FormField>
          <FormField id="pageSize" label="Page size">
            <select id="pageSize" name="pageSize" defaultValue={String(pageSize)} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </FormField>
          <div className="flex items-end">
            <SubmitButton pendingLabel="Filteren...">Toepassen</SubmitButton>
          </div>
        </form>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Bulk draft create</h2>
        <p className="text-sm text-muted-foreground">Maak conceptpagina&apos;s met service, subdienst, provincie, tier en coveragefilter.</p>
        <form action={bulkCreateSeoLocalDraftsAction} className="grid gap-4 md:grid-cols-4">
          <input type="hidden" name="redirect_to" value="/admin/seo/lokaal" />
          <FormField id="bulk-service" label="Vakgebied">
            <Input id="bulk-service" name="service_slug" placeholder="bijv. dakdekker" required />
          </FormField>
          <FormField id="bulk-subservice" label="Subdienst (optioneel)">
            <Input id="bulk-subservice" name="subservice_slug" placeholder="bijv. daklekkage" />
          </FormField>
          <FormField id="bulk-province" label="Provincie (optioneel)">
            <Input id="bulk-province" name="province" placeholder="bijv. Noord-Brabant" />
          </FormField>
          <FormField id="bulk-tier" label="Tier (optioneel)">
            <select id="bulk-tier" name="tier" defaultValue="" className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">alle tiers</option>
              <option value="A">Tier A</option>
              <option value="B">Tier B</option>
              <option value="C">Tier C</option>
            </select>
          </FormField>
          <FormField id="bulk-cities" label="City slugs (JSON array, optioneel)">
            <Input id="bulk-cities" name="city_slugs" defaultValue='["amsterdam","breda"]' />
          </FormField>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" name="only_with_coverage" className="h-4 w-4" />
            Alleen locaties met coverage
          </label>
          <div className="flex items-end">
            <SubmitButton pendingLabel="Aanmaken...">Drafts aanmaken</SubmitButton>
          </div>
        </form>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Bulk reviewstatus</h2>
        <p className="text-sm text-muted-foreground">Veilige bulkstatusactie op huidige paginaresultaten (geen bulk publish).</p>
        <div className="grid gap-3 md:grid-cols-2">
          <form action={bulkUpdateSeoLocalStatusAction} className="space-y-3">
            <input type="hidden" name="redirect_to" value="/admin/seo/lokaal" />
            <input type="hidden" name="ids" value={JSON.stringify(idsOnPage)} />
            <input type="hidden" name="from_status" value="draft" />
            <input type="hidden" name="to_status" value="review" />
            <SubmitButton pendingLabel="Bijwerken...">Huidige pagina: draft → review</SubmitButton>
          </form>
          <form action={bulkUpdateSeoLocalStatusAction} className="space-y-3">
            <input type="hidden" name="redirect_to" value="/admin/seo/lokaal" />
            <input type="hidden" name="ids" value={JSON.stringify(idsOnPage)} />
            <input type="hidden" name="from_status" value="review" />
            <input type="hidden" name="to_status" value="approved" />
            <SubmitButton pendingLabel="Bijwerken...">Huidige pagina: review → approved</SubmitButton>
          </form>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Lokale combinaties</h2>
        <p className="text-sm text-muted-foreground">
          Totaal {result.total} records · pagina {result.page} van {result.totalPages}
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Stad</th>
                <th className="py-3">Vakgebied</th>
                <th className="py-3">Subdienst</th>
                <th className="py-3">Quality</th>
                <th className="py-3">Duplicate</th>
                <th className="py-3">Coverage</th>
                <th className="py-3">Status</th>
                <th className="py-3">Canonical</th>
                <th className="py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((pageRow) => (
                <tr key={pageRow.id} className="border-t align-top">
                  <td className="py-3">{pageRow.location?.name ?? pageRow.citySlug}</td>
                  <td className="py-3">{pageRow.serviceSlug}</td>
                  <td className="py-3">{pageRow.subserviceSlug ?? "-"}</td>
                  <td className="py-3">{pageRow.qualityScore}</td>
                  <td className="py-3">{pageRow.duplicateRisk}</td>
                  <td className="py-3">{pageRow.coverageStatus}</td>
                  <td className="py-3">{pageRow.contentStatus}</td>
                  <td className="py-3">
                    <Link href={`/admin/seo/lokaal/${pageRow.id}`} className="text-primary hover:underline">
                      {pageRow.canonicalPath}
                    </Link>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">{pageRow.updatedAt || "fallback"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Server-side paginering actief; grote datasets worden niet in één keer geladen.</span>
          <div className="flex gap-2">
            <Link
              href={buildPageHref({ page: Math.max(1, result.page - 1), pageSize: result.pageSize, params: routeParams })}
              className="rounded-full border px-4 py-2 text-xs disabled:opacity-40"
            >
              Vorige
            </Link>
            <Link
              href={buildPageHref({ page: Math.min(result.totalPages, result.page + 1), pageSize: result.pageSize, params: routeParams })}
              className="rounded-full border px-4 py-2 text-xs"
            >
              Volgende
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
