import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createSignedLeadImageUrls } from "@/lib/storage/leads";
import { addLeadActivity } from "@/lib/leads/activity";
import { calculateAcceptanceRate, calculateWinRate } from "@/lib/leads/kpi";
import type { Json, LeadActivityType, LeadProgressStatus, LeadStatus, Professional, Service, ServiceQuestionOption } from "@/types/database";

export interface DashboardStat {
  label: string;
  value: number;
  description: string;
}

export interface AdminAttributionSummaryRow {
  source: string;
  medium: string;
  count: number;
}

export interface LeadActivityView {
  id: string;
  activityType: LeadActivityType;
  fromStatus: LeadProgressStatus | null;
  toStatus: LeadProgressStatus | null;
  metadata: Json | null;
  createdAt: string;
  professional: Pick<Professional, "id" | "company_name"> | null;
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
  lead_score: number | null;
  service: Pick<Service, "name" | "slug"> | null;
}

export interface LeadImageView {
  path: string;
  url: string | null;
  mimeType: string | null;
  fileSize: number | null;
}

export interface LeadAnswerView {
  id: string;
  question: {
    id: string;
    question: string;
    slug: string;
    type: string;
    required: boolean;
    sortOrder: number;
    helpText: string | null;
  };
  rawValue: string | number | boolean | string[] | null;
  displayValue: string;
  createdAt: string;
}

export interface LeadMatchView {
  id: string;
  professionalId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
  matchScore: number;
  reasons: Json | null;
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
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  referrer: string | null;
  gclid: string | null;
  fbclid: string | null;
  first_touch_source: string | null;
  first_touch_timestamp: string | null;
  created_at: string;
  lead_score: number | null;
  score_reasons: Json | null;
  service: Service | null;
  images: LeadImageView[];
  answers: LeadAnswerView[];
  matches: LeadMatchView[];
  assignments: Array<{
    id: string;
    status: string;
    progress_status: LeadProgressStatus;
    loss_reason: string | null;
    assigned_at: string;
    viewed_at: string | null;
    accepted_at: string | null;
    rejected_at: string | null;
    professional: Pick<Professional, "id" | "company_name" | "contact_name" | "status"> | null;
  }>;
  activity: LeadActivityView[];
}

export interface ProfessionalAssignmentListItem {
  id: string;
  status: string;
  progress_status: LeadProgressStatus;
  assigned_at: string;
  viewed_at: string | null;
  lead: {
    id: string;
    public_reference: string;
    postal_code: string;
    city: string | null;
    urgency: string;
    created_at: string;
    lead_score: number | null;
    service: Pick<Service, "name" | "slug"> | null;
  };
}

export interface ProfessionalLeadDetail {
  assignmentId: string;
  assignmentStatus: string;
  assignmentProgressStatus: LeadProgressStatus;
  assignedAt: string;
  viewedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  lossReason: string | null;
  lead: AdminLeadDetail;
}

function firstOf<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

function getOptionLabel(value: string, options: ServiceQuestionOption[]) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function mapLeadAnswerRows(rows: Array<Record<string, unknown>>) {
  return rows
    .map((row) => {
      const questionRow = firstOf(row.question as Record<string, unknown> | Array<Record<string, unknown>>);
      if (!questionRow) {
        return null;
      }

      const options = ((questionRow.service_question_options ?? []) as ServiceQuestionOption[])
        .filter((option) => option.active)
        .sort((left, right) => left.sort_order - right.sort_order || left.label.localeCompare(right.label));
      const type = String(questionRow.type);
      const answerJson = row.answer_json as Json | null;
      let rawValue: LeadAnswerView["rawValue"] = null;
      let displayValue = "—";

      if (type === "multiselect") {
        const values = Array.isArray(answerJson) ? answerJson.filter((value): value is string => typeof value === "string") : [];
        rawValue = values;
        displayValue = values.length ? values.map((value) => getOptionLabel(value, options)).join(", ") : "—";
      } else if (type === "number") {
        rawValue = typeof row.answer_number === "number" ? row.answer_number : row.answer_number === null ? null : Number(row.answer_number);
        displayValue = rawValue === null ? "—" : String(rawValue);
      } else if (type === "boolean") {
        rawValue = typeof row.answer_boolean === "boolean" ? row.answer_boolean : null;
        displayValue = rawValue === null ? "—" : rawValue ? "Ja" : "Nee";
      } else {
        rawValue = (row.answer_text as string | null) ?? null;
        displayValue = typeof rawValue === "string" && rawValue.length
          ? (type === "select" || type === "radio" ? getOptionLabel(rawValue, options) : rawValue)
          : "—";
      }

      return {
        id: String(row.id),
        question: {
          id: String(questionRow.id),
          question: String(questionRow.question),
          slug: String(questionRow.slug),
          type,
          required: Boolean(questionRow.required),
          sortOrder: Number(questionRow.sort_order),
          helpText: (questionRow.help_text as string | null) ?? null,
        },
        rawValue,
        displayValue,
        createdAt: String(row.created_at),
      } satisfies LeadAnswerView;
    })
    .filter((row): row is LeadAnswerView => row !== null)
    .sort((left, right) => left.question.sortOrder - right.question.sortOrder || left.question.question.localeCompare(right.question.question));
}

