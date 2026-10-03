create table public.experiments (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9_]{2,80}$'),
  name text not null check (char_length(trim(name)) between 2 and 120),
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'completed', 'archived')),
  target_type text not null check (target_type in ('homepage', 'service_page', 'local_page', 'lead_funnel', 'cta', 'funnel_step')),
  slot text not null check (slot ~ '^[a-z0-9_.]{3,100}$'),
  target_rules jsonb not null default '{}'::jsonb check (jsonb_typeof(target_rules) = 'object'),
  goal_event text not null check (goal_event in ('public_cta_click', 'lead_funnel_started', 'lead_submitted')),
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.experiment_variants (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  key text not null check (key ~ '^[a-z0-9_]{2,80}$'),
  label text not null check (char_length(trim(label)) between 1 and 120),
  weight integer not null check (weight between 1 and 100),
  is_control boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (experiment_id, key),
  unique (experiment_id, id)
);

create unique index experiment_variants_one_control_idx
  on public.experiment_variants (experiment_id)
  where is_control;

create table public.experiment_assignments (
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  anonymous_session_id uuid not null,
  variant_id uuid not null,
  assigned_at timestamptz not null default timezone('utc', now()),
  primary key (experiment_id, anonymous_session_id),
  foreign key (experiment_id, variant_id) references public.experiment_variants(experiment_id, id)
);

create index experiment_assignments_session_idx
  on public.experiment_assignments (anonymous_session_id, experiment_id);

