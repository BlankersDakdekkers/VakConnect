import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SetupRequired } from "@/components/setup-required";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { buildMetadata } from "@/lib/config/site";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Vakman dashboard",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/vakman",
  },
});

const navigation = [
  { href: "/vakman", label: "Overzicht" },
  { href: "/vakman/aanvragen", label: "Aanvragen" },
  { href: "/vakman/profiel", label: "Profiel" },
];

export default async function ProfessionalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured()) {
    return (
      <DashboardShell title="Vakman dashboard" subtitle="Supabase configuratie vereist" navigation={navigation}>
        <SetupRequired
          title="Supabase configuratie ontbreekt"
          description="Stel eerst de omgeving in voordat professionals veilig kunnen inloggen en eigen leads kunnen bekijken."
        />
      </DashboardShell>
    );
  }

  const user = await requireProfessionalUser();

  return (
    <DashboardShell
      title={`Welkom ${user.professional.company_name}`}
      subtitle="Bekijk alleen je eigen toegewezen leads"
      navigation={navigation}
    >
      {children}
    </DashboardShell>
  );
}
