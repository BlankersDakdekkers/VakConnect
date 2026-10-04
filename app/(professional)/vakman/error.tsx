"use client";

export default function ProfessionalError({
  retry,
}: Readonly<{
  error: Error & { digest?: string };
  retry: () => void;
}>) {
  return (
    <section role="alert" className="rounded-3xl border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold">Deze pagina kon niet worden geladen</h2>
      <p className="mt-2 text-sm text-muted-foreground">Er ging iets mis bij het ophalen van je gegevens. Probeer het opnieuw. Je accountgegevens zijn niet aangepast.</p>
      <button type="button" onClick={() => retry()} className="mt-4 min-h-11 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        Opnieuw proberen
      </button>
    </section>
  );
}
