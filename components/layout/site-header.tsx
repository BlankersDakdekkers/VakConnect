import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { TrackedLink } from "@/components/public/tracked-link";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { publicNavigation } from "@/lib/content/public-navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-surface">
      <div className="container-shell flex min-h-16 items-center justify-between gap-3 py-2">
        <Link href="/" aria-label="VakConnect — home" className="inline-flex min-h-11 shrink-0 items-center text-base font-bold tracking-tight text-foreground sm:text-xl">
          VakConnect
        </Link>
        <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-4 text-sm text-muted-foreground xl:flex">
          {publicNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <TrackedLink href="/aanmelden-vakman" ctaId="header_professional_signup" ctaLocation="header" destinationType="professional" className="hidden min-h-11 items-center text-sm font-medium text-foreground md:inline-flex xl:hidden">
            Aanmelden als vakman
          </TrackedLink>
          <Link href="/login" className="hidden min-h-11 items-center text-sm font-medium text-foreground xl:inline-flex">
            Inloggen
          </Link>
          <TrackedLink href="/aanvraag" ctaId="header_request" ctaLocation="header" destinationType="request" className={buttonClassName({ variant: "primary", size: "sm", className: "px-3 sm:px-4" })}>
            Plaats je klus
          </TrackedLink>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
