import type { Metadata } from "next";
import Link from "next/link";
import { SetupRequired } from "@/components/setup-required";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { ProcessSteps } from "@/components/public/process-steps";
import { buildPageMetadata } from "@/lib/config/site";
import { isSupabaseConfigured } from "@/lib/env";
import { submitProfessionalApplicationAction } from "@/lib/public/actions";
import { getActiveServices } from "@/lib/services/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Aanmelden als vakman bij VakConnect",
  description: "Meld je vakbedrijf aan met je bedrijfsgegevens, diensten en werkgebied. Nieuwe aanmeldingen worden handmatig beoordeeld.",
  path: "/aanmelden-vakman",
  keywords: ["vakman aanmelden", "vakbedrijf registratie", "VakConnect professional"],
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
    <div className="container-shell space-y-10 py-10 sm:py-14">
      <nav className="text-sm text-muted-foreground" aria-label="Broodkruimel">
        <Link href="/">Home</Link> / <Link href="/voor-vakmannen">Voor vakmannen</Link> / Aanmelden
      </nav>
      <section className="space-y-4">
        <p className="text-sm font-medium text-primary">Aanmelden als vakbedrijf</p>
        <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">Laat zien welk werk je doet en waar je werkt</h1>
        <p className="max-w-prose text-base leading-7 text-muted-foreground sm:text-lg">
          Deel je bedrijfsgegevens, diensten en werkgebied. We beoordelen je aanmelding voordat je profiel wordt geactiveerd.
        </p>
      </section>

      <section aria-label="Stappen voor aanmelden">
        <ProcessSteps
          steps={[
            { title: "Bedrijfsgegevens", description: "Vul je bedrijfsnaam, contactgegevens en KvK-nummer in." },
            { title: "Diensten en regio", description: "Kies het soort opdrachten dat bij je bedrijf past en geef je werkgebied op." },
            { title: "Beoordeling", description: "We nemen je gegevens door en laten weten wat de vervolgstap is." },
          ]}
        />
      </section>

      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Wat heb je nodig?</h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Houd je bedrijfs- en contactgegevens, KvK-nummer, een korte omschrijving, diensten en postcodegebieden bij de hand. In vervolgstappen kunnen we, afhankelijk van je profiel en diensten, vragen naar ervaring, capaciteit of aanvullende documenten.
        </p>
      </Card>

      {!isSupabaseConfigured() ? (
        <SetupRequired title="Aanmelden tijdelijk niet beschikbaar" description="De omgeving is nog niet volledig geconfigureerd." />
      ) : null}

      {success ? <p role="status" className="rounded-2xl border border-success/30 bg-green-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p role="alert" className="rounded-2xl border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Gegevens van je bedrijf</h2>
          <p className="text-sm text-muted-foreground">Vul de velden in om je aanmelding ter beoordeling te versturen.</p>
        </div>
        <form action={submitProfessionalApplicationAction} className="grid gap-4 md:grid-cols-2">
          <FormField id="company_name" label="Bedrijfsnaam"><Input id="company_name" name="company_name" required autoComplete="organization" /></FormField>
          <FormField id="contact_name" label="Naam contactpersoon"><Input id="contact_name" name="contact_name" required autoComplete="name" /></FormField>
          <FormField id="email" label="E-mailadres"><Input id="email" name="email" type="email" required autoComplete="email" /></FormField>
          <FormField id="phone" label="Telefoonnummer"><Input id="phone" name="phone" required autoComplete="tel" /></FormField>
          <FormField id="kvk_number" label="KvK-nummer"><Input id="kvk_number" name="kvk_number" required /></FormField>
          <FormField id="website" label="Website (optioneel)"><Input id="website" name="website" placeholder="https://" autoComplete="url" /></FormField>

          <FormField id="description" label="Korte omschrijving van je bedrijf" description="Vertel welk werk je doet en waar je ervaring ligt." className="md:col-span-2">
            <Textarea id="description" name="description" required />
          </FormField>

          <fieldset className="space-y-3 md:col-span-2">
            <legend className="text-sm font-medium">Welke diensten voer je uit?</legend>
            <p className="text-sm text-muted-foreground">Selecteer één of meer diensten die bij je bedrijf passen.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((service) => (
                <label key={service.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border bg-surface-muted px-3 py-2 text-sm">
                  <input type="checkbox" name="service_ids" value={service.id} />
                  <span>{service.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <FormField
            id="postal_code_prefixes"
            label="Postcodegebieden waarin je werkt"
            description="Vul de eerste vier cijfers in, gescheiden door komma’s. Bijvoorbeeld: 4811, 4812."
            className="md:col-span-2"
          >
            <Input id="postal_code_prefixes" name="postal_code_prefixes" required placeholder="4811, 4812" />
          </FormField>

          <div className="md:col-span-2">
            <SubmitButton pendingLabel="Aanmelding wordt verzonden...">Verstuur mijn aanmelding</SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
