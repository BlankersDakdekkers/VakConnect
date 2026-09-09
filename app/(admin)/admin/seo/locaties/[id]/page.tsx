import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { upsertSeoLocationAction } from "@/lib/seo/actions";
import { getSeoLocationById } from "@/lib/seo/locations/queries";

export default async function AdminSeoLocationDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const location = await getSeoLocationById(id);

  if (!location) {
    notFound();
  }

  const success = typeof query.success === "string" ? query.success : undefined;
  const error = typeof query.error === "string" ? query.error : undefined;

  return (
    <div className="space-y-6">
      <PageHeader title={`Locatie: ${location.name}`} description="Beheer locatiecontent, publicatie en indexatie." />
      <Link href="/admin/seo/locaties" className="text-sm text-primary hover:underline">
        ← Terug naar locaties
      </Link>
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-4">
        <form action={upsertSeoLocationAction} className="space-y-4">
          <input type="hidden" name="id" value={location.id} />
          <input type="hidden" name="redirect_to" value={`/admin/seo/locaties/${location.id}`} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField id="name" label="Naam">
              <Input id="name" name="name" defaultValue={location.name} required />
            </FormField>
            <FormField id="slug" label="Slug">
              <Input id="slug" name="slug" defaultValue={location.slug} required />
            </FormField>
            <FormField id="province" label="Provincie">
              <Input id="province" name="province" defaultValue={location.province} required />
            </FormField>
            <FormField id="region_label" label="Region label">
              <Input id="region_label" name="region_label" defaultValue={location.region_label ?? ""} />
            </FormField>
            <FormField id="population_band" label="Population band">
              <Input id="population_band" name="population_band" defaultValue={location.population_band ?? ""} />
            </FormField>
            <FormField id="priority" label="Priority (0-1)">
              <Input id="priority" name="priority" type="number" min="0" max="1" step="0.01" defaultValue={String(location.priority)} required />
            </FormField>
          </div>

          <FormField id="intro_facts" label="Intro facts (JSON array)">
            <Textarea id="intro_facts" name="intro_facts" rows={4} defaultValue={JSON.stringify(location.intro_facts, null, 2)} required />
          </FormField>
          <FormField id="local_characteristics" label="Local characteristics (JSON array)">
            <Textarea id="local_characteristics" name="local_characteristics" rows={4} defaultValue={JSON.stringify(location.local_characteristics, null, 2)} required />
          </FormField>
          <FormField id="nearby_city_slugs" label="Nearby city slugs (JSON array)">
            <Textarea id="nearby_city_slugs" name="nearby_city_slugs" rows={3} defaultValue={JSON.stringify(location.nearby_city_slugs, null, 2)} />
          </FormField>
          <FormField id="housing_notes" label="Housing notes">
            <Textarea id="housing_notes" name="housing_notes" rows={3} defaultValue={location.housing_notes ?? ""} />
          </FormField>

          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <label className="flex items-center gap-3">
              <Checkbox name="published" defaultChecked={location.published} />
              Published
            </label>
            <label className="flex items-center gap-3">
              <Checkbox name="indexable" defaultChecked={location.indexable} />
              Indexable
            </label>
          </div>

          <SubmitButton pendingLabel="Opslaan...">Locatie opslaan</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