function mapLeadMatchRows(rows: Array<Record<string, unknown>>) {
  return rows
    .map((row) => {
      const professional = firstOf(row.professional as Record<string, unknown> | Array<Record<string, unknown>>);
      if (!professional) {
        return null;
      }

      return {
        id: String(row.id),
        professionalId: String(professional.id),
        companyName: String(professional.company_name),
        contactName: String(professional.contact_name),
        email: String(professional.email),
        phone: String(professional.phone),
        status: String(professional.status),
        matchScore: Number(row.match_score),
        reasons: (row.reasons as Json | null) ?? null,
      } satisfies LeadMatchView;
    })
    .filter((row): row is LeadMatchView => row !== null)
    .sort((left, right) => right.matchScore - left.matchScore || left.companyName.localeCompare(right.companyName));
}

function mapLeadImages(images: Array<{ storage_path: string; mime_type: string | null; file_size: number | null }>, signedImages: Array<{ path: string; url: string | null }>) {
  return images.map((image) => ({
    path: image.storage_path,
    url: signedImages.find((signedImage) => signedImage.path === image.storage_path)?.url ?? null,
    mimeType: image.mime_type,
    fileSize: image.file_size,
  }));
}

function mapActivityRows(rows: Array<Record<string, unknown>>) {
  return rows
    .map((row) => ({
      id: String(row.id),
      activityType: row.activity_type as LeadActivityType,
      fromStatus: (row.from_status as LeadProgressStatus | null) ?? null,
      toStatus: (row.to_status as LeadProgressStatus | null) ?? null,
      metadata: (row.metadata as Json | null) ?? null,
      createdAt: String(row.created_at),
      professional: (firstOf(row.professional as Pick<Professional, "id" | "company_name"> | Array<Pick<Professional, "id" | "company_name">>) ?? null) as
        | Pick<Professional, "id" | "company_name">
        | null,
    }))
    .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime());
}

