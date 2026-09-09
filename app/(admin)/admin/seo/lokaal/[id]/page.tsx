import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { upsertSeoLocalPageAction } from "@/lib/seo/actions";
import { getSeoLocations } from "@/lib/seo/locations/queries";
import { getSeoLocalPageById } from "@/lib/seo/local-pages/queries";

export default async function AdminSeoLocalPageDetail({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [page, locations] = await Promise.all([getSeoLocalPageById(id), getSeoLocations()]);

  if (!page) {
    notFound();
  }

  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;

  const location = locations.find((item) => item.slug === page.citySlug);
  const locationId = location?.id ?? "";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Lokale pagina: ${page.canonicalPath}`}
        description={`Quality ${page.qualityScore} (${page.qualityLabel}) · duplicate risk: ${page.duplicateRisk}`}
        actions={
          <Link href={`/admin/seo/lokaal/${page.id}/preview`} className="rounded-full border px-4 py-2 text-sm font-medium">
            Preview
          </Link>
        }
      />
      <div className="flex items-center gap-4 text-sm">
        <Link href="/admin/seo/lokaal" className="text-primary hover:underline">
          ← Terug naar lokale pagina's
        </Link>
      </div>
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-4">
        <form action={upsertSeoLocalPageAction} className="space-y-4">
          <input type="hidden" name="id" value={page.id} />
          <input type="hidden" name="redirect_to" value={`/admin/seo/lokaal/${page.id}`} />
          <div className="grid gap-4 md:grid-cols-3">
            <FormField id="service_slug" label="Vakgebied">
              <Input id="service_slug" name="service_slug" defaultValue={page.serviceSlug} required />
            </FormField>
            <FormField id="subservice_slug" label="Subdienst">
              <Input id="subservice_slug" name="subservice_slug" defaultValue={page.subserviceSlug ?? ""} />
            </FormField>
            <FormField id="location_id" label="Locatie">
              <select id="location_id" name="location_id" defaultValue={locationId} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" required>
                {locations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.slug})
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField id="canonical_path" label="Canonical path">
            <Input id="canonical_path" name="canonical_path" defaultValue={page.canonicalPath} required />
          </FormField>

          <FormField id="content_status" label="Content status">
            <select id="content_status" name="content_status" defaultValue={page.contentStatus} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" required>
              <option value="draft">draft</option>
              <option value="review">review</option>
              <option value="approved">approved</option>
              <option value="published">published</option>
            </select>
          </FormField>

          <FormField id="local_intro" label="Local intro (JSON array)">
            <Textarea id="local_intro" name="local_intro" rows={5} defaultValue={JSON.stringify(page.page.intro, null, 2)} required />
          </FormField>
          <FormField id="local_sections" label="Local sections (JSON array)">
            <Textarea id="local_sections" name="local_sections" rows={12} defaultValue={JSON.stringify(page.page.sections, null, 2)} required />
          </FormField>
          <FormField id="faqs" label="FAQ (JSON array)">
            <Textarea id="faqs" name="faqs" rows={8} defaultValue={JSON.stringify(page.page.faqs, null, 2)} required />
          </FormField>
          <FormField id="related_local_links" label="Related local links (city slug JSON array)">
            <Textarea id="related_local_links" name="related_local_links" rows={3} defaultValue={JSON.stringify([], null, 2)} />
          </FormField>
          <FormField id="related_service_links" label="Related service links (JSON array)">
            <Textarea id="related_service_links" name="related_service_links" rows={6} defaultValue={JSON.stringify(page.page.relatedLinks, null, 2)} />
          </FormField>

          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <label className="flex items-center gap-3">
              <Checkbox name="published" defaultChecked={page.published} />
              Published
            </label>
            <label className="flex items-center gap-3">
              <Checkbox name="indexable" defaultChecked={page.indexable} />
              Indexable
            </label>
          </div>

          <SubmitButton pendingLabel="Opslaan...">Lokale pagina opslaan</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
