do $$ begin
  if not exists (select 1 from pg_type where typname = 'professional_onboarding_status') then
    create type professional_onboarding_status as enum ('not_started', 'in_progress', 'submitted', 'approved', 'changes_requested', 'rejected');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_identity_type') then
    create type professional_identity_type as enum ('zzp', 'eenmanszaak', 'vof', 'bv', 'overig');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_onboarding_step') then
    create type professional_onboarding_step as enum ('company', 'contact', 'services', 'areas', 'experience', 'capacity', 'documents', 'review');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_availability_status') then
    create type professional_availability_status as enum ('available', 'limited', 'unavailable');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_document_type') then
    create type professional_document_type as enum ('kvk_extract', 'liability_insurance', 'certification', 'identity_or_authority', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_document_verification_status') then
    create type professional_document_verification_status as enum ('pending', 'approved', 'rejected', 'expired');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_document_requirement_level') then
    create type professional_document_requirement_level as enum ('required', 'recommended', 'optional');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_review_section') then
    create type professional_review_section as enum ('company', 'contact', 'services', 'areas', 'experience', 'capacity', 'documents', 'review', 'verification');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_review_feedback_status') then
    create type professional_review_feedback_status as enum ('open', 'resolved');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_notification_event_type') then
    create type professional_notification_event_type as enum ('onboarding_submitted', 'verification_approved', 'changes_requested', 'verification_rejected');
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_audit_event_type') then
    create type professional_audit_event_type as enum (
      'onboarding_started',
      'step_completed',
      'onboarding_submitted',
      'document_uploaded',
      'document_removed',
      'document_reviewed',
      'verification_approved',
      'changes_requested',
      'verification_rejected',
      'verification_suspended',
      'critical_profile_change'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_enum where enumlabel = 'changes_requested' and enumtypid = 'professional_verification_status'::regtype) then
    alter type professional_verification_status add value 'changes_requested';
  end if;
  if not exists (select 1 from pg_enum where enumlabel = 'suspended' and enumtypid = 'professional_verification_status'::regtype) then
    alter type professional_verification_status add value 'suspended';
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_enum where enumlabel = 'onboarding_started' and enumtypid = 'lead_activity_type'::regtype) then
    alter type lead_activity_type add value 'onboarding_started';
  end if;
  if not exists (select 1 from pg_enum where enumlabel = 'step_completed' and enumtypid = 'lead_activity_type'::regtype) then
    alter type lead_activity_type add value 'step_completed';
  end if;
end
$$;

alter table public.professionals
  add column if not exists trade_name text,
  add column if not exists btw_number text,
  add column if not exists identity_type professional_identity_type,
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists postal_code text,
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists years_experience integer,
  add column if not exists team_size integer,
  add column if not exists specialties jsonb not null default '[]'::jsonb,
  add column if not exists verification_status_reason text,
  add column if not exists onboarding_status professional_onboarding_status not null default 'not_started',
  add column if not exists onboarding_step professional_onboarding_step not null default 'company',
  add column if not exists onboarding_completion integer not null default 0,
  add column if not exists onboarding_started_at timestamptz,
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists submitted_for_review_at timestamptz,
  add column if not exists quality_score integer not null default 0,
  add column if not exists quality_breakdown jsonb not null default '{}'::jsonb,
  add column if not exists last_critical_change_at timestamptz;

alter table public.professionals
  alter column verification_status set default 'unverified';

alter table public.professionals
  add constraint professionals_quality_score_range check (quality_score between 0 and 100) not valid;
alter table public.professionals validate constraint professionals_quality_score_range;

alter table public.professionals
  add constraint professionals_specialties_is_array check (jsonb_typeof(specialties) = 'array') not valid;
alter table public.professionals validate constraint professionals_specialties_is_array;

alter table public.professional_services
  add column if not exists years_experience integer not null default 0,
  add column if not exists specialization_summary text,
  add column if not exists preferred_lead_type lead_commercial_type;

