do $$
declare
  event_name text;
begin
  foreach event_name in array array[
    'verification_suspended',
    'document_expiring',
    'document_expired',
    'document_rejected',
    'lead_offer_received',
    'lead_offer_expiring',
    'lead_offer_expired',
    'lead_assignment_created',
    'lead_progress_reminder',
    'verification_sla_breached',
    'document_expiry_attention',
    'distribution_exhausted',
    'distribution_worker_failed',
    'stale_lead',
    'unmatched_lead',
    'no_purchase_lead',
    'operational_alert'
  ]
  loop
    if not exists (
      select 1
      from pg_enum
      where enumlabel = event_name
        and enumtypid = 'public.professional_notification_event_type'::regtype
    ) then
      execute format(
        'alter type public.professional_notification_event_type add value %L',
        event_name
      );
    end if;
  end loop;
end $$;

alter table public.professional_notification_events
  alter column professional_id drop not null,
  add column if not exists lead_id uuid references public.leads(id) on delete set null,
  add column if not exists channel_type text not null default 'in_app',
  add column if not exists status text not null default 'delivered',
  add column if not exists scheduled_for timestamptz,
  add column if not exists failed_at timestamptz,
  add column if not exists attempt_count integer not null default 0,
  add column if not exists max_attempts integer not null default 5,
  add column if not exists last_error text,
  add column if not exists deduplication_key text,
  add column if not exists read_at timestamptz,
  add column if not exists processing_started_at timestamptz;

alter table public.professional_notification_events
  drop constraint if exists professional_notification_events_status_check,
  add constraint professional_notification_events_status_check
    check (status in ('pending', 'processing', 'delivered', 'failed', 'cancelled')),
  drop constraint if exists professional_notification_events_channel_type_check,
  add constraint professional_notification_events_channel_type_check
    check (channel_type in ('in_app', 'system', 'email', 'sms', 'whatsapp')),
  drop constraint if exists professional_notification_events_attempt_count_check,
  add constraint professional_notification_events_attempt_count_check
    check (attempt_count >= 0 and max_attempts > 0),
  drop constraint if exists professional_notification_events_payload_object_check,
  add constraint professional_notification_events_payload_object_check
    check (jsonb_typeof(payload) = 'object');

alter table public.professional_notification_events
  alter column processed_at set default timezone('utc', now());

alter table public.professional_documents
  add column if not exists expiry_processed_at timestamptz,
  add column if not exists expiry_processing_started_at timestamptz;

update public.professional_notification_events
set processed_at = created_at
where status = 'delivered'
  and processed_at is null;

create unique index if not exists professional_notification_events_deduplication_key_idx
  on public.professional_notification_events (deduplication_key)
  where deduplication_key is not null;
create index if not exists professional_notification_events_pending_idx
  on public.professional_notification_events (scheduled_for, created_at)
  where status in ('pending', 'failed', 'processing');
create index if not exists professional_notification_events_professional_unread_idx
  on public.professional_notification_events (professional_id, created_at desc)
  where read_at is null and status = 'delivered';

create table if not exists public.professional_notification_preferences (
  professional_id uuid primary key references public.professionals(id) on delete cascade,
  in_app_enabled boolean not null default true,
  email_enabled boolean not null default false,
  sms_enabled boolean not null default false,
  whatsapp_enabled boolean not null default false,
  lead_offer_notifications boolean not null default true,
  verification_notifications boolean not null default true,
  document_notifications boolean not null default true,
  progress_reminders boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint professional_notification_preferences_external_disabled
    check (not email_enabled and not sms_enabled and not whatsapp_enabled)
);

create table if not exists public.operational_settings (
  setting_key text primary key,
  setting_value jsonb not null,
  updated_at timestamptz not null default timezone('utc', now()),
  check (jsonb_typeof(setting_value) in ('object', 'array', 'number', 'boolean'))
);

insert into public.operational_settings (setting_key, setting_value)
values
  ('verification_sla_hours', '{"first":24,"breach":48}'::jsonb),
  ('changes_requested_reminder_hours', '72'::jsonb),
  ('document_expiry_reminder_days', '[30,7]'::jsonb),
  ('offer_reminder_offset_minutes', '60'::jsonb),
  ('stale_lead_thresholds', '{"no_distribution_minutes":15,"distributed_no_purchase_hours":24,"assignment_progress_days":3}'::jsonb),
  ('progress_reminder_delay_days', '3'::jsonb),
  ('notification_max_attempts', '5'::jsonb),
  ('notification_retry_base_minutes', '2'::jsonb)
