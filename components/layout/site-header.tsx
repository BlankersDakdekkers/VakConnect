import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-border/80 bg-surface/90 backdrop-blur">
      <div className="container-shell flex min-h-18 items-center justify-between gap-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          VakConnect
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#hoe-het-werkt">Hoe het werkt</Link>
          <Link href="/#diensten">Diensten</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/voor-vakmannen">Voor vakmannen</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-foreground">
            Inloggen
          </Link>
          <Link href="/aanvraag" className={buttonClassName({ variant: "primary", size: "sm" })}>
            Vind een vakman
          </Link>
        </div>
      </div>
    </header>
  );
}
