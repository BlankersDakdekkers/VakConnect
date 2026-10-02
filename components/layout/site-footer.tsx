import Link from "next/link";
import { TrackedLink } from "@/components/public/tracked-link";
import { getPopularServiceClusters } from "@/lib/content/service-cards";

export function SiteFooter() {
  const serviceLinks = getPopularServiceClusters();

  return (
    <footer className="border-t bg-surface text-foreground">
      <div className="container-shell grid gap-8 py-12 sm:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold">VakConnect</p>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Beschrijf je klus één keer. VakConnect helpt je een passende vakman in jouw regio te vinden.
          </p>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Consument</p>
          <div className="flex flex-col gap-2">
            <Link href="/hoe-werkt-het">Hoe het werkt</Link>
            <TrackedLink href="/aanvraag" ctaId="footer_request" ctaLocation="footer" destinationType="request">Plaats je klus</TrackedLink>
            <Link href="/kosten">Kosten</Link>
            <Link href="/regios">Regio&apos;s</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Vakmannen</p>
          <div className="flex flex-col gap-2">
            <TrackedLink href="/voor-vakmannen" ctaId="footer_professional_landing" ctaLocation="footer" destinationType="professional">Voor vakmannen</TrackedLink>
            <TrackedLink href="/aanmelden-vakman" ctaId="footer_professional_signup" ctaLocation="footer" destinationType="professional">Aanmelden vakman</TrackedLink>
            <Link href="/login">Inloggen</Link>
          </div>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Diensten</p>
          <div className="flex flex-col gap-2">
            {serviceLinks.map((service) => <Link key={service.href} href={service.href}>{service.title}</Link>)}
          </div>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">VakConnect & juridisch</p>
          <div className="flex flex-col gap-2">
            <Link href="/over-vakconnect">Over VakConnect</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container-shell py-5 text-sm text-muted-foreground">© {new Date().getFullYear()} VakConnect. Alle rechten voorbehouden.</div>
      </div>
    </footer>
  );
}