on conflict (setting_key) do nothing;

create table if not exists public.operational_worker_runs (
  id uuid primary key default gen_random_uuid(),
  worker_type text not null,
  started_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz,
  status text not null default 'running'
    check (status in ('running', 'completed', 'failed', 'partial')),
  claimed_count integer not null default 0 check (claimed_count >= 0),
  processed_count integer not null default 0 check (processed_count >= 0),
  failed_count integer not null default 0 check (failed_count >= 0),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  error_summary text
);

create index if not exists operational_worker_runs_type_started_idx
  on public.operational_worker_runs (worker_type, started_at desc);

alter table public.professional_notification_preferences enable row level security;
alter table public.operational_settings enable row level security;
alter table public.operational_worker_runs enable row level security;

drop policy if exists "admins manage professional notification events" on public.professional_notification_events;
drop policy if exists "professionals read own notification events" on public.professional_notification_events;
create policy "admins read notification events"
  on public.professional_notification_events
  for select
  using (public.is_admin());
create policy "professionals read own notification events"
  on public.professional_notification_events
  for select
  using (professional_id = public.current_professional_id() and status = 'delivered');
create policy "professionals update own notification read state"
  on public.professional_notification_events
  for update
  using (professional_id = public.current_professional_id() and status = 'delivered')
  with check (professional_id = public.current_professional_id() and status = 'delivered');

create policy "professionals manage own notification preferences"
  on public.professional_notification_preferences
  for all
  using (professional_id = public.current_professional_id())
  with check (
    professional_id = public.current_professional_id()
    and not email_enabled
    and not sms_enabled
    and not whatsapp_enabled
  );
create policy "admins read operational settings"
  on public.operational_settings
  for select
  using (public.is_admin());
create policy "admins read operational worker runs"
  on public.operational_worker_runs
  for select
  using (public.is_admin());

revoke update on public.professional_notification_events from anon, authenticated;
grant select on public.professional_notification_events to authenticated;
grant update (read_at) on public.professional_notification_events to authenticated;
grant select, insert, update on public.professional_notification_preferences to authenticated;
grant select on public.operational_settings, public.operational_worker_runs to authenticated;
grant all on public.professional_notification_events to service_role;
grant all on public.professional_notification_preferences, public.operational_settings, public.operational_worker_runs to service_role;

create or replace function public.touch_professional_verification_on_document_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_professional_id uuid := coalesce(new.professional_id, old.professional_id);
  target_document_type professional_document_type := coalesce(new.document_type, old.document_type);
  required_document boolean;
begin
  select exists (
    select 1
    from public.professional_document_requirements requirement
    where requirement.document_type = target_document_type
      and requirement.requirement_level = 'required'
      and (
        requirement.service_id is null
        or exists (
          select 1
          from public.professional_services professional_service
          where professional_service.professional_id = target_professional_id
            and professional_service.service_id = requirement.service_id
            and professional_service.active
        )
      )
  ) into required_document;

  if required_document then
    update public.professionals professional
    set verification_status = case when professional.verification_status = 'verified' then 'pending' else professional.verification_status end,
        onboarding_status = case when professional.onboarding_status = 'approved' then 'changes_requested' else professional.onboarding_status end,
        verification_status_reason = case when professional.verification_status = 'verified' then 'Een vereist document is gewijzigd en moet opnieuw worden beoordeeld.' else professional.verification_status_reason end,
        last_critical_change_at = timezone('utc', now()),
        updated_at = timezone('utc', now())
    where professional.id = target_professional_id;
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists touch_professional_verification_on_document_update on public.professional_documents;
create trigger touch_professional_verification_on_document_update
  after update of verification_status, expires_at, archived_at on public.professional_documents
  for each row execute function public.touch_professional_verification_on_document_change();

create or replace function public.notify_professional_document_rejection()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.verification_status is distinct from new.verification_status
    and new.verification_status = 'rejected' then
    insert into public.professional_notification_events (
      professional_id,
      event_type,
      channel_type,
      payload,
      status,
      processed_at,
      deduplication_key
    )
    values (
      new.professional_id,
      'document_rejected',
      'in_app',
      '{"title":"Document afgekeurd","description":"Een document is beoordeeld en afgekeurd.","href":"/vakman/profiel"}'::jsonb,
      'delivered',
      timezone('utc', now()),
      'document-rejected:' || new.id::text || ':' || coalesce(new.reviewed_at::text, timezone('utc', now())::text)
    )
    on conflict (deduplication_key) where deduplication_key is not null do nothing;
  end if;
  return new;
