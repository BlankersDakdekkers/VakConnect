import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

const navigation = [
  { href: "/diensten", label: "Diensten" },
  { href: "/hoe-werkt-het", label: "Hoe het werkt" },
  { href: "/voor-vakmannen", label: "Voor vakmannen" },
  { href: "/kosten", label: "Kosten" },
  { href: "/over-vakconnect", label: "Over VakConnect" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/95 backdrop-blur">
      <div className="container-shell flex min-h-16 items-center justify-between gap-3 py-2">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          VakConnect
        </Link>
        <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-4 text-sm text-muted-foreground lg:flex xl:gap-5">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/aanmelden-vakman" className="hidden text-sm font-medium text-foreground sm:inline">
            Aanmelden als vakman
          </Link>
          <Link href="/login" className="hidden text-sm font-medium text-foreground xl:inline">
            Inloggen
          </Link>
          <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "sm" })}>
            Plaats je klus
          </Link>
          <details className="relative lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full border border-border bg-surface px-4 text-sm font-medium marker:hidden transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <nav
              aria-label="Mobiele navigatie"
              className="absolute right-0 top-[calc(100%+0.75rem)] z-50 grid min-w-64 gap-1 rounded-2xl border bg-surface p-2 text-sm shadow-lg"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center rounded-xl px-3 text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/aanmelden-vakman" className="flex min-h-11 items-center rounded-xl px-3 text-foreground transition hover:bg-surface-muted">
                Aanmelden als vakman
              </Link>
              <Link href="/login" className="flex min-h-11 items-center rounded-xl px-3 text-foreground transition hover:bg-surface-muted">
                Inloggen
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
