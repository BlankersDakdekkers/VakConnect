import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-slate-950 text-slate-200">
      <div className="container-shell grid gap-8 py-12 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold">VakConnect</p>
          <p className="max-w-sm text-sm text-slate-400">
            Vind de juiste vakman voor jouw klus via een duidelijke intake en gerichte lokale matching.
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-400">
          <p className="font-medium text-slate-100">Consumenten</p>
          <div className="flex flex-col gap-2">
            <Link href="/diensten">Diensten</Link>
            <Link href="/regios">Regio's</Link>
            <Link href="/hoe-werkt-het">Hoe het werkt</Link>
            <Link href="/aanvraag">Aanvraag starten</Link>
            <Link href="/kosten">Kosten</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-400">
          <p className="font-medium text-slate-100">VakConnect</p>
          <div className="flex flex-col gap-2">
            <Link href="/voor-vakmannen">Voor vakmannen</Link>
            <Link href="/aanmelden-vakman">Aanmelden vakman</Link>
            <Link href="/over-vakconnect">Over VakConnect</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-400">
          <p className="font-medium text-slate-100">Vakgebieden</p>
          <div className="flex flex-col gap-2">
            <Link href="/dakdekker">Dakdekker</Link>
            <Link href="/schilder">Schilder</Link>
            <Link href="/loodgieter">Loodgieter</Link>
            <Link href="/elektricien">Elektricien</Link>
            <Link href="/verbouwing">Verbouwing</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-400">
          <p className="font-medium text-slate-100">Juridisch</p>
          <div className="flex flex-col gap-2">
            <Link href="/privacy">Privacy</Link>
            <Link href="/login">Inloggen</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-shell py-4 text-xs text-slate-500">© {new Date().getFullYear()} VakConnect. Alle rechten voorbehouden.</div>
      </div>
    </footer>
  );
}