end;
$$;

create trigger notify_professional_document_rejection
  after update of verification_status on public.professional_documents
  for each row execute function public.notify_professional_document_rejection();

create or replace function public.notify_professional_suspension()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.verification_status is distinct from new.verification_status
    and new.verification_status = 'suspended' then
    insert into public.professional_notification_events (
      professional_id,
      event_type,
      channel_type,
      payload,
      status,
      processed_at,
      deduplication_key
    )
    values (
      new.id,
      'verification_suspended',
      'in_app',
      '{"title":"Verificatie opgeschort","description":"Je verificatiestatus is gewijzigd. Bekijk de details in je profiel.","href":"/vakman/profiel"}'::jsonb,
      'delivered',
      timezone('utc', now()),
      'verification-suspended:' || new.id::text || ':' || new.updated_at::text
    )
    on conflict (deduplication_key) where deduplication_key is not null do nothing;
  end if;
  return new;
end;
$$;

create trigger notify_professional_suspension
  after update of verification_status on public.professionals
  for each row execute function public.notify_professional_suspension();

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
  insert into public.professional_notification_events (
    professional_id,
    event_type,
    channel_type,
    payload,
    status,
    processed_at
  )
  values (
    target_professional_id,
    target_event_type,
    'in_app',
    coalesce(payload, '{}'::jsonb),
    'delivered',
    timezone('utc', now())
  )
  returning id into inserted_id;

  return inserted_id;
end;
$$;

create or replace function public.claim_pending_notification_events(max_count integer default 100)
returns setof public.professional_notification_events
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.professional_notification_events
  set status = 'failed',
      failed_at = timezone('utc', now()),
      processing_started_at = null,
      last_error = 'retry_exhausted'
  where status = 'processing'
    and processing_started_at < timezone('utc', now()) - interval '15 minutes'
    and attempt_count >= max_attempts;

  return query
  with locked as (
    select event.id
    from public.professional_notification_events event
    where event.attempt_count < event.max_attempts
      and coalesce(event.scheduled_for, event.created_at) <= timezone('utc', now())
      and (
        event.status in ('pending', 'failed')
        or (
          event.status = 'processing'
          and event.processing_started_at < timezone('utc', now()) - interval '15 minutes'
        )
      )
    order by coalesce(event.scheduled_for, event.created_at), event.id
    for update skip locked
    limit greatest(1, least(coalesce(max_count, 100), 500))
  ),
  claimed as (
    update public.professional_notification_events event
    set status = 'processing',
        attempt_count = event.attempt_count + 1,
        processing_started_at = timezone('utc', now()),
        failed_at = null
    where event.id in (select locked.id from locked)
    returning event.*
  )
  select claimed.* from claimed;
end;
$$;

create or replace function public.claim_expired_professional_documents(max_count integer default 100)
returns setof public.professional_documents
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  return query
  with locked as (
    select document.id
    from public.professional_documents document
    where document.archived_at is null
      and document.expires_at <= timezone('utc', now())
      and document.expiry_processed_at is null
      and document.verification_status in ('pending', 'approved', 'expired')
      and (
        document.expiry_processing_started_at is null
        or document.expiry_processing_started_at < timezone('utc', now()) - interval '15 minutes'
      )
    order by document.expires_at, document.id
    for update skip locked
    limit greatest(1, least(coalesce(max_count, 100), 500))
  ),
  claimed as (
    update public.professional_documents document
    set expiry_processing_started_at = timezone('utc', now())
    where document.id in (select locked.id from locked)
    returning document.*
  )
  select claimed.* from claimed;
end;
$$;

revoke all on function public.claim_pending_notification_events(integer) from public, anon, authenticated;
revoke all on function public.claim_expired_professional_documents(integer) from public, anon, authenticated;
revoke all on function public.notify_professional_document_rejection() from public, anon, authenticated, service_role;
revoke all on function public.notify_professional_suspension() from public, anon, authenticated, service_role;
grant execute on function public.claim_pending_notification_events(integer) to service_role;
grant execute on function public.claim_expired_professional_documents(integer) to service_role;

revoke all on table public.operational_settings, public.operational_worker_runs from anon, authenticated;
grant select on table public.operational_settings, public.operational_worker_runs to authenticated;
