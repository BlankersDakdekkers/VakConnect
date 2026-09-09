import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Professional, Service } from "@/types/database";

export interface ProfessionalListItem extends Professional {
  serviceNames: string[];
  postalCodePrefixes: string[];
}

export interface ProfessionalDetail extends ProfessionalListItem {
  services: Service[];
}

function firstOf<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

const baseSelection = `
  id,
  auth_user_id,
  company_name,
  contact_name,
  email,
  phone,
  kvk_number,
  website,
  status,
  created_at,
  updated_at,
  professional_services(
    active,
    service:services(id, name, slug, category, description, active, created_at, updated_at)
  ),
  professional_service_areas(postal_code_prefix)
`;

export async function getAdminProfessionals() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("professionals").select(baseSelection).order("created_at", { ascending: false });

  if (error) {
    throw new Error("Vakmannen konden niet worden geladen.");
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((item) => {
    const serviceLinks = (item.professional_services ?? []) as Array<Record<string, unknown>>;
    const areas = (item.professional_service_areas ?? []) as Array<{ postal_code_prefix: string }>;

    return {
      id: String(item.id),
      auth_user_id: (item.auth_user_id as string | null) ?? null,
      company_name: String(item.company_name),
      contact_name: String(item.contact_name),
      email: String(item.email),
      phone: String(item.phone),
      kvk_number: (item.kvk_number as string | null) ?? null,
      website: (item.website as string | null) ?? null,
      status: item.status as Professional["status"],
      created_at: String(item.created_at),
      updated_at: String(item.updated_at),
      serviceNames: serviceLinks.flatMap((serviceLink) => {
        const service = firstOf(serviceLink.service as Service | Service[]);
        return service && serviceLink.active ? [service.name] : [];
      }),
      postalCodePrefixes: areas.map((area) => area.postal_code_prefix),
    } as ProfessionalListItem;
  });
}

export async function getAdminProfessionalDetail(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("professionals").select(baseSelection).eq("id", id).maybeSingle();

  if (error) {
    throw new Error("Vakman kon niet worden geladen.");
  }

  if (!data) {
    return null;
  }

  const serviceLinks = (data.professional_services ?? []) as Array<Record<string, unknown>>;
  const areas = (data.professional_service_areas ?? []) as Array<{ postal_code_prefix: string }>;
  const services = serviceLinks.flatMap((serviceLink) => {
    const service = firstOf(serviceLink.service as Service | Service[]);
    return service && serviceLink.active ? [service] : [];
  });

  return {
    id: String(data.id),
    auth_user_id: (data.auth_user_id as string | null) ?? null,
    company_name: String(data.company_name),
    contact_name: String(data.contact_name),
    email: String(data.email),
    phone: String(data.phone),
    kvk_number: (data.kvk_number as string | null) ?? null,
    website: (data.website as string | null) ?? null,
    status: data.status as Professional["status"],
    created_at: String(data.created_at),
    updated_at: String(data.updated_at),
    serviceNames: services.map((service) => service.name),
    postalCodePrefixes: areas.map((area) => area.postal_code_prefix),
    services,
  } as ProfessionalDetail;
}

export async function getActiveAssignableProfessionals(serviceId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("professionals")
    .select(
      "id, company_name, contact_name, email, phone, status, professional_services!inner(service_id, active), professional_service_areas(postal_code_prefix)",
    )
    .eq("status", "active")
    .eq("professional_services.service_id", serviceId)
    .eq("professional_services.active", true)
    .order("company_name");

  if (error) {
    throw new Error("Vakmannen konden niet worden opgehaald.");
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((item) => ({
    id: String(item.id),
    company_name: String(item.company_name),
    contact_name: String(item.contact_name),
    email: String(item.email),
    phone: String(item.phone),
    status: String(item.status),
    professional_service_areas: (item.professional_service_areas ?? []) as Array<{ postal_code_prefix: string }>,
  }));
}
