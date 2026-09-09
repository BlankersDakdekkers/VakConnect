import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

const navigation = [
  { href: "/hoe-werkt-het", label: "Hoe het werkt" },
  { href: "/diensten", label: "Diensten" },
  { href: "/regios", label: "Regio's" },
  { href: "/kosten", label: "Kosten" },
  { href: "/voor-vakmannen", label: "Voor vakmannen" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/95 backdrop-blur">
      <div className="container-shell flex min-h-18 items-center justify-between gap-3 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          VakConnect
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden text-sm font-medium text-foreground sm:inline">
            Inloggen
          </Link>
          <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "sm" })}>
            Vind een vakman
          </Link>
        </div>
      </div>
      <nav className="container-shell flex gap-2 overflow-x-auto pb-3 text-sm md:hidden">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full border border-border bg-surface-muted px-3 py-1.5 text-muted-foreground transition hover:text-foreground">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
