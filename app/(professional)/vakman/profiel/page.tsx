import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { requireProfessionalUser } from "@/lib/auth/helpers";
import { getOwnProfessionalDetail } from "@/lib/professionals/queries";
import { formatDate } from "@/lib/utils";

export default async function ProfessionalProfilePage() {
  const user = await requireProfessionalUser();
  const professional = await getOwnProfessionalDetail(user.professional.id);
  if (!professional) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Profiel" description="Alle onboarding- en verificatiesecties voor je vakmanprofiel." />
      <Card className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <StatusBadge value={professional.status} />
          <StatusBadge value={professional.onboarding_status} />
          <StatusBadge value={professional.verification_status} />
          <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Kwaliteit {professional.quality_score}/100 ({professional.qualityLabel})</p>
          <p className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium">Aangemaakt {formatDate(professional.created_at)}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
          <div className="rounded-2xl bg-surface-muted p-4"><p className="font-medium">Bedrijf</p><p>{professional.company_name}</p><p className="text-muted-foreground">{professional.kvk_number ?? "Geen KvK"}</p></div>
          <div className="rounded-2xl bg-surface-muted p-4"><p className="font-medium">Contact</p><p>{professional.contact_name}</p><p className="text-muted-foreground">{professional.phone}</p></div>
          <div className="rounded-2xl bg-surface-muted p-4"><p className="font-medium">Diensten</p><p>{professional.serviceNames.join(", ") || "Geen"}</p></div>
          <div className="rounded-2xl bg-surface-muted p-4"><p className="font-medium">Werkgebieden</p><p>{professional.postalCodePrefixes.join(", ") || "Geen"}</p></div>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Profielsecties</h2>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <Link href="/vakman/onboarding?step=company" className="rounded-2xl border px-4 py-3">Bedrijf</Link>
            <Link href="/vakman/onboarding?step=contact" className="rounded-2xl border px-4 py-3">Contact</Link>
            <Link href="/vakman/onboarding?step=services" className="rounded-2xl border px-4 py-3">Diensten</Link>
            <Link href="/vakman/onboarding?step=areas" className="rounded-2xl border px-4 py-3">Werkgebieden</Link>
            <Link href="/vakman/onboarding?step=experience" className="rounded-2xl border px-4 py-3">Ervaring</Link>
            <Link href="/vakman/onboarding?step=capacity" className="rounded-2xl border px-4 py-3">Capaciteit</Link>
            <Link href="/vakman/onboarding?step=documents" className="rounded-2xl border px-4 py-3">Documenten</Link>
            <Link href="/vakman/onboarding?step=review" className="rounded-2xl border px-4 py-3">Verificatie</Link>
          </div>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Reviewfeedback</h2>
          <div className="space-y-3 text-sm">
            {professional.reviewFeedback.length ? professional.reviewFeedback.map((feedback) => (
              <div key={feedback.id} className="rounded-2xl border px-4 py-3">
                <div className="flex items-center gap-2"><StatusBadge value={feedback.status} /><span className="font-medium">{feedback.section}</span></div>
                <p className="mt-2">{feedback.message}</p>
              </div>
            )) : <p className="text-muted-foreground">Nog geen feedback.</p>}
          </div>
        </Card>
      </div>
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Capaciteit & verificatie</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
          <div><p className="text-muted-foreground">Beschikbaarheid</p><StatusBadge value={professional.distributionSettings?.availability_status ?? "available"} /></div>
          <div><p className="text-muted-foreground">Max open offers</p><p>{professional.distributionSettings?.max_open_offers ?? 0}</p></div>
          <div><p className="text-muted-foreground">Max actieve opdrachten</p><p>{professional.distributionSettings?.max_active_assignments ?? 0}</p></div>
          <div><p className="text-muted-foreground">Documenten</p><p>{professional.documents.length}</p></div>
        </div>
      </Card>
    </div>
  );
}