export async function getAdminDashboardStats() {
  const supabase = createAdminSupabaseClient();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)).toISOString();

  const [
    leadsToday,
    leadsLast7Days,
    newLeads,
    qualifiedLeads,
    assignedLeads,
    acceptedLeads,
    wonLeads,
    activeProfessionals,
    rejectedAssignments,
    lostLeads,
    scoreRows,
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", startOfToday.toISOString()),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "qualified"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("status", "accepted"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("progress_status", "won"),
    supabase.from("professionals").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("progress_status", "lost"),
    supabase.from("leads").select("lead_score").not("lead_score", "is", null),
  ]);

  const scores = (scoreRows.data ?? []).map((row) => Number(row.lead_score)).filter((value) => Number.isFinite(value));
  const averageLeadScore = scores.length ? Number((scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1)) : 0;
  const acceptanceRate = calculateAcceptanceRate(acceptedLeads.count ?? 0, rejectedAssignments.count ?? 0);
  const winRate = calculateWinRate(wonLeads.count ?? 0, lostLeads.count ?? 0);

  return [
    { label: "Leads vandaag", value: leadsToday.count ?? 0, description: "Nieuwe aanvragen sinds 00:00." },
    { label: "Leads afgelopen 7 dagen", value: leadsLast7Days.count ?? 0, description: "Volume in de afgelopen week." },
    { label: "Nieuwe leads", value: newLeads.count ?? 0, description: "Leads die nog niet zijn opgevolgd." },
    { label: "Qualified leads", value: qualifiedLeads.count ?? 0, description: "Leads met status qualified." },
    { label: "Toegewezen leads", value: assignedLeads.count ?? 0, description: "Aantal gemaakte assignments." },
    { label: "Geaccepteerde leads", value: acceptedLeads.count ?? 0, description: "Assignments geaccepteerd door vakmannen." },
    { label: "Gewonnen leads", value: wonLeads.count ?? 0, description: "Assignments met progress-status won." },
    { label: "Actieve vakmannen", value: activeProfessionals.count ?? 0, description: "Vakmannen met status active." },
    { label: "Gemiddelde leadscore", value: averageLeadScore, description: "Gemiddelde van alle beschikbare leadscores." },
    { label: "Acceptatiepercentage", value: acceptanceRate, description: "Geaccepteerd t.o.v. geaccepteerd + afgewezen." },
    { label: "Winrate", value: winRate, description: "Gewonnen t.o.v. gewonnen + verloren." },
  ] as DashboardStat[];
}

export async function getAdminAttributionSummary() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("leads").select("source, utm_source, utm_medium");

  if (error) {
    throw new Error("Attributiongegevens konden niet worden geladen.");
  }

  const rows = (data ?? []) as Array<{ source: string | null; utm_source: string | null; utm_medium: string | null }>;
  const summary = new Map<string, AdminAttributionSummaryRow>();

  for (const row of rows) {
    const source = row.utm_source ?? row.source ?? "direct";
    const medium = row.utm_medium ?? "unknown";
    const key = `${source}::${medium}`;

    const existing = summary.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }

    summary.set(key, {
      source,
      medium,
      count: 1,
    });
  }

  return Array.from(summary.values()).sort((left, right) => right.count - left.count || left.source.localeCompare(right.source));
}

export async function getAdminLeads(search?: string, status?: string) {
  const supabase = createAdminSupabaseClient();
  let query = supabase
    .from("leads")
    .select("id, public_reference, status, urgency, postal_code, city, created_at, first_name, last_name, lead_score, service:services(name, slug)")
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
    lead_score: typeof item.lead_score === "number" ? item.lead_score : item.lead_score === null ? null : Number(item.lead_score),
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
        source,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        landing_page,
        referrer,
        gclid,
        fbclid,
        first_touch_source,
        first_touch_timestamp,
        created_at,
        lead_score,
        score_reasons,
        service:services(id, name, slug, category, description, active, created_at, updated_at),
        lead_images(id, storage_path, mime_type, file_size, created_at),
        lead_answers(
          id,
          answer_text,
          answer_number,
          answer_boolean,
          answer_json,
          created_at,
          question:service_questions(
            id,
            question,
            slug,
            type,
            help_text,
            required,
            sort_order,
            service_question_options(id, question_id, label, value, sort_order, active, created_at)
          )
        ),
        lead_matches(
          id,
          match_score,
          reasons,
          professional:professionals(id, company_name, contact_name, email, phone, status)
        ),
        lead_assignments(
          id,
          status,
          progress_status,
          loss_reason,
          assigned_at,
          viewed_at,
          accepted_at,
          rejected_at,
          professional:professionals(id, company_name, contact_name, status)
        ),
        lead_activity(
          id,
          activity_type,
          from_status,
          to_status,
          metadata,
          created_at,
          professional:professionals(id, company_name)
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
    source: (data.source as string | null) ?? null,
    utm_source: (data.utm_source as string | null) ?? null,
    utm_medium: (data.utm_medium as string | null) ?? null,
    utm_campaign: (data.utm_campaign as string | null) ?? null,
    utm_term: (data.utm_term as string | null) ?? null,
    utm_content: (data.utm_content as string | null) ?? null,
    landing_page: (data.landing_page as string | null) ?? null,
    referrer: (data.referrer as string | null) ?? null,
    gclid: (data.gclid as string | null) ?? null,
    fbclid: (data.fbclid as string | null) ?? null,
    first_touch_source: (data.first_touch_source as string | null) ?? null,
    first_touch_timestamp: (data.first_touch_timestamp as string | null) ?? null,
    created_at: String(data.created_at),
    lead_score: typeof data.lead_score === "number" ? data.lead_score : data.lead_score === null ? null : Number(data.lead_score),
    score_reasons: (data.score_reasons as Json | null) ?? null,
    service: (firstOf(data.service as Service | Service[]) ?? null) as Service | null,
    images: mapLeadImages(images, signedImages),
    answers: mapLeadAnswerRows((data.lead_answers ?? []) as Array<Record<string, unknown>>),
    matches: mapLeadMatchRows((data.lead_matches ?? []) as Array<Record<string, unknown>>),
    assignments: assignments.map((assignment) => ({
      id: String(assignment.id),
      status: String(assignment.status),
      progress_status: assignment.progress_status as LeadProgressStatus,
      loss_reason: (assignment.loss_reason as string | null) ?? null,
      assigned_at: String(assignment.assigned_at),
      viewed_at: (assignment.viewed_at as string | null) ?? null,
      accepted_at: (assignment.accepted_at as string | null) ?? null,
      rejected_at: (assignment.rejected_at as string | null) ?? null,
      professional: (firstOf(
        assignment.professional as Pick<Professional, "id" | "company_name" | "contact_name" | "status"> | Array<Pick<Professional, "id" | "company_name" | "contact_name" | "status">>,
      ) ?? null) as Pick<Professional, "id" | "company_name" | "contact_name" | "status"> | null,
    })),
    activity: mapActivityRows((data.lead_activity ?? []) as Array<Record<string, unknown>>),
  } as AdminLeadDetail;
}

