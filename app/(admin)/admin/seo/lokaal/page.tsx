import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { bulkCreateSeoLocalDraftsAction } from "@/lib/seo/actions";
import { getSeoLocations } from "@/lib/seo/locations/queries";
import { getSeoLocalPages } from "@/lib/seo/local-pages/queries";
import { serviceMainSlugs, serviceSubSlugs } from "@/lib/content/service-pages";

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

  const [pages, locations] = await Promise.all([getSeoLocalPages(), getSeoLocations()]);
  const locationBySlug = new Map(locations.map((location) => [location.slug, location]));

  const rows = pages
    .map((page) => ({ ...page, location: locationBySlug.get(page.citySlug) }))
    .filter((page) => (!serviceFilter ? true : page.serviceSlug === serviceFilter))
    .filter((page) => (!subserviceFilter ? true : (page.subserviceSlug ?? "") === subserviceFilter))
    .filter((page) => (!cityFilter ? true : page.citySlug === cityFilter))
    .filter((page) => (!provinceFilter ? true : page.location?.province === provinceFilter))
    .filter((page) => (!statusFilter ? true : page.contentStatus === statusFilter))
    .filter((page) => {
      if (!publishedFilter) return true;
      return publishedFilter === "true" ? page.published : !page.published;
    })
    .filter((page) => {
      if (!indexableFilter) return true;
      return indexableFilter === "true" ? page.indexable : !page.indexable;
    })
    .sort((a, b) => b.page.path.localeCompare(a.page.path));

  const provinces = [...new Set(locations.map((location) => location.province))].sort((a, b) => a.localeCompare(b, "nl"));

  return (
    <div className="space-y-6">
      <PageHeader title="SEO lokale pagina&apos;s" description="Beheer lokale combinaties, statusworkflow en indexatie." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Filters</h2>
        <form method="get" className="grid gap-4 md:grid-cols-4">
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
          <div className="flex items-end">
            <SubmitButton pendingLabel="Filteren...">Toepassen</SubmitButton>
          </div>
        </form>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Bulk draft create</h2>
        <p className="text-sm text-muted-foreground">Maak veilig meerdere conceptpagina&apos;s aan zonder auto-publicatie of auto-content.</p>
        <form action={bulkCreateSeoLocalDraftsAction} className="grid gap-4 md:grid-cols-4">
          <input type="hidden" name="redirect_to" value="/admin/seo/lokaal" />
          <FormField id="bulk-service" label="Vakgebied">
            <Input id="bulk-service" name="service_slug" placeholder="bijv. dakdekker" required />
          </FormField>
          <FormField id="bulk-subservice" label="Subdienst (optioneel)">
            <Input id="bulk-subservice" name="subservice_slug" placeholder="bijv. daklekkage" />
          </FormField>
          <FormField id="bulk-cities" label="City slugs (JSON array)">
            <Input id="bulk-cities" name="city_slugs" defaultValue='["amsterdam","breda"]' required />
          </FormField>
          <div className="flex items-end">
            <SubmitButton pendingLabel="Aanmaken...">Drafts aanmaken</SubmitButton>
          </div>
        </form>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Lokale combinaties</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Vakgebied</th>
                <th className="py-3">Subdienst</th>
                <th className="py-3">Stad</th>
                <th className="py-3">Status</th>
                <th className="py-3">Published</th>
                <th className="py-3">Indexable</th>
                <th className="py-3">Canonical</th>
                <th className="py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((page) => (
                <tr key={page.id} className="border-t align-top">
                  <td className="py-3">{page.serviceSlug}</td>
                  <td className="py-3">{page.subserviceSlug ?? "-"}</td>
                  <td className="py-3">{page.location?.name ?? page.citySlug}</td>
                  <td className="py-3">{page.contentStatus}</td>
                  <td className="py-3">{page.published ? "ja" : "nee"}</td>
                  <td className="py-3">{page.indexable ? "ja" : "nee"}</td>
                  <td className="py-3">
                    <Link href={`/admin/seo/lokaal/${page.id}`} className="text-primary hover:underline">
                      {page.canonicalPath}
                    </Link>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">{page.id.startsWith("fallback") ? "fallback" : "db"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