create table public.experiment_audit_log (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.experiments(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  previous_status text not null,
  next_status text not null,
  created_at timestamptz not null default timezone('utc', now()),
  check (previous_status in ('draft', 'active', 'paused', 'completed', 'archived')),
  check (next_status in ('draft', 'active', 'paused', 'completed', 'archived'))
);

create index experiment_audit_log_experiment_created_idx
  on public.experiment_audit_log (experiment_id, created_at desc);

create unique index experiments_one_active_per_slot_idx
  on public.experiments (slot)
  where status = 'active';

create or replace function public.transition_experiment_status(
  input_experiment_id uuid,
  input_next_status text,
  input_actor_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_experiment public.experiments%rowtype;
  variant_count integer;
  control_count integer;
  total_weight integer;
begin
  if input_next_status not in ('active', 'paused', 'completed', 'archived') then
    raise exception 'Ongeldige experimentstatus.';
  end if;

  select * into current_experiment
  from public.experiments
  where id = input_experiment_id
  for update;

  if not found then
    raise exception 'Experiment niet gevonden.';
  end if;

  if not (
    (current_experiment.status = 'draft' and input_next_status = 'active')
    or (current_experiment.status = 'active' and input_next_status in ('paused', 'completed'))
    or (current_experiment.status = 'paused' and input_next_status in ('active', 'completed'))
    or (current_experiment.status = 'completed' and input_next_status = 'archived')
  ) then
    raise exception 'Ongeldige statusovergang.';
  end if;

  if input_next_status = 'active' then
    if current_experiment.target_type not in ('homepage', 'service_page', 'local_page', 'lead_funnel', 'cta', 'funnel_step')
      or current_experiment.slot !~ '^[a-z0-9_.]{3,100}$'
      or current_experiment.goal_event not in ('public_cta_click', 'lead_funnel_started', 'lead_submitted')
      or current_experiment.target_rules ?| array['h1', 'canonical', 'metadata', 'seo_body']
      or (current_experiment.target_rules ? 'page_type' and current_experiment.target_rules->>'page_type' not in ('homepage', 'core_public', 'service', 'subservice', 'service_city', 'subservice_city', 'province', 'lead_funnel', 'professional_landing', 'contact', 'costs'))
      or (current_experiment.target_rules ? 'route' and (
        current_experiment.target_rules->>'route' !~ '^/[a-z0-9_./-]{0,200}$'
        or position('//' in current_experiment.target_rules->>'route') > 0
        or char_length(regexp_replace(current_experiment.target_rules->>'route', '[^0-9]', '', 'g')) >= 7
      ))
      or (current_experiment.target_rules ? 'service_slug' and current_experiment.target_rules->>'service_slug' !~ '^[a-z0-9-]{1,80}$')
      or (current_experiment.target_rules ? 'city_slug' and current_experiment.target_rules->>'city_slug' !~ '^[a-z0-9-]{1,80}$')
      or (current_experiment.target_rules ? 'device_category' and current_experiment.target_rules->>'device_category' not in ('mobile', 'tablet', 'desktop'))
      or (current_experiment.target_rules ? 'referral_channel' and current_experiment.target_rules->>'referral_channel' not in ('organic', 'paid', 'direct', 'referral', 'unknown'))
      or (current_experiment.target_rules ? 'step_key' and current_experiment.target_rules->>'step_key' not in ('service', 'questions', 'location', 'details', 'photos', 'contact', 'review'))
      or (current_experiment.target_type = 'homepage' and current_experiment.target_rules->>'page_type' <> 'homepage')
      or (current_experiment.target_type = 'service_page' and current_experiment.target_rules->>'page_type' <> 'service')
      or (current_experiment.target_type = 'local_page' and current_experiment.target_rules->>'page_type' not in ('service_city', 'subservice_city', 'province'))
      or (current_experiment.target_type in ('lead_funnel', 'funnel_step') and current_experiment.target_rules->>'page_type' <> 'lead_funnel')
      or exists (
        select 1
        from jsonb_object_keys(current_experiment.target_rules) as rules(rule_key)
        where rules.rule_key not in ('page_type', 'route', 'service_slug', 'city_slug', 'device_category', 'referral_channel', 'step_key')
      ) then
      raise exception 'Experimenttarget is niet veilig of niet ondersteund.';
    end if;

    select count(*), count(*) filter (where is_control), coalesce(sum(weight), 0)
      into variant_count, control_count, total_weight
    from public.experiment_variants
    where experiment_id = input_experiment_id;

    if variant_count < 2 or control_count <> 1 or total_weight <> 100 then
      raise exception 'Een actief experiment vereist minimaal twee varianten, exact één control en gewichten van totaal 100.';
    end if;
  end if;

  update public.experiments
  set status = input_next_status,
      started_at = case when input_next_status = 'active' then coalesce(started_at, timezone('utc', now())) else started_at end,
      ended_at = case
        when input_next_status = 'completed' then timezone('utc', now())
        when input_next_status in ('active', 'paused') then null
        else ended_at
      end,
      updated_at = timezone('utc', now())
  where id = input_experiment_id;

  insert into public.experiment_audit_log (experiment_id, actor_user_id, previous_status, next_status)
  values (input_experiment_id, input_actor_user_id, current_experiment.status, input_next_status);
end;
$$;

revoke all on function public.transition_experiment_status(uuid, text, uuid) from public, anon, authenticated;
grant execute on function public.transition_experiment_status(uuid, text, uuid) to service_role;

alter table public.experiments enable row level security;
alter table public.experiment_variants enable row level security;
alter table public.experiment_assignments enable row level security;
alter table public.experiment_audit_log enable row level security;

create policy "admins read experiments" on public.experiments
  for select using (public.is_admin());
create policy "admins read experiment variants" on public.experiment_variants
  for select using (public.is_admin());
create policy "admins read experiment assignments" on public.experiment_assignments
  for select using (public.is_admin());
create policy "admins read experiment audit log" on public.experiment_audit_log
  for select using (public.is_admin());

grant select on public.experiments, public.experiment_variants, public.experiment_assignments, public.experiment_audit_log to authenticated;

insert into public.experiments (key, name, target_type, slot, target_rules, goal_event)
values
  ('homepage_cta_copy', 'Homepage hero CTA-copy', 'homepage', 'homepage.hero.cta', '{"page_type":"homepage","route":"/"}'::jsonb, 'lead_funnel_started'),
  ('funnel_progress_copy', 'Aanvraagvoortgang microcopy', 'lead_funnel', 'lead.progress.copy', '{"page_type":"lead_funnel","route":"/aanvraag"}'::jsonb, 'lead_submitted'),
  ('service_mid_cta_copy', 'Dakdekkerpagina mid-CTA-copy', 'service_page', 'service.mid_cta', '{"page_type":"service","service_slug":"dakdekker"}'::jsonb, 'lead_funnel_started');

insert into public.experiment_variants (experiment_id, key, label, weight, is_control)
select id, 'control', label, 50, true
from public.experiments
join (values
  ('homepage_cta_copy', 'Plaats je klus'),
  ('funnel_progress_copy', 'Stap {current} van {total}'),
  ('service_mid_cta_copy', 'Plaats je klus')
) as variants(experiment_key, label) on experiments.key = variants.experiment_key;

insert into public.experiment_variants (experiment_id, key, label, weight, is_control)
select id, 'variant_b', label, 50, false
from public.experiments
join (values
  ('homepage_cta_copy', 'Start je aanvraag'),
  ('funnel_progress_copy', 'Stap {current} van {total} — Vertel wat er moet gebeuren'),
  ('service_mid_cta_copy', 'Beschrijf je dakprobleem')
) as variants(experiment_key, label) on experiments.key = variants.experiment_key;

create or replace function public.analytics_metadata_is_safe(metadata jsonb)
returns boolean
language plpgsql
stable
as $$
declare
  entry record;
  nested jsonb;
  allowed_keys text[] := array[
    'schema_version', 'route', 'page_type', 'service', 'service_slug', 'service_id',
    'subservice', 'subservice_slug', 'city', 'city_slug', 'province_slug',
    'device_category', 'viewport_bucket', 'referral_channel', 'utm_source', 'utm_medium',
    'utm_campaign', 'first_touch_source', 'funnel_step', 'step_key', 'cta_id',
    'cta_location', 'question_id', 'jump_link_id', 'destination_type', 'error_type', 'duration_bucket', 'source_route', 'step',
    'source_page_type', 'experiment_id', 'experiment_key', 'variant_id', 'variant_key', 'experiment_slot',
    'step_count', 'question_count', 'answered_count', 'upload_count', 'viewed_count', 'completed_count',
    'click_count', 'started_count', 'submitted_count', 'dropped_count'
  ];
begin
  if metadata is null then
    return true;
  end if;

  if jsonb_typeof(metadata) <> 'object'
    or octet_length(metadata::text) > 4096
    or (select count(*) from jsonb_object_keys(metadata)) > 24 then
    return false;
  end if;

  for entry in select key, value from jsonb_each(metadata) loop
    if not (entry.key = any(allowed_keys))
      or jsonb_typeof(entry.value) = 'object' then
      return false;
    end if;

    if entry.key in ('route', 'source_route') and (
      jsonb_typeof(entry.value) <> 'string'
      or entry.value #>> '{}' !~ '^/[A-Za-z0-9_./-]{0,300}$'
      or position('//' in (entry.value #>> '{}')) > 0
      or char_length(regexp_replace(entry.value #>> '{}', '[^0-9]', '', 'g')) >= 7
    ) then
      return false;
    end if;

    if jsonb_typeof(entry.value) = 'string' and char_length(entry.value #>> '{}') > 120 then
      return false;
    end if;

    if entry.key in ('experiment_key', 'variant_key', 'experiment_slot')
      and (jsonb_typeof(entry.value) <> 'string' or entry.value #>> '{}' !~ '^[a-z0-9_.-]{2,100}$') then
      return false;
    end if;

    if entry.key in ('experiment_id', 'variant_id')
      and (jsonb_typeof(entry.value) <> 'string' or entry.value #>> '{}' !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$') then
      return false;
    end if;

    if jsonb_typeof(entry.value) = 'string'
      and entry.key not in ('service_id', 'experiment_id', 'variant_id')
      and (
        entry.value #>> '{}' ~* '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}'
        or char_length(regexp_replace(entry.value #>> '{}', '[^0-9]', '', 'g')) >= 7
      ) then
      return false;
    end if;

    if jsonb_typeof(entry.value) = 'array' then
      if jsonb_array_length(entry.value) > 10 then
        return false;
      end if;

      for nested in select value from jsonb_array_elements(entry.value) loop
        if jsonb_typeof(nested) in ('array', 'object')
          or (jsonb_typeof(nested) = 'string' and char_length(nested #>> '{}') > 120) then
          return false;
        end if;
        if jsonb_typeof(nested) = 'string' and (
          nested #>> '{}' ~* '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}'
          or char_length(regexp_replace(nested #>> '{}', '[^0-9]', '', 'g')) >= 7
        ) then
          return false;
        end if;
      end loop;
    end if;
  end loop;

  return true;
end;
$$;
