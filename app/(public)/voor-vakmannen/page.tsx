import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { buttonClassName } from "@/components/ui/button";

const features = [
  "Inloggen met Supabase Auth",
  "Alleen eigen toegewezen leads bekijken",
  "Aanvragen accepteren of weigeren via server-side geautoriseerde acties",
  "Profiel, diensten en werkgebieden beheren via admin-flow",
];

export default function ForProfessionalsPage() {
  return (
    <div className="container-shell space-y-10 py-14">
      <PageHeader
        eyebrow="Voor vakmannen"
        title="Professionele onboardingbasis voor lokale vakmensen"
        description="VakConnect bouwt eerst een veilige MVP waarin toewijzingen, profielbeheer en leadinzage goed zijn afgeschermd."
      />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Wat deze fase al ondersteunt</h2>
          <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
            {features.map((feature) => (
              <li key={feature} className="rounded-2xl bg-surface-muted px-4 py-3 text-foreground">
                {feature}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Interesse om mee te doen?</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            In deze MVP worden vakmannen handmatig toegevoegd door een beheerder. Zodra je account actief is, kun je inloggen en alleen jouw toegewezen leads bekijken.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/aanvraag" className={buttonClassName({ variant: "secondary" })}>
              Bekijk consumentflow
            </Link>
            <Link href="/login" className={buttonClassName({ variant: "primary" })}>
              Inloggen
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
