import { PublicAnalytics } from "@/components/analytics/public-analytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="public-site flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only z-50 rounded-sm bg-surface p-4 font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Naar de inhoud
      </a>
      <PublicAnalytics />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
