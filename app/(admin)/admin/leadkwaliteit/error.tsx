"use client";

import Link from "next/link";

export default function LeadQualityError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="rounded-3xl border bg-surface p-5" role="alert">
      <h2 className="text-xl font-semibold">Het kwaliteitsrapport kon niet worden geladen</h2>
      <p className="mt-2 text-sm text-muted-foreground">Er worden geen gedeeltelijke cijfers getoond. Probeer opnieuw of kies een kortere periode. Blijft dit gebeuren? Laat de rapportconfiguratie controleren.</p>
      <div className="mt-4 flex gap-4"><button type="button" className="rounded-xl bg-primary px-4 py-2 text-white" onClick={() => retry()}>Opnieuw proberen</button><Link className="self-center text-sm underline" href="/admin/leadkwaliteit?days=7">Laatste 7 dagen</Link></div>
    </section>
  );
}
