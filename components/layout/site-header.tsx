import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { TrackedLink } from "@/components/public/tracked-link";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { publicNavigation } from "@/lib/content/public-navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/95 backdrop-blur">
      <div className="container-shell flex min-h-16 items-center justify-between gap-3 py-2">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          VakConnect
        </Link>
        <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-4 text-sm text-muted-foreground lg:flex xl:gap-5">
          {publicNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <TrackedLink href="/aanmelden-vakman" ctaId="header_professional_signup" ctaLocation="header" destinationType="professional" className="hidden text-sm font-medium text-foreground sm:inline">
            Aanmelden als vakman
          </TrackedLink>
          <Link href="/login" className="hidden text-sm font-medium text-foreground xl:inline">
            Inloggen
          </Link>
          <TrackedLink href="/aanvraag" ctaId="header_request" ctaLocation="header" destinationType="request" className={buttonClassName({ variant: "primary", size: "sm" })}>
            Plaats je klus
          </TrackedLink>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
