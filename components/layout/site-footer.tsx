import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-slate-950 text-slate-200">
      <div className="container-shell grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold">VakConnect</p>
          <p className="max-w-md text-sm text-slate-400">
            Een schaalbare MVP-basis voor het veilig koppelen van consumenten aan lokale vakmensen.
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-400">
          <p className="font-medium text-slate-100">Navigatie</p>
          <div className="flex flex-col gap-2">
            <Link href="/">Home</Link>
            <Link href="/aanvraag">Aanvraag starten</Link>
            <Link href="/voor-vakmannen">Voor vakmannen</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-400">
          <p className="font-medium text-slate-100">Beheer</p>
          <div className="flex flex-col gap-2">
            <Link href="/login">Inloggen</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/vakman">Vakman-dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
