import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceContentPage } from "@/components/public/service-content-page";
import { getSeoLocalPageById } from "@/lib/seo/local-pages/queries";

export default async function AdminSeoLocalPagePreview({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const page = await getSeoLocalPageById(id);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-4 py-6">
      <div className="container-shell">
        <Link href={`/admin/seo/lokaal/${page.id}`} className="text-sm text-primary hover:underline">
          ← Terug naar editor
        </Link>
      </div>
      <ServiceContentPage page={page.page} />
    </div>
  );
}
