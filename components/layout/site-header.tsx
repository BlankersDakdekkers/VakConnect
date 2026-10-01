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
      <div className="container-shell flex min-h-18 items-center justify-between gap-3 py-3 sm:py-4">
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
        </div>
      </div>
      <nav aria-label="Mobiele navigatie" className="container-shell flex gap-2 overflow-x-auto pb-3 text-sm lg:hidden">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full border border-border bg-surface-muted px-3 py-1.5 text-muted-foreground transition hover:text-foreground">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
