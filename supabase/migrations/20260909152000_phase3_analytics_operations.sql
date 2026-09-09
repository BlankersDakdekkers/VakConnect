create type professional_verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type lead_progress_status as enum ('new', 'contacted', 'appointment_scheduled', 'quote_sent', 'won', 'lost');
create type lead_activity_type as enum (
  'lead_created',
  'lead_score_calculated',
  'lead_matches_refreshed',
  'lead_assigned',
  'assignment_viewed',
  'assignment_accepted',
  'assignment_rejected',
  'progress_updated',
  'loss_reason_recorded'
);

alter table public.professionals
  add column description text,
  add column verification_status professional_verification_status not null default 'unverified';

alter table public.professionals
  add constraint professionals_description_length check (description is null or char_length(trim(description)) <= 2000);

alter table public.leads
  add column utm_source text,
  add column utm_medium text,
  add column utm_campaign text,
  add column utm_term text,
  add column utm_content text,
  add column landing_page text,
  add column referrer text,
  add column gclid text,
  add column fbclid text,
  add column first_touch_source text,
  add column first_touch_timestamp timestamptz;

alter table public.lead_assignments
  add column progress_status lead_progress_status not null default 'new',
  add column progress_updated_at timestamptz,
  add column loss_reason text;

alter table public.lead_assignments
  add constraint lead_assignments_loss_reason_length check (loss_reason is null or char_length(trim(loss_reason)) between 2 and 120);

create or replace function public.analytics_metadata_is_safe(metadata jsonb)
returns boolean
language plpgsql
stable
as $$
declare
  entry record;
  nested jsonb;
  banned_pattern text := '(name|first_name|last_name|email|phone|address|street|description|message|photo|image)';
begin
  if metadata is null then
    return true;
  end if;

  if jsonb_typeof(metadata) <> 'object' then
    return false;
  end if;

  for entry in select key, value from jsonb_each(metadata) loop
    if entry.key ~* banned_pattern then
      return false;
    end if;

    if jsonb_typeof(entry.value) = 'object' then
      return false;
    end if;

    if jsonb_typeof(entry.value) = 'string' and char_length(trim(both '"' from entry.value::text)) > 120 then
      return false;
    end if;

    if jsonb_typeof(entry.value) = 'array' then
      for nested in select value from jsonb_array_elements(entry.value) loop
        if jsonb_typeof(nested) in ('array', 'object') then
          return false;
        end if;
        if jsonb_typeof(nested) = 'string' and char_length(trim(both '"' from nested::text)) > 120 then
          return false;
        end if;
      end loop;
    end if;
  end loop;

  return true;
end;
$$;

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (char_length(trim(event_name)) between 2 and 80),
  anonymous_session_id text not null check (char_length(trim(anonymous_session_id)) between 16 and 120),
  lead_id uuid references public.leads(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  check (public.analytics_metadata_is_safe(metadata))
);

create table public.lead_activity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  professional_id uuid references public.professionals(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  activity_type lead_activity_type not null,
  from_status lead_progress_status,
  to_status lead_progress_status,
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  check (public.analytics_metadata_is_safe(metadata))
);

create or replace function public.enforce_professional_self_update()
returns trigger
language plpgsql
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.id <> old.id or new.auth_user_id <> old.auth_user_id or new.company_name <> old.company_name
    or new.email <> old.email or new.kvk_number is distinct from old.kvk_number
    or new.status <> old.status or new.verification_status <> old.verification_status then
    raise exception 'Alleen contact_name, phone, website en description mogen worden aangepast.';
  end if;

  return new;
end;
$$;

create or replace function public.is_valid_lead_progress_transition(current_status lead_progress_status, next_status lead_progress_status)
returns boolean
language sql
immutable
as $$
  select
    case
      when current_status = next_status then true
      when current_status = 'new' and next_status = 'contacted' then true
      when current_status = 'contacted' and next_status = 'appointment_scheduled' then true
      when current_status = 'appointment_scheduled' and next_status = 'quote_sent' then true
      when current_status = 'quote_sent' and next_status in ('won', 'lost') then true
      else false
    end;
$$;

create or replace function public.enforce_lead_progress_update()
returns trigger
language plpgsql
as $$
begin
  if old.progress_status = new.progress_status then
    return new;
  end if;

  if new.status <> 'accepted' then
    raise exception 'Alleen geaccepteerde assignments mogen progress updates krijgen.';
  end if;

  if not public.is_valid_lead_progress_transition(old.progress_status, new.progress_status) then
    raise exception 'Ongeldige progress transitie van % naar %.', old.progress_status, new.progress_status;
  end if;

  if new.progress_status = 'lost' and new.loss_reason is not null and char_length(trim(new.loss_reason)) < 2 then
    raise exception 'Verliesreden is te kort.';
  end if;

  new.progress_updated_at = timezone('utc', now());
  return new;
end;
$$;

create index leads_utm_source_idx on public.leads (utm_source);
create index leads_utm_medium_idx on public.leads (utm_medium);
create index analytics_events_event_name_idx on public.analytics_events (event_name);
create index analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index analytics_events_lead_id_idx on public.analytics_events (lead_id);
create index lead_activity_lead_id_idx on public.lead_activity (lead_id);
create index lead_activity_professional_id_idx on public.lead_activity (professional_id);
create index professional_service_areas_professional_id_idx on public.professional_service_areas (professional_id);

alter table public.analytics_events enable row level security;
alter table public.lead_activity enable row level security;

create policy "admins manage analytics events"
  on public.analytics_events
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins manage lead activity"
  on public.lead_activity
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read lead activity for assigned leads"
  on public.lead_activity
  for select
  using (
    exists (
      select 1
      from public.lead_assignments la
      where la.lead_id = lead_activity.lead_id
        and la.professional_id = public.current_professional_id()
    )
  );

create policy "professionals can add own lead activity"
  on public.lead_activity
  for insert
  with check (
    professional_id = public.current_professional_id()
    and actor_user_id = auth.uid()
    and activity_type in ('progress_updated', 'loss_reason_recorded', 'assignment_viewed', 'assignment_accepted', 'assignment_rejected')
    and exists (
      select 1
      from public.lead_assignments la
      where la.lead_id = lead_activity.lead_id
        and la.professional_id = public.current_professional_id()
        and la.status = 'accepted'
    )
  );

create policy "professionals can update own profile"
  on public.professionals
  for update
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

create trigger enforce_professional_self_update
before update on public.professionals
for each row execute function public.enforce_professional_self_update();

create trigger enforce_lead_progress_update
before update on public.lead_assignments
for each row execute function public.enforce_lead_progress_update();
