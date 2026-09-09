import Link from "next/link";
import { signOutAction } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export function DashboardShell({
  title,
  subtitle,
  navigation,
  children,
}: Readonly<{
  title: string;
  subtitle: string;
  navigation: Array<{ href: string; label: string }>;
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-surface">
        <div className="container-shell flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">VakConnect</p>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <form action={signOutAction}>
            <SubmitButton variant="secondary" pendingLabel="Uitloggen...">
              Uitloggen
            </SubmitButton>
          </form>
        </div>
      </header>
      <div className="container-shell grid gap-8 py-8 lg:grid-cols-[16rem_1fr]">
        <aside className="rounded-3xl border bg-surface p-4 shadow-sm">
          <nav className="flex flex-col gap-2 text-sm">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl px-4 py-3 transition hover:bg-surface-muted">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
