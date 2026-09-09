import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { upsertSeoLocationAction } from "@/lib/seo/actions";
import { getSeoLocations } from "@/lib/seo/locations/queries";

export default async function AdminSeoLocationsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const params = await searchParams;
  const success = typeof params.success === "string" ? params.success : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;
  const q = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";
  const provinceFilter = typeof params.province === "string" ? params.province : "";

  const locations = (await getSeoLocations())
    .filter((location) => (!q ? true : location.name.toLowerCase().includes(q) || location.slug.includes(q)))
    .filter((location) => (!provinceFilter ? true : location.province === provinceFilter))
    .sort((a, b) => a.name.localeCompare(b.name, "nl"));

  const provinces = [...new Set((await getSeoLocations()).map((location) => location.province))].sort((a, b) => a.localeCompare(b, "nl"));

  return (
    <div className="space-y-6">
      <PageHeader title="SEO locaties" description="Beheer steden, publicatieflags en lokale contextdata." />
      {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Zoeken en filteren</h2>
        <form className="grid gap-4 md:grid-cols-3" method="get">
          <FormField id="q" label="Zoekterm">
            <Input id="q" name="q" defaultValue={q} placeholder="stad of slug" />
          </FormField>
          <FormField id="province" label="Provincie">
            <select id="province" name="province" defaultValue={provinceFilter} className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">Alle provincies</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </FormField>
          <div className="flex items-end">
            <SubmitButton pendingLabel="Filteren...">Filter toepassen</SubmitButton>
          </div>
        </form>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Nieuwe locatie</h2>
          <form action={upsertSeoLocationAction} className="space-y-3">
            <input type="hidden" name="redirect_to" value="/admin/seo/locaties" />
            <FormField id="name" label="Naam">
              <Input id="name" name="name" required />
            </FormField>
            <FormField id="slug" label="Slug">
              <Input id="slug" name="slug" required />
            </FormField>
            <FormField id="province-create" label="Provincie">
              <Input id="province-create" name="province" required />
            </FormField>
            <FormField id="region-label" label="Region label">
              <Input id="region-label" name="region_label" />
            </FormField>
            <FormField id="population-band" label="Population band">
              <Input id="population-band" name="population_band" />
            </FormField>
            <FormField id="priority" label="Priority (0-1)">
              <Input id="priority" name="priority" type="number" min="0" max="1" step="0.01" defaultValue="0.5" required />
            </FormField>
            <FormField id="intro-facts" label="Intro facts (JSON array)">
              <Textarea id="intro-facts" name="intro_facts" defaultValue={JSON.stringify(["", ""], null, 2)} rows={4} required />
            </FormField>
            <FormField id="local-characteristics" label="Local characteristics (JSON array)">
              <Textarea id="local-characteristics" name="local_characteristics" defaultValue={JSON.stringify(["", ""], null, 2)} rows={4} required />
            </FormField>
            <FormField id="nearby-city-slugs" label="Nearby city slugs (JSON array)">
              <Textarea id="nearby-city-slugs" name="nearby_city_slugs" defaultValue="[]" rows={3} />
            </FormField>
            <FormField id="housing-notes" label="Housing notes">
              <Textarea id="housing-notes" name="housing_notes" rows={3} />
            </FormField>
            <div className="flex flex-wrap gap-6 text-sm font-medium">
              <label className="flex items-center gap-3">
                <Checkbox name="published" />
                Published
              </label>
              <label className="flex items-center gap-3">
                <Checkbox name="indexable" />
                Indexable
              </label>
            </div>
            <SubmitButton pendingLabel="Opslaan...">Locatie toevoegen</SubmitButton>
          </form>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Bestaande locaties</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-3">Naam</th>
                  <th className="py-3">Provincie</th>
                  <th className="py-3">Published</th>
                  <th className="py-3">Indexable</th>
                  <th className="py-3">Priority</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location.id} className="border-t">
                    <td className="py-3">
                      <Link href={`/admin/seo/locaties/${location.id}`} className="font-medium text-primary hover:underline">
                        {location.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">/{location.slug}</p>
                    </td>
                    <td className="py-3">{location.province}</td>
                    <td className="py-3">{location.published ? "ja" : "nee"}</td>
                    <td className="py-3">{location.indexable ? "ja" : "nee"}</td>
                    <td className="py-3">{location.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
