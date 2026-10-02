import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceContentPage } from "@/components/public/service-content-page";
import { getSeoLocalPageById } from "@/lib/seo/local-pages/queries";
import { localContentDepth } from "@/lib/content/local-content-depth";

export default async function AdminSeoLocalPagePreview({ params, searchParams }: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const page = await getSeoLocalPageById(id);

  if (!page) {
    notFound();
  }
  const proposal = query.voorstel === "prompt17" ? localContentDepth[page.canonicalPath] : undefined;

  return (
    <div className="space-y-4 py-6">
      <div className="container-shell">
        <Link href={`/admin/seo/lokaal/${page.id}${proposal ? "?voorstel=prompt17" : ""}`} className="text-sm text-primary hover:underline">
          ← Terug naar editor
        </Link>
      </div>
      <ServiceContentPage page={proposal ? { ...page.page, ...proposal } : page.page} />
    </div>
  );
}
