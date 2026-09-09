import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SetupRequired } from "@/components/setup-required";
import { buildMetadata } from "@/lib/config/site";
import { isSupabaseConfigured } from "@/lib/env";
import { requireAdminUser } from "@/lib/auth/helpers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/admin",
  },
});

const navigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/vakmannen", label: "Vakmannen" },
  { href: "/admin/diensten", label: "Diensten" },
  { href: "/admin/seo", label: "SEO overzicht" },
  { href: "/admin/seo/locaties", label: "SEO locaties" },
  { href: "/admin/seo/lokaal", label: "SEO lokale pagina's" },
];

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured()) {
    return (
      <DashboardShell title="Admin dashboard" subtitle="Supabase configuratie vereist" navigation={navigation}>
        <SetupRequired
          title="Supabase configuratie ontbreekt"
          description="Stel eerst de omgeving in voordat het admin-dashboard met echte authenticatie en data gebruikt kan worden."
        />
      </DashboardShell>
    );
  }

  await requireAdminUser();

  return (
    <DashboardShell
      title="Admin dashboard"
      subtitle="Beheer leads, vakmannen, diensten, handmatige matching en lokale SEO"
      navigation={navigation}
    >
      {children}
    </DashboardShell>
  );
}
