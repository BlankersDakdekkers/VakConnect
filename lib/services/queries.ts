import "server-only";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Service, ServiceQuestion, ServiceQuestionOption } from "@/types/database";
import type { ServiceQuestionDefinition } from "@/lib/validation/dynamic";

const baseSelection = "id, name, slug, category, description, active, created_at, updated_at";
const questionSelection = `
  id,
  service_id,
  question,
  slug,
  type,
  help_text,
  required,
  active,
  sort_order,
  created_at,
  updated_at,
  service_question_options(
    id,
    question_id,
    label,
    value,
    sort_order,
    active,
    created_at
  )
`;

export interface ServiceWithQuestions extends Service {
  questions: ServiceQuestionDefinition[];
}

export type AdminServiceDetail = ServiceWithQuestions;

function mapQuestionDefinitions(
  questions: Array<(ServiceQuestion & { service_question_options?: ServiceQuestionOption[] | null }) | Record<string, unknown>>,
  activeOnly: boolean,
) {
  return questions
    .map((item) => ({
      id: String(item.id),
      service_id: String(item.service_id),
      question: String(item.question),
      slug: String(item.slug),
      type: item.type as ServiceQuestion["type"],
      help_text: (item.help_text as string | null) ?? null,
      required: Boolean(item.required),
      active: Boolean(item.active),
      sort_order: Number(item.sort_order),
      created_at: String(item.created_at),
      updated_at: String(item.updated_at),
      options: (((item.service_question_options ?? []) as ServiceQuestionOption[]) ?? [])
        .filter((option) => (activeOnly ? option.active : true))
        .sort((left, right) => left.sort_order - right.sort_order || left.label.localeCompare(right.label)),
    }))
    .filter((question) => (activeOnly ? question.active : true))
    .sort((left, right) => left.sort_order - right.sort_order || left.question.localeCompare(right.question));
}

export async function getActiveServices() {
  if (!isSupabaseConfigured()) {
    return [] as Service[];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("services").select(baseSelection).eq("active", true).order("name");

  if (error) {
    return [] as Service[];
  }

  return (data ?? []) as Service[];
}

export async function getAdminServices() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("services").select(baseSelection).order("category").order("name");

  if (error) {
    throw new Error("Diensten konden niet worden geladen.");
  }

  return (data ?? []) as Service[];
}

export async function getActiveServicesWithQuestions() {
  if (!isSupabaseConfigured()) {
    return [] as ServiceWithQuestions[];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select(`${baseSelection}, service_questions(${questionSelection})`)
    .eq("active", true)
    .order("name");

  if (error) {
    return [] as ServiceWithQuestions[];
  }

  return ((data ?? []) as Array<Record<string, unknown>>).map((service) => ({
    id: String(service.id),
    name: String(service.name),
    slug: String(service.slug),
    category: String(service.category),
    description: (service.description as string | null) ?? null,
    active: Boolean(service.active),
    created_at: String(service.created_at),
    updated_at: String(service.updated_at),
    questions: mapQuestionDefinitions((service.service_questions ?? []) as Array<Record<string, unknown>>, true),
  }));
}

export async function getActiveServiceQuestionDefinitions(serviceId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("service_questions")
    .select(`${questionSelection}`)
    .eq("service_id", serviceId)
    .eq("active", true);

  if (error) {
    throw new Error("Dienstvragen konden niet worden geladen.");
  }

  return mapQuestionDefinitions((data ?? []) as Array<Record<string, unknown>>, true);
}

export async function getAdminServiceDetail(id: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select(`${baseSelection}, service_questions(${questionSelection})`)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Dienst kon niet worden geladen.");
  }

  if (!data) {
    return null;
  }

  return {
    id: String(data.id),
    name: String(data.name),
    slug: String(data.slug),
    category: String(data.category),
    description: (data.description as string | null) ?? null,
    active: Boolean(data.active),
    created_at: String(data.created_at),
    updated_at: String(data.updated_at),
    questions: mapQuestionDefinitions((data.service_questions ?? []) as Array<Record<string, unknown>>, false),
  } as AdminServiceDetail;
}
