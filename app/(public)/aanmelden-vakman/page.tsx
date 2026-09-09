import type { Metadata } from "next";
import Link from "next/link";
import { SetupRequired } from "@/components/setup-required";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { buildPageMetadata } from "@/lib/config/site";
import { isSupabaseConfigured } from "@/lib/env";
import { submitProfessionalApplicationAction } from "@/lib/public/actions";
import { getActiveServices } from "@/lib/services/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Aanmelden als vakman",
  description: "Meld je vakbedrijf aan bij VakConnect. Aanmeldingen krijgen eerst een pending status en worden handmatig beoordeeld.",
  path: "/aanmelden-vakman",
  keywords: ["vakman aanmelden", "vakbedrijf registratie", "vakconnect professional"],
});

export default async function JoinProfessionalsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [services, params] = await Promise.all([getActiveServices(), searchParams]);
  const success = typeof params.success === "string" ? params.success : null;
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="container-shell space-y-10 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / <Link href="/voor-vakmannen">Voor vakmannen</Link> / Aanmelden</nav>
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Aanmelden als vakman</h1>
        <p className="max-w-3xl text-muted-foreground">
          Meld je bedrijf aan om in aanmerking te komen voor passende aanvragen. Nieuwe aanmeldingen worden niet automatisch geactiveerd.
        </p>
      </section>

      {!isSupabaseConfigured() ? (
        <SetupRequired title="Aanmelden tijdelijk niet beschikbaar" description="De omgeving is nog niet volledig geconfigureerd." />
      ) : null}

      {success ? <p className="rounded-2xl border border-success/30 bg-green-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-6">
        <form action={submitProfessionalApplicationAction} className="grid gap-4 md:grid-cols-2">
          <FormField id="company_name" label="Bedrijfsnaam"><Input id="company_name" name="company_name" required /></FormField>
          <FormField id="contact_name" label="Contactpersoon"><Input id="contact_name" name="contact_name" required /></FormField>
          <FormField id="email" label="E-mail"><Input id="email" name="email" type="email" required /></FormField>
          <FormField id="phone" label="Telefoon"><Input id="phone" name="phone" required /></FormField>
          <FormField id="kvk_number" label="KvK-nummer"><Input id="kvk_number" name="kvk_number" required /></FormField>
          <FormField id="website" label="Website (optioneel)"><Input id="website" name="website" placeholder="https://" /></FormField>

          <FormField id="description" label="Korte bedrijfsomschrijving" className="md:col-span-2">
            <Textarea id="description" name="description" required />
          </FormField>

          <fieldset className="space-y-3 md:col-span-2">
            <legend className="text-sm font-medium">Gewenste diensten</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <label key={service.id} className="flex items-center gap-2 rounded-2xl border bg-surface-muted px-3 py-2 text-sm">
                  <input type="checkbox" name="service_ids" value={service.id} />
                  <span>{service.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <FormField
            id="postal_code_prefixes"
            label="Werkgebied (postcode4)"
            description="Voer één of meer postcodeprefixen in, gescheiden door komma’s. Bijvoorbeeld: 4811, 4812"
            className="md:col-span-2"
          >
            <Input id="postal_code_prefixes" name="postal_code_prefixes" required />
          </FormField>

          <div className="md:col-span-2">
            <SubmitButton pendingLabel="Aanmelding wordt verzonden...">Aanmelden als vakman</SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
