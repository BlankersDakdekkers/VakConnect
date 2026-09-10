import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Professional, Service } from "@/types/database";

export interface ProfessionalListItem extends Professional {
  serviceNames: string[];
  postalCodePrefixes: string[];
}

export interface ProfessionalDetail extends ProfessionalListItem {
  serviceLinks: Array<{
    id: string;
    active: boolean;
    service: Service;
  }>;
  areaLinks: Array<{
    id: string;
    postalCodePrefix: string;
  }>;
  stats: {
    assignmentsTotal: number;
    assignmentsAccepted: number;
    assignmentsWon: number;
    assignmentsLost: number;
    offersReceived: number;
    offersViewed: number;
    offersDeclined: number;
    offersExpired: number;
    offersPurchased: number;
    averageResponseHours: number;
  };
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
  description,
  status,
  verification_status,
  created_at,
  updated_at,
  professional_services(
    id,
    active,
    service:services(id, name, slug, category, description, active, created_at, updated_at)
  ),
  professional_service_areas(id, postal_code_prefix)
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
      description: (item.description as string | null) ?? null,
      status: item.status as Professional["status"],
      verification_status: item.verification_status as Professional["verification_status"],
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
  const areas = (data.professional_service_areas ?? []) as Array<{ id: string; postal_code_prefix: string }>;

  const [totalAssignments, acceptedAssignments, wonAssignments, lostAssignments, candidateRows] = await Promise.all([
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", id),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", id).eq("status", "accepted"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", id).eq("progress_status", "won"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", id).eq("progress_status", "lost"),
    supabase.from("lead_distribution_candidates").select("status, offered_at, viewed_at, declined_at, purchased_at").eq("professional_id", id),
  ]);

  const offers = (candidateRows.data ?? []) as Array<Record<string, unknown>>;
  const responseHours = offers
    .map((row) => {
      const offeredAt = row.offered_at ? new Date(String(row.offered_at)).getTime() : 0;
      const respondedAt = row.viewed_at || row.declined_at || row.purchased_at;
      if (!offeredAt || !respondedAt) {
        return null;
      }
      const diff = (new Date(String(respondedAt)).getTime() - offeredAt) / (1000 * 60 * 60);
      return diff >= 0 ? diff : null;
    })
    .filter((value): value is number => value !== null);

  const mappedServiceLinks = serviceLinks.flatMap((serviceLink) => {
    const service = firstOf(serviceLink.service as Service | Service[]);
    if (!service) {
      return [];
    }

    return [{
      id: String(serviceLink.id),
      active: Boolean(serviceLink.active),
      service,
    }];
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
    description: (data.description as string | null) ?? null,
    status: data.status as Professional["status"],
    verification_status: data.verification_status as Professional["verification_status"],
    created_at: String(data.created_at),
    updated_at: String(data.updated_at),
    serviceNames: mappedServiceLinks.filter((link) => link.active).map((link) => link.service.name),
    postalCodePrefixes: areas.map((area) => area.postal_code_prefix),
    serviceLinks: mappedServiceLinks.sort((left, right) => left.service.name.localeCompare(right.service.name)),
    areaLinks: areas
      .map((area) => ({ id: String(area.id), postalCodePrefix: area.postal_code_prefix }))
      .sort((left, right) => left.postalCodePrefix.localeCompare(right.postalCodePrefix)),
    stats: {
      assignmentsTotal: totalAssignments.count ?? 0,
      assignmentsAccepted: acceptedAssignments.count ?? 0,
      assignmentsWon: wonAssignments.count ?? 0,
      assignmentsLost: lostAssignments.count ?? 0,
      offersReceived: offers.length,
      offersViewed: offers.filter((row) => row.status === "viewed").length,
      offersDeclined: offers.filter((row) => row.status === "declined").length,
      offersExpired: offers.filter((row) => row.status === "expired").length,
      offersPurchased: offers.filter((row) => row.status === "purchased").length,
      averageResponseHours: responseHours.length ? Number((responseHours.reduce((sum, value) => sum + value, 0) / responseHours.length).toFixed(1)) : 0,
    },
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
