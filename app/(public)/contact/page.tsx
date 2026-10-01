import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { buildPageMetadata, siteConfig } from "@/lib/config/site";
import { submitContactFormAction } from "@/lib/public/actions";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Neem contact op met VakConnect over je aanvraag, vakman-aanmelding, account, verificatie of een technisch probleem.",
  path: "/contact",
  keywords: ["contact vakconnect", "vraag stellen vakconnect"],
});

export default async function ContactPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const success = typeof params.success === "string" ? params.success : null;
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="container-shell space-y-10 py-14">
      <nav className="text-sm text-muted-foreground"><Link href="/">Home</Link> / Contact</nav>
      <section className="space-y-4">
        <p className="text-sm font-medium text-primary">We helpen je op weg</p>
        <h1 className="text-4xl font-semibold tracking-tight">Waar kunnen we je mee helpen?</h1>
        <p className="max-w-3xl leading-7 text-muted-foreground">
          Stel een vraag over je aanvraag, aanmelden als vakman, account of verificatie. Ook voor een technisch probleem kun je hieronder een bericht sturen.
        </p>
      </section>

      {success ? <p className="rounded-2xl border border-success/30 bg-green-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Stuur VakConnect een bericht</h2>
          <p className="text-sm leading-6 text-muted-foreground">Kies het onderwerp dat het beste past. Vermeld bij een technisch probleem wat er gebeurde en op welke pagina.</p>
        </div>
        <form action={submitContactFormAction} className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            defaultValue=""
          />
          <FormField id="reason" label="Waar gaat je vraag over?" className="md:col-span-2">
            <Select id="reason" name="reason" required>
              <option value="consument">Consumentenvraag</option>
              <option value="vakman">Vraag als vakman</option>
              <option value="algemeen">Account, verificatie of technisch probleem</option>
            </Select>
          </FormField>
          <FormField id="name" label="Naam"><Input id="name" name="name" required /></FormField>
          <FormField id="email" label="E-mail"><Input id="email" name="email" type="email" required /></FormField>
          <FormField id="phone" label="Telefoon (optioneel)"><Input id="phone" name="phone" /></FormField>
          <div className="hidden md:block" />
          <FormField id="message" label="Bericht" className="md:col-span-2">
            <Textarea id="message" name="message" required />
          </FormField>
          <div className="md:col-span-2">
            <SubmitButton pendingLabel="Bericht wordt verstuurd...">Verstuur bericht</SubmitButton>
          </div>
        </form>
      </Card>

      <p className="text-sm text-muted-foreground">
        Liever direct mailen? <a className="text-primary underline underline-offset-4" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
    </div>
  );
}
