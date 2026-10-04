import { Card } from "@/components/ui/card";

type MarketplaceTrustProps = {
  city?: string;
};

export function MarketplaceTrust({ city }: Readonly<MarketplaceTrustProps>) {
  return (
    <section aria-labelledby="marketplace-trust-title">
      <Card className="space-y-3 bg-surface-muted">
        <div className="space-y-1">
          <h2 id="marketplace-trust-title" className="text-lg font-semibold tracking-tight">
            Hoe VakConnect zoekt
          </h2>
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">
            We kijken naar de gekozen dienst en het werkgebied van actieve vakmannen
            {city ? ` in of rond ${city}` : ""}. Een passende match is geen garantie
            op beschikbaarheid of een opdracht.
          </p>
        </div>
        <ul className="grid gap-2 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
          <li>Je aanvraag bevat de dienst en locatie van de klus.</li>
          <li>Een vakman beoordeelt zelf of de aanvraag bij zijn werk past.</li>
          <li>Een aanvraag kan aan passende vakmannen worden aangeboden.</li>
          <li>Jij kiest zelf of je met een vakman verdergaat.</li>
        </ul>
      </Card>
    </section>
  );
}
