import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createSignedLeadImageUrls } from "@/lib/storage/leads";
import type { LeadStatus, Professional, Service } from "@/types/database";

export interface DashboardStat {
  label: string;
  value: number;
  description: string;
}

export interface AdminLeadListItem {
  id: string;
  public_reference: string;
  status: LeadStatus;
  urgency: string;
  postal_code: string;
  city: string | null;
  created_at: string;
  first_name: string;
  last_name: string;
  service: Pick<Service, "name" | "slug"> | null;
}

export interface LeadImageView {
  path: string;
  url: string | null;
  mimeType: string | null;
  fileSize: number | null;
}

export interface AdminLeadDetail {
  id: string;
  public_reference: string;
  status: LeadStatus;
  urgency: string;
  preferred_timing: string | null;
  description: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  postal_code: string;
  house_number: string;
  house_number_addition: string | null;
  city: string | null;
  created_at: string;
  service: Service | null;
  images: LeadImageView[];
  assignments: Array<{
    id: string;
    status: string;
    assigned_at: string;
    viewed_at: string | null;
    accepted_at: string | null;
    rejected_at: string | null;
    professional: Pick<Professional, "id" | "company_name" | "contact_name" | "status"> | null;
  }>;
}

export interface ProfessionalAssignmentListItem {
  id: string;
  status: string;
  assigned_at: string;
  viewed_at: string | null;
  lead: {
    id: string;
    public_reference: string;
    postal_code: string;
    city: string | null;
    urgency: string;
    created_at: string;
    service: Pick<Service, "name" | "slug"> | null;
  };
}

export interface ProfessionalLeadDetail {
  assignmentId: string;
  assignmentStatus: string;
  assignedAt: string;
  viewedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  lead: AdminLeadDetail;
}

function firstOf<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

export async function getAdminDashboardStats() {
  const supabase = createAdminSupabaseClient();
  const [{ count: newLeads }, { count: activeProfessionals }, { count: assignedLeads }] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("professionals").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "assigned"),
  ]);

  return [
    { label: "Nieuwe leads", value: newLeads ?? 0, description: "Aanvragen die nog beoordeling nodig hebben." },
    { label: "Actieve vakmannen", value: activeProfessionals ?? 0, description: "Beschikbaar voor handmatige matching." },
    { label: "Toegewezen leads", value: assignedLeads ?? 0, description: "Leads die op dit moment bij een vakman liggen." },
  ] as DashboardStat[];
}

export async function getAdminLeads(search?: string, status?: string) {
  const supabase = createAdminSupabaseClient();
  let query = supabase
    .from("leads")
    .select("id, public_reference, status, urgency, postal_code, city, created_at, first_name, last_name, service:services(name, slug)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `public_reference.ilike.%${search}%,email.ilike.%${search}%,postal_code.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Leads konden niet worden geladen.");
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((item) => ({
    id: String(item.id),
    public_reference: String(item.public_reference),
    status: item.status as LeadStatus,
    urgency: String(item.urgency),
    postal_code: String(item.postal_code),
    city: (item.city as string | null) ?? null,
    created_at: String(item.created_at),
    first_name: String(item.first_name),
    last_name: String(item.last_name),
    service: (firstOf(item.service as Pick<Service, "name" | "slug"> | Pick<Service, "name" | "slug">[]) ?? null) as
      | Pick<Service, "name" | "slug">
      | null,
  }));
}