alter table public.professional_service_areas
  add column if not exists city text,
  add column if not exists province text,
  add column if not exists radius_km integer;

alter table public.professional_distribution_settings
  add column if not exists availability_status professional_availability_status not null default 'available',
  add column if not exists available_from timestamptz,
  add column if not exists unavailable_until timestamptz;

create table if not exists public.professional_documents (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  document_type professional_document_type not null,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  file_size integer not null check (file_size > 0 and file_size <= 10485760),
  verification_status professional_document_verification_status not null default 'pending',
  rejection_reason text,
  uploaded_at timestamptz not null default timezone('utc', now()),
  reviewed_at timestamptz,
  reviewed_by uuid,
  expires_at timestamptz,
  archived_at timestamptz,
  superseded_by_document_id uuid references public.professional_documents(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.professional_document_requirements (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete cascade,
  document_type professional_document_type not null,
  requirement_level professional_document_requirement_level not null default 'required',
  display_name text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists professional_document_requirements_unique_idx
  on public.professional_document_requirements (coalesce(service_id, '00000000-0000-0000-0000-000000000000'::uuid), document_type);

create table if not exists public.professional_review_feedback (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  section professional_review_section not null,
  message text not null,
  status professional_review_feedback_status not null default 'open',
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz
);

create table if not exists public.professional_audit_log (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  actor_user_id uuid,
  event_type professional_audit_event_type not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  check (jsonb_typeof(metadata) = 'object')
);

create table if not exists public.professional_notification_events (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  event_type professional_notification_event_type not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  check (jsonb_typeof(payload) = 'object')
);

create index if not exists professional_documents_professional_type_idx on public.professional_documents (professional_id, document_type, uploaded_at desc);
create index if not exists professional_documents_review_status_idx on public.professional_documents (verification_status, reviewed_at desc);
create index if not exists professional_review_feedback_professional_status_idx on public.professional_review_feedback (professional_id, status, created_at desc);
create index if not exists professional_audit_log_professional_created_idx on public.professional_audit_log (professional_id, created_at desc);
create index if not exists professional_notification_events_professional_created_idx on public.professional_notification_events (professional_id, created_at desc);

insert into public.professional_document_requirements (id, service_id, document_type, requirement_level, display_name, description)
values
  ('11111111-1111-4111-8111-111111111111', null, 'kvk_extract', 'required', 'KvK-uittreksel', 'Verplicht voor alle vakmannen.'),
  ('22222222-2222-4222-8222-222222222222', null, 'liability_insurance', 'recommended', 'Aansprakelijkheidsverzekering', 'Aanbevolen en later per dienst aanscherpbaar.')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'professional-documents',
  'professional-documents',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

create or replace function public.professional_document_storage_path_is_owned(target_path text, target_professional_id uuid)
returns boolean
language sql
stable
as $$
  select target_path like ('professionals/' || target_professional_id::text || '/documents/%');
$$;

create or replace function public.append_professional_audit_log(
  target_professional_id uuid,
  actor_id uuid,
  target_event_type professional_audit_event_type,
  payload jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  inserted_id uuid;
begin
  insert into public.professional_audit_log (professional_id, actor_user_id, event_type, metadata)
  values (target_professional_id, actor_id, target_event_type, coalesce(payload, '{}'::jsonb))
  returning id into inserted_id;

  return inserted_id;
end;
$$;

create or replace function public.enqueue_professional_notification(
  target_professional_id uuid,
  target_event_type professional_notification_event_type,
  payload jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  inserted_id uuid;
begin
  insert into public.professional_notification_events (professional_id, event_type, payload)
  values (target_professional_id, target_event_type, coalesce(payload, '{}'::jsonb))
  returning id into inserted_id;

  return inserted_id;
end;
$$;

create or replace function public.enforce_professional_self_update()
returns trigger
language plpgsql
as $$
declare
  critical_change boolean := false;
begin
  if public.is_admin() or auth.role() = 'service_role' or current_user = 'postgres' then
    return new;
  end if;

  if old.auth_user_id <> auth.uid() then
    raise exception 'UNAUTHORIZED_PROFESSIONAL_UPDATE';
  end if;

  if new.id <> old.id
    or new.auth_user_id <> old.auth_user_id
    or new.email <> old.email
    or new.status <> old.status
    or new.quality_score <> old.quality_score
    or new.quality_breakdown <> old.quality_breakdown
    or new.verification_status <> old.verification_status
    or new.verification_status_reason is distinct from old.verification_status_reason
    or new.onboarding_status <> old.onboarding_status
    or new.onboarding_completion <> old.onboarding_completion
    or new.submitted_for_review_at is distinct from old.submitted_for_review_at
    or new.last_critical_change_at is distinct from old.last_critical_change_at
  then
    raise exception 'PROFESSIONAL_ADMIN_FIELDS_IMMUTABLE';
  end if;

  critical_change := new.company_name is distinct from old.company_name
    or new.kvk_number is distinct from old.kvk_number
    or new.btw_number is distinct from old.btw_number;

  if critical_change and old.verification_status = 'verified' then
    new.verification_status := 'pending';
    new.verification_status_reason := 'Kritieke profielwijziging vereist herbeoordeling.';
    new.onboarding_status := case when old.onboarding_status = 'approved' then 'changes_requested' else old.onboarding_status end;
    new.last_critical_change_at := timezone('utc', now());
  end if;

  if old.onboarding_started_at is null and new.onboarding_status in ('in_progress', 'submitted', 'changes_requested') then
    new.onboarding_started_at := timezone('utc', now());
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_professional_self_update on public.professionals;
create trigger enforce_professional_self_update
before update on public.professionals
for each row execute function public.enforce_professional_self_update();

create or replace function public.protect_professional_document_delete()
returns trigger
language plpgsql
as $$
begin
  if old.verification_status = 'approved' then
    raise exception 'APPROVED_DOCUMENT_DELETE_FORBIDDEN';
  end if;
  return old;
end;
$$;

create or replace function public.touch_professional_verification_on_document_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.professionals p
    set verification_status = case when p.verification_status = 'verified' then 'pending' else p.verification_status end,
        onboarding_status = case when p.onboarding_status = 'approved' then 'changes_requested' else p.onboarding_status end,
        verification_status_reason = case when p.verification_status = 'verified' then 'Nieuw of gewijzigd document vereist review.' else p.verification_status_reason end,
        last_critical_change_at = timezone('utc', now()),
        updated_at = timezone('utc', now())
  where p.id = coalesce(new.professional_id, old.professional_id)
    and coalesce(new.document_type, old.document_type) in ('kvk_extract', 'liability_insurance', 'identity_or_authority');

  return coalesce(new, old);
end;
$$;

create or replace function public.track_professional_audit_after_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;

  if old.onboarding_status = 'not_started' and new.onboarding_status in ('in_progress', 'submitted', 'changes_requested') then
    perform public.append_professional_audit_log(new.id, auth.uid(), 'onboarding_started', jsonb_build_object('status', new.onboarding_status));
  end if;

  if old.onboarding_step is distinct from new.onboarding_step then
    perform public.append_professional_audit_log(new.id, auth.uid(), 'step_completed', jsonb_build_object('step', new.onboarding_step));
  end if;

  if old.submitted_for_review_at is distinct from new.submitted_for_review_at and new.submitted_for_review_at is not null then
    perform public.append_professional_audit_log(new.id, auth.uid(), 'onboarding_submitted', jsonb_build_object('quality_score', new.quality_score));
    perform public.enqueue_professional_notification(new.id, 'onboarding_submitted', jsonb_build_object('quality_score', new.quality_score));
  end if;

  if old.verification_status <> new.verification_status and new.verification_status = 'verified' then
    perform public.append_professional_audit_log(new.id, auth.uid(), 'verification_approved', jsonb_build_object('reason', new.verification_status_reason));
    perform public.enqueue_professional_notification(new.id, 'verification_approved', jsonb_build_object('reason', new.verification_status_reason));
  elsif old.verification_status <> new.verification_status and new.verification_status = 'changes_requested' then
    perform public.append_professional_audit_log(new.id, auth.uid(), 'changes_requested', jsonb_build_object('reason', new.verification_status_reason));
    perform public.enqueue_professional_notification(new.id, 'changes_requested', jsonb_build_object('reason', new.verification_status_reason));
  elsif old.verification_status <> new.verification_status and new.verification_status = 'rejected' then
    perform public.append_professional_audit_log(new.id, auth.uid(), 'verification_rejected', jsonb_build_object('reason', new.verification_status_reason));
    perform public.enqueue_professional_notification(new.id, 'verification_rejected', jsonb_build_object('reason', new.verification_status_reason));
  elsif old.verification_status <> new.verification_status and new.verification_status = 'suspended' then
    perform public.append_professional_audit_log(new.id, auth.uid(), 'verification_suspended', jsonb_build_object('reason', new.verification_status_reason));
  end if;

  if old.last_critical_change_at is distinct from new.last_critical_change_at and new.last_critical_change_at is not null then
    perform public.append_professional_audit_log(new.id, auth.uid(), 'critical_profile_change', jsonb_build_object('verification_status', new.verification_status));
  end if;

  return new;
end;
$$;

create or replace function public.track_professional_document_audit_after_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    perform public.append_professional_audit_log(new.professional_id, auth.uid(), 'document_uploaded', jsonb_build_object('document_type', new.document_type, 'document_id', new.id));
    return new;
  end if;

  if tg_op = 'DELETE' then
    perform public.append_professional_audit_log(old.professional_id, auth.uid(), 'document_removed', jsonb_build_object('document_type', old.document_type, 'document_id', old.id));
    return old;
  end if;

  if old.verification_status <> new.verification_status or old.reviewed_at is distinct from new.reviewed_at or old.rejection_reason is distinct from new.rejection_reason then
    perform public.append_professional_audit_log(new.professional_id, auth.uid(), 'document_reviewed', jsonb_build_object('document_type', new.document_type, 'document_id', new.id, 'verification_status', new.verification_status));
  end if;

  return new;
end;
$$;

alter table public.professional_documents enable row level security;
alter table public.professional_document_requirements enable row level security;
alter table public.professional_review_feedback enable row level security;
alter table public.professional_audit_log enable row level security;
alter table public.professional_notification_events enable row level security;

drop policy if exists "professionals can manage own services" on public.professional_services;
create policy "professionals can manage own services"
  on public.professional_services
  for all
  using (professional_id = public.current_professional_id())
  with check (professional_id = public.current_professional_id());

drop policy if exists "professionals can manage own areas" on public.professional_service_areas;
create policy "professionals can manage own areas"
  on public.professional_service_areas
  for all
  using (professional_id = public.current_professional_id())
  with check (professional_id = public.current_professional_id());

create policy "admins manage professional documents"
  on public.professional_documents
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals read own document metadata"
  on public.professional_documents
  for select
  using (professional_id = public.current_professional_id());

create policy "professionals upload own document metadata"
  on public.professional_documents
  for insert
  with check (professional_id = public.current_professional_id());

create policy "professionals delete own pending documents"
  on public.professional_documents
  for delete
  using (professional_id = public.current_professional_id());

create policy "admins manage professional document requirements"
  on public.professional_document_requirements
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals read document requirements"
  on public.professional_document_requirements
  for select
  using (true);

create policy "admins manage professional review feedback"
  on public.professional_review_feedback
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals read own review feedback"
  on public.professional_review_feedback
  for select
  using (professional_id = public.current_professional_id());

create policy "admins manage professional audit log"
  on public.professional_audit_log
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals read own audit log"
  on public.professional_audit_log
  for select
  using (professional_id = public.current_professional_id());

create policy "admins manage professional notification events"
  on public.professional_notification_events
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals read own notification events"
  on public.professional_notification_events
  for select
  using (professional_id = public.current_professional_id());

create policy "admins manage professional document storage"
  on storage.objects
  for all
  using (bucket_id = 'professional-documents' and public.is_admin())
  with check (bucket_id = 'professional-documents' and public.is_admin());

create policy "professionals upload own professional document storage"
  on storage.objects
  for insert
  with check (
    bucket_id = 'professional-documents'
    and public.professional_document_storage_path_is_owned(name, public.current_professional_id())
  );

create policy "professionals delete own professional document storage"
  on storage.objects
  for delete
  using (
    bucket_id = 'professional-documents'
    and public.professional_document_storage_path_is_owned(name, public.current_professional_id())
  );

drop trigger if exists enforce_professional_document_delete on public.professional_documents;
create trigger enforce_professional_document_delete
before delete on public.professional_documents
for each row execute function public.protect_professional_document_delete();

drop trigger if exists touch_professional_verification_on_document_insert on public.professional_documents;
create trigger touch_professional_verification_on_document_insert
after insert on public.professional_documents
for each row execute function public.touch_professional_verification_on_document_change();

drop trigger if exists touch_professional_verification_on_document_update on public.professional_documents;
create trigger touch_professional_verification_on_document_update
after update on public.professional_documents
for each row execute function public.touch_professional_verification_on_document_change();

drop trigger if exists track_professional_audit_after_update on public.professionals;
create trigger track_professional_audit_after_update
after update on public.professionals
for each row execute function public.track_professional_audit_after_change();

drop trigger if exists track_professional_document_audit_after_insert on public.professional_documents;
create trigger track_professional_document_audit_after_insert
after insert on public.professional_documents
for each row execute function public.track_professional_document_audit_after_change();

drop trigger if exists track_professional_document_audit_after_update on public.professional_documents;
create trigger track_professional_document_audit_after_update
after update on public.professional_documents
for each row execute function public.track_professional_document_audit_after_change();

drop trigger if exists track_professional_document_audit_after_delete on public.professional_documents;
create trigger track_professional_document_audit_after_delete
after delete on public.professional_documents
for each row execute function public.track_professional_document_audit_after_change();

revoke all on function public.append_professional_audit_log(uuid, uuid, professional_audit_event_type, jsonb) from public;
revoke all on function public.enqueue_professional_notification(uuid, professional_notification_event_type, jsonb) from public;
revoke all on function public.touch_professional_verification_on_document_change() from public;
revoke all on function public.track_professional_audit_after_change() from public;
revoke all on function public.track_professional_document_audit_after_change() from public;

grant execute on function public.append_professional_audit_log(uuid, uuid, professional_audit_event_type, jsonb) to authenticated, service_role;
grant execute on function public.enqueue_professional_notification(uuid, professional_notification_event_type, jsonb) to authenticated, service_role;

grant execute on function public.touch_professional_verification_on_document_change() to authenticated, service_role;
grant execute on function public.track_professional_audit_after_change() to authenticated, service_role;
grant execute on function public.track_professional_document_audit_after_change() to authenticated, service_role;

update public.professionals
set onboarding_started_at = coalesce(onboarding_started_at, created_at),
    onboarding_status = case when verification_status = 'verified' then 'approved' when status = 'pending' then 'submitted' else 'not_started' end,
    onboarding_step = case when verification_status = 'verified' then 'review' else 'company' end,
    onboarding_completion = case when verification_status = 'verified' then 100 else 0 end,
    quality_score = case when verification_status = 'verified' then 90 else 0 end,
    updated_at = timezone('utc', now())
where onboarding_started_at is null;