export async function getProfessionalDashboardStats(professionalId: string) {
  const supabase = await createServerSupabaseClient();
  const [
    newAssignments,
    accepted,
    contacted,
    appointments,
    quotes,
    won,
    lost,
    rejected,
  ] = await Promise.all([
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).in("status", ["pending", "viewed"]),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("status", "accepted"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("progress_status", "contacted"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("progress_status", "appointment_scheduled"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("progress_status", "quote_sent"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("progress_status", "won"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("progress_status", "lost"),
    supabase.from("lead_assignments").select("id", { count: "exact", head: true }).eq("professional_id", professionalId).eq("status", "rejected"),
  ]);

  return [
    { label: "Nieuwe assignments", value: newAssignments.count ?? 0, description: "Nog te beoordelen aanvragen." },
    { label: "Geaccepteerd", value: accepted.count ?? 0, description: "Geaccepteerde leads." },
    { label: "Contact opgenomen", value: contacted.count ?? 0, description: "Leads met eerste klantcontact." },
    { label: "Afspraken", value: appointments.count ?? 0, description: "Geplande afspraken." },
    { label: "Offertes", value: quotes.count ?? 0, description: "Uitgebrachte offertes." },
    { label: "Gewonnen", value: won.count ?? 0, description: "Leads met gewonnen opdracht." },
    { label: "Verloren", value: lost.count ?? 0, description: "Leads met verloren opdracht." },
    {
      label: "Acceptatiepercentage",
      value: calculateAcceptanceRate(accepted.count ?? 0, rejected.count ?? 0),
      description: "Geaccepteerd t.o.v. geaccepteerd + afgewezen.",
    },
    {
      label: "Winrate",
      value: calculateWinRate(won.count ?? 0, lost.count ?? 0),
      description: "Gewonnen t.o.v. gewonnen + verloren.",
    },
  ] as DashboardStat[];
}

export async function getProfessionalAssignments(professionalId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lead_assignments")
    .select(
      "id, status, progress_status, assigned_at, viewed_at, lead:leads(id, public_reference, postal_code, city, urgency, created_at, lead_score, service:services(name, slug))",
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
      progress_status: assignment.progress_status as LeadProgressStatus,
      assigned_at: String(assignment.assigned_at),
      viewed_at: (assignment.viewed_at as string | null) ?? null,
      lead: {
        id: String(lead.id),
        public_reference: String(lead.public_reference),
        postal_code: String(lead.postal_code),
        city: (lead.city as string | null) ?? null,
        urgency: String(lead.urgency),
        created_at: String(lead.created_at),
        lead_score: typeof lead.lead_score === "number" ? lead.lead_score : lead.lead_score === null ? null : Number(lead.lead_score),
        service: (firstOf(lead.service as Pick<Service, "name" | "slug"> | Array<Pick<Service, "name" | "slug">>) ?? null) as
          | Pick<Service, "name" | "slug">
          | null,
      },
    } satisfies ProfessionalAssignmentListItem];
  });
}

export async function getProfessionalLeadDetail(leadId: string, professionalId: string, actorUserId?: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lead_assignments")
    .select(
      `
        id,
        lead_id,
        status,
        progress_status,
        loss_reason,
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
          source,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
          landing_page,
          referrer,
          gclid,
          fbclid,
          first_touch_source,
          first_touch_timestamp,
          created_at,
          lead_score,
          score_reasons,
          service:services(id, name, slug, category, description, active, created_at, updated_at),
          lead_images(id, storage_path, mime_type, file_size, created_at),
          lead_answers(
            id,
            answer_text,
            answer_number,
            answer_boolean,
            answer_json,
            created_at,
            question:service_questions(
              id,
              question,
              slug,
              type,
              help_text,
              required,
              sort_order,
              service_question_options(id, question_id, label, value, sort_order, active, created_at)
            )
          ),
          lead_activity(
            id,
            activity_type,
            from_status,
            to_status,
            metadata,
            created_at,
            professional:professionals(id, company_name)
          )
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

    await addLeadActivity({
      leadId: String(data.lead_id),
      professionalId,
      actorUserId: actorUserId ?? null,
      activityType: "assignment_viewed",
    });
  }

  const images = (lead.lead_images ?? []) as Array<{ storage_path: string; mime_type: string | null; file_size: number | null }>;
  const signedImages = await createSignedLeadImageUrls(images.map((image) => image.storage_path));

  return {
    assignmentId: String(data.id),
    assignmentStatus: String(data.status),
    assignmentProgressStatus: data.progress_status as LeadProgressStatus,
    assignedAt: String(data.assigned_at),
    viewedAt: (data.viewed_at as string | null) ?? null,
    acceptedAt: (data.accepted_at as string | null) ?? null,
    rejectedAt: (data.rejected_at as string | null) ?? null,
    lossReason: (data.loss_reason as string | null) ?? null,
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
      source: (lead.source as string | null) ?? null,
      utm_source: (lead.utm_source as string | null) ?? null,
      utm_medium: (lead.utm_medium as string | null) ?? null,
      utm_campaign: (lead.utm_campaign as string | null) ?? null,
      utm_term: (lead.utm_term as string | null) ?? null,
      utm_content: (lead.utm_content as string | null) ?? null,
      landing_page: (lead.landing_page as string | null) ?? null,
      referrer: (lead.referrer as string | null) ?? null,
      gclid: (lead.gclid as string | null) ?? null,
      fbclid: (lead.fbclid as string | null) ?? null,
      first_touch_source: (lead.first_touch_source as string | null) ?? null,
      first_touch_timestamp: (lead.first_touch_timestamp as string | null) ?? null,
      created_at: String(lead.created_at),
      lead_score: typeof lead.lead_score === "number" ? lead.lead_score : lead.lead_score === null ? null : Number(lead.lead_score),
      score_reasons: (lead.score_reasons as Json | null) ?? null,
      service: (firstOf(lead.service as Service | Service[]) ?? null) as Service | null,
      images: mapLeadImages(images, signedImages),
      answers: mapLeadAnswerRows((lead.lead_answers ?? []) as Array<Record<string, unknown>>),
      matches: [],
      assignments: [],
      activity: mapActivityRows((lead.lead_activity ?? []) as Array<Record<string, unknown>>),
    },
  } as ProfessionalLeadDetail;
}