export async function getAdminLeadDetail(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      `
        id,
        public_reference,
        status,
        urgency,
        preferred_timing,
        description,
        first_name,
        last_name,
        email,
        phone,
        postal_code,
        house_number,
        house_number_addition,
        city,
        created_at,
        service:services(id, name, slug, category, description, active, created_at, updated_at),
        lead_images(id, storage_path, mime_type, file_size, created_at),
        lead_assignments(
          id,
          status,
          assigned_at,
          viewed_at,
          accepted_at,
          rejected_at,
          professional:professionals(id, company_name, contact_name, status)
        )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Lead kon niet worden geladen.");
  }

  if (!data) {
    return null;
  }

  const images = (data.lead_images ?? []) as Array<{ storage_path: string; mime_type: string | null; file_size: number | null }>;
  const assignments = (data.lead_assignments ?? []) as Array<Record<string, unknown>>;
  const signedImages = await createSignedLeadImageUrls(images.map((image) => image.storage_path));

  return {
    id: String(data.id),
    public_reference: String(data.public_reference),
    status: data.status as LeadStatus,
    urgency: String(data.urgency),
    preferred_timing: (data.preferred_timing as string | null) ?? null,
    description: String(data.description),
    first_name: String(data.first_name),
    last_name: String(data.last_name),
    email: String(data.email),
    phone: String(data.phone),
    postal_code: String(data.postal_code),
    house_number: String(data.house_number),
    house_number_addition: (data.house_number_addition as string | null) ?? null,
    city: (data.city as string | null) ?? null,
    created_at: String(data.created_at),
    service: (firstOf(data.service as Service | Service[]) ?? null) as Service | null,
    images: images.map((image) => ({
      path: image.storage_path,
      url: signedImages.find((signedImage) => signedImage.path === image.storage_path)?.url ?? null,
      mimeType: image.mime_type,
      fileSize: image.file_size,
    })),
    assignments: assignments.map((assignment) => ({
      id: String(assignment.id),
      status: String(assignment.status),
      assigned_at: String(assignment.assigned_at),
      viewed_at: (assignment.viewed_at as string | null) ?? null,
      accepted_at: (assignment.accepted_at as string | null) ?? null,
      rejected_at: (assignment.rejected_at as string | null) ?? null,
      professional: (firstOf(
        assignment.professional as Pick<Professional, "id" | "company_name" | "contact_name" | "status"> | Array<Pick<Professional, "id" | "company_name" | "contact_name" | "status">>,
      ) ?? null) as Pick<Professional, "id" | "company_name" | "contact_name" | "status"> | null,
    })),
  } as AdminLeadDetail;
}

export async function getProfessionalDashboardStats(professionalId: string) {
  const supabase = await createServerSupabaseClient();
  const [{ count: pending }, { count: accepted }, { count: rejected }] = await Promise.all([
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).in("status", ["pending", "viewed"]),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("status", "accepted"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("status", "rejected"),
  ]);

  return [
    { label: "Nieuwe toewijzingen", value: pending ?? 0, description: "Nog te beoordelen aanvragen." },
    { label: "Geaccepteerd", value: accepted ?? 0, description: "Aanvragen die je hebt geaccepteerd." },
    { label: "Afgewezen", value: rejected ?? 0, description: "Aanvragen die je hebt geweigerd." },
  ] as DashboardStat[];
}

export async function getProfessionalAssignments(professionalId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lead_assignments")
    .select(
      "id, status, assigned_at, viewed_at, lead:leads(id, public_reference, postal_code, city, urgency, created_at, service:services(name, slug))",
    )
    .eq("professional_id", professionalId)
    .order("assigned_at", { ascending: false });

  if (error) {
    throw new Error("Toegewezen leads konden niet worden geladen.");
  }

  return ((data ?? []) as Array<Record<string, unknown>>).flatMap((assignment) => {
    const lead = firstOf(assignment.lead as Record<string, unknown> | Array<Record<string, unknown>>);
    if (!lead) {
      return [];
    }

    return [{
      id: String(assignment.id),
      status: String(assignment.status),
      assigned_at: String(assignment.assigned_at),
      viewed_at: (assignment.viewed_at as string | null) ?? null,
      lead: {
        id: String(lead.id),
        public_reference: String(lead.public_reference),
        postal_code: String(lead.postal_code),
        city: (lead.city as string | null) ?? null,
        urgency: String(lead.urgency),
        created_at: String(lead.created_at),
        service: (firstOf(lead.service as Pick<Service, "name" | "slug"> | Array<Pick<Service, "name" | "slug">>) ?? null) as
          | Pick<Service, "name" | "slug">
          | null,
      },
    } satisfies ProfessionalAssignmentListItem];
  });
}

export async function getProfessionalLeadDetail(leadId: string, professionalId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lead_assignments")
    .select(
      `
        id,
        status,
        assigned_at,
        viewed_at,
        accepted_at,
        rejected_at,
        lead:leads(
          id,
          public_reference,
          status,
          urgency,
          preferred_timing,
          description,
          first_name,
          last_name,
          email,
          phone,
          postal_code,
          house_number,
          house_number_addition,
          city,
          created_at,
          service:services(id, name, slug, category, description, active, created_at, updated_at),
          lead_images(id, storage_path, mime_type, file_size, created_at)
        )
      `,
    )
    .eq("professional_id", professionalId)
    .eq("lead_id", leadId)
    .maybeSingle();

  if (error) {
    throw new Error("Lead kon niet worden geladen.");
  }

  const lead = firstOf(data?.lead as Record<string, unknown> | Array<Record<string, unknown>> | null | undefined);
  if (!data || !lead) {
    return null;
  }

  if (!data.viewed_at && data.status === "pending") {
    await supabase
      .from("lead_assignments")
      .update({ viewed_at: new Date().toISOString(), status: "viewed" })
      .eq("id", data.id)
      .eq("professional_id", professionalId);
  }

  const images = (lead.lead_images ?? []) as Array<{ storage_path: string; mime_type: string | null; file_size: number | null }>;
  const signedImages = await createSignedLeadImageUrls(images.map((image) => image.storage_path));

  return {
    assignmentId: String(data.id),
    assignmentStatus: String(data.status),
    assignedAt: String(data.assigned_at),
    viewedAt: (data.viewed_at as string | null) ?? null,
    acceptedAt: (data.accepted_at as string | null) ?? null,
    rejectedAt: (data.rejected_at as string | null) ?? null,
    lead: {
      id: String(lead.id),
      public_reference: String(lead.public_reference),
      status: lead.status as LeadStatus,
      urgency: String(lead.urgency),
      preferred_timing: (lead.preferred_timing as string | null) ?? null,
      description: String(lead.description),
      first_name: String(lead.first_name),
      last_name: String(lead.last_name),
      email: String(lead.email),
      phone: String(lead.phone),
      postal_code: String(lead.postal_code),
      house_number: String(lead.house_number),
      house_number_addition: (lead.house_number_addition as string | null) ?? null,
      city: (lead.city as string | null) ?? null,
      created_at: String(lead.created_at),
      service: (firstOf(lead.service as Service | Service[]) ?? null) as Service | null,
      images: images.map((image) => ({
        path: image.storage_path,
        url: signedImages.find((signedImage) => signedImage.path === image.storage_path)?.url ?? null,
        mimeType: image.mime_type,
        fileSize: image.file_size,
      })),
      assignments: [],
    },
  } as ProfessionalLeadDetail;
}
