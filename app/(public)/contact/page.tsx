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
  description: "Neem contact op met VakConnect voor vragen van consumenten, vakmannen en algemene onderwerpen.",
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
        <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="max-w-3xl text-muted-foreground">Heb je een vraag als consument, vakman of over VakConnect in het algemeen? Laat een bericht achter.</p>
      </section>

      {success ? <p className="rounded-2xl border border-success/30 bg-green-50 px-4 py-3 text-sm text-success">{success}</p> : null}
      {error ? <p className="rounded-2xl border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}

      <Card className="space-y-6">
        <form action={submitContactFormAction} className="grid gap-4 md:grid-cols-2">
          <FormField id="reason" label="Waar gaat je vraag over?" className="md:col-span-2">
            <Select id="reason" name="reason" required>
              <option value="consument">Consumentenvraag</option>
              <option value="vakman">Vraag als vakman</option>
              <option value="algemeen">Algemene vraag</option>
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

      <p className="text-sm text-muted-foreground">Liever direct mailen? {siteConfig.contactEmail}</p>
    </div>
  );
}
