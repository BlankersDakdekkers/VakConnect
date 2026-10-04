import type { ProfessionalQualityResult } from "@/lib/professionals/onboarding";

const sectionLabels: Record<keyof ProfessionalQualityResult["breakdown"], string> = {
  company: "Bedrijfsgegevens",
  contact: "Contact",
  services: "Diensten",
  areas: "Werkgebieden",
  experience: "Profielomschrijving en ervaring",
  capacity: "Beschikbaarheid en capaciteit",
  documents: "Documenten",
  verification: "Verificatie",
};

const stepForSection: Partial<Record<keyof ProfessionalQualityResult["breakdown"], string>> = {
  company: "company",
  contact: "contact",
  services: "services",
  areas: "areas",
  experience: "experience",
  capacity: "capacity",
  documents: "documents",
};

export function ProfessionalQualitySummary({
  score,
  label,
  breakdown,
  missingSteps,
}: Readonly<{
  score: number;
  label: string;
  breakdown: ProfessionalQualityResult["breakdown"];
  missingSteps: string[];
}>) {
  return (
    <section aria-labelledby="profile-quality-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="profile-quality-heading" className="text-lg font-semibold tracking-tight">Profielkwaliteit</h2>
          <p className="text-sm text-muted-foreground">Gebaseerd op de bestaande profielberekening; geen garantie op een opdracht.</p>
        </div>
        <p className="text-2xl font-semibold">{score}% <span className="text-sm font-normal text-muted-foreground">· {label}</span></p>
      </div>
      <div role="progressbar" aria-label="Profielkwaliteit" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(Object.entries(breakdown) as Array<[keyof ProfessionalQualityResult["breakdown"], ProfessionalQualityResult["breakdown"][keyof ProfessionalQualityResult["breakdown"]]]>).map(([key, item]) => {
          const step = stepForSection[key];
          const blocking = step ? missingSteps.includes(step) : false;
          const status = key === "verification"
            ? "Beoordelingsstatus"
            : key === "documents" && !blocking && !item.complete
              ? "Nog niet goedgekeurd"
              : blocking
                ? "Nodig voor indienen"
                : item.complete
                  ? "Compleet"
                  : "Aanbevolen";
          const statusStyle = blocking || (key === "documents" && !item.complete)
            ? "text-amber-800"
            : item.complete
              ? "text-success"
              : "text-muted-foreground";
          return (
            <li key={key} className="min-w-0 rounded-xl border border-border p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="font-medium">{sectionLabels[key]}</h3>
                <span className={`text-xs font-medium ${statusStyle}`}>{status}</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div role="progressbar" aria-label={`${sectionLabels[key]}: ${item.score} van ${item.weight}`} aria-valuemin={0} aria-valuemax={item.weight} aria-valuenow={item.score} className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${item.weight ? (item.score / item.weight) * 100 : 0}%` }} />
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.score}/{item.weight}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{key === "verification" ? "Je actuele beoordelingsstatus staat hierboven; deze status is geen kwaliteitsgarantie." : item.message}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
