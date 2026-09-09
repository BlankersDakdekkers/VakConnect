import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";
import { buildMetadata } from "@/lib/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Inloggen",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/login",
  },
});

export default async function LoginPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-primary">VakConnect</p>
          <h1 className="text-3xl font-semibold tracking-tight">Inloggen</h1>
          <p className="text-sm text-muted-foreground">
            Voor beheerders en vakmannen. Toegang wordt server-side gecontroleerd.
          </p>
        </div>
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p> : null}
        <LoginForm next={next} />
      </Card>
    </div>
  );
}
