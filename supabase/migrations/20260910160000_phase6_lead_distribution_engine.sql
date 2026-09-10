do $$ begin
  if not exists (select 1 from pg_type where typname = 'lead_distribution_run_status') then
    create type lead_distribution_run_status as enum ('pending', 'active', 'completed', 'cancelled', 'exhausted');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_distribution_candidate_status') then
    create type lead_distribution_candidate_status as enum ('queued', 'offered', 'viewed', 'declined', 'expired', 'purchased', 'skipped');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_enum where enumlabel = 'distribution_started' and enumtypid = 'lead_activity_type'::regtype) then
    alter type lead_activity_type add value 'distribution_started';
  end if;
  if not exists (select 1 from pg_enum where enumlabel = 'candidate_offered' and enumtypid = 'lead_activity_type'::regtype) then
    alter type lead_activity_type add value 'candidate_offered';
  end if;
  if not exists (select 1 from pg_enum where enumlabel = 'candidate_skipped' and enumtypid = 'lead_activity_type'::regtype) then
    alter type lead_activity_type add value 'candidate_skipped';
  end if;
  if not exists (select 1 from pg_enum where enumlabel = 'candidate_declined' and enumtypid = 'lead_activity_type'::regtype) then
    alter type lead_activity_type add value 'candidate_declined';
  end if;
  if not exists (select 1 from pg_enum where enumlabel = 'candidate_expired' and enumtypid = 'lead_activity_type'::regtype) then
    alter type lead_activity_type add value 'candidate_expired';
  end if;
  if not exists (select 1 from pg_enum where enumlabel = 'distribution_exhausted' and enumtypid = 'lead_activity_type'::regtype) then
    alter type lead_activity_type add value 'distribution_exhausted';
  end if;
  if not exists (select 1 from pg_enum where enumlabel = 'distribution_admin_override' and enumtypid = 'lead_activity_type'::regtype) then
    alter type lead_activity_type add value 'distribution_admin_override';
  end if;
end
$$;

create table if not exists public.lead_distribution_runs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  commercial_type lead_commercial_type not null,
  status lead_distribution_run_status not null default 'pending',
  strategy_version text not null default 'v1' check (char_length(trim(strategy_version)) between 2 and 24),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lead_distribution_candidates (
  id uuid primary key default gen_random_uuid(),
  distribution_run_id uuid not null references public.lead_distribution_runs(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  rank_position integer not null check (rank_position > 0),
  ranking_score integer not null check (ranking_score between 0 and 100),
  score_breakdown jsonb not null default '{}'::jsonb,
  eligibility_reason jsonb not null default '{}'::jsonb,
  status lead_distribution_candidate_status not null default 'queued',
  offered_at timestamptz,
  offer_expires_at timestamptz,
  viewed_at timestamptz,
  skipped_at timestamptz,
  declined_at timestamptz,
  purchased_at timestamptz,
  decline_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (distribution_run_id, professional_id),
  check (jsonb_typeof(score_breakdown) = 'object'),
  check (jsonb_typeof(eligibility_reason) = 'object')
);

create table if not exists public.professional_distribution_settings (
  professional_id uuid primary key references public.professionals(id) on delete cascade,
  max_open_offers integer not null default 5 check (max_open_offers between 1 and 50),
  max_active_assignments integer not null default 12 check (max_active_assignments between 1 and 200),
  paused boolean not null default false,
  pause_until timestamptz,
  preferred_lead_types jsonb not null default '[]'::jsonb,
  auto_accept_enabled boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (jsonb_typeof(preferred_lead_types) = 'array')
);

create index if not exists lead_distribution_runs_lead_status_idx on public.lead_distribution_runs (lead_id, status, created_at desc);
create unique index if not exists lead_distribution_one_active_run_idx
  on public.lead_distribution_runs (lead_id)
  where status in ('pending', 'active');
create index if not exists lead_distribution_candidates_run_rank_idx on public.lead_distribution_candidates (distribution_run_id, rank_position);
create index if not exists lead_distribution_candidates_professional_status_idx on public.lead_distribution_candidates (professional_id, status, offer_expires_at);
create index if not exists lead_distribution_candidates_lead_status_idx on public.lead_distribution_candidates (lead_id, status);
create unique index if not exists lead_distribution_no_duplicate_live_offer_idx
  on public.lead_distribution_candidates (lead_id, professional_id)
  where status in ('offered', 'viewed');

create trigger set_professional_distribution_settings_updated_at
before update on public.professional_distribution_settings
for each row execute function public.set_updated_at();

create or replace function public.enforce_distribution_candidate_update()
returns trigger
language plpgsql
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if old.professional_id <> public.current_professional_id() then
    raise exception 'UNAUTHORIZED_DISTRIBUTION_CANDIDATE';
  end if;

  if new.distribution_run_id <> old.distribution_run_id
    or new.lead_id <> old.lead_id
    or new.professional_id <> old.professional_id
    or new.rank_position <> old.rank_position
    or new.ranking_score <> old.ranking_score
    or new.score_breakdown <> old.score_breakdown
    or new.eligibility_reason <> old.eligibility_reason
    or new.offered_at is distinct from old.offered_at
    or new.offer_expires_at is distinct from old.offer_expires_at
    or new.skipped_at is distinct from old.skipped_at
    or new.purchased_at is distinct from old.purchased_at
  then
    raise exception 'DISTRIBUTION_CANDIDATE_IMMUTABLE_FIELDS';
  end if;

  if old.status in ('declined', 'expired', 'purchased', 'skipped') then
    raise exception 'DISTRIBUTION_CANDIDATE_LOCKED';
  end if;

  if old.status = 'offered' and new.status not in ('viewed', 'declined') then
    raise exception 'INVALID_DISTRIBUTION_STATUS_TRANSITION';
  end if;

  if old.status = 'viewed' and new.status not in ('declined', 'viewed') then
    raise exception 'INVALID_DISTRIBUTION_STATUS_TRANSITION';
  end if;

  if new.status = 'viewed' then
    new.viewed_at := coalesce(new.viewed_at, timezone('utc', now()));
  end if;

  if new.status = 'declined' then
    if coalesce(char_length(trim(new.decline_reason)), 0) = 0 then
      raise exception 'DECLINE_REASON_REQUIRED';
    end if;
    new.declined_at := coalesce(new.declined_at, timezone('utc', now()));
  end if;

  return new;
end;
$$;

create trigger enforce_distribution_candidate_update
before update on public.lead_distribution_candidates
for each row execute function public.enforce_distribution_candidate_update();

create or replace function public.enforce_active_offer_for_purchase()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  has_distribution_candidates boolean;
  has_active_offer boolean;
begin
  select exists (
    select 1
    from public.lead_distribution_candidates c
    where c.lead_id = new.lead_id
  ) into has_distribution_candidates;

  if not has_distribution_candidates then
    return new;
  end if;

  select exists (
    select 1
    from public.lead_distribution_candidates c
    where c.lead_id = new.lead_id
      and c.professional_id = new.professional_id
      and c.status in ('offered', 'viewed', 'purchased')
      and (c.offer_expires_at is null or c.offer_expires_at >= timezone('utc', now()))
  ) into has_active_offer;

  if not has_active_offer then
    raise exception 'LEAD_OFFER_NOT_ACTIVE';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_active_offer_for_purchase on public.lead_purchases;
create trigger enforce_active_offer_for_purchase
before insert on public.lead_purchases
for each row execute function public.enforce_active_offer_for_purchase();

create or replace function public.sync_distribution_after_purchase()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  run_row record;
  lead_row record;
  purchased_count integer;
  should_close boolean := false;
begin
  if new.status <> 'purchased' then
    return new;
  end if;

  select *
  into run_row
  from public.lead_distribution_runs
  where lead_id = new.lead_id
    and status in ('pending', 'active')
  order by created_at desc
  limit 1;

  if run_row is null then
    return new;
  end if;

  update public.lead_distribution_candidates
  set status = 'purchased',
      purchased_at = coalesce(purchased_at, new.purchased_at)
  where distribution_run_id = run_row.id
    and professional_id = new.professional_id
    and status in ('offered', 'viewed', 'queued', 'purchased');

  select commercial_type, max_buyers
  into lead_row
  from public.leads
  where id = new.lead_id;

  select count(*)::integer
  into purchased_count
  from public.lead_purchases
  where lead_id = new.lead_id
    and status = 'purchased';

  should_close := lead_row.commercial_type = 'exclusive' or purchased_count >= lead_row.max_buyers;

  if should_close then
    update public.lead_distribution_candidates
    set status = 'skipped',
        skipped_at = coalesce(skipped_at, timezone('utc', now()))
    where distribution_run_id = run_row.id
      and professional_id <> new.professional_id
      and status in ('queued', 'offered', 'viewed');

    update public.lead_distribution_runs
    set status = 'completed',
        completed_at = timezone('utc', now())
    where id = run_row.id;
  else
    update public.lead_distribution_runs
    set status = 'active'
    where id = run_row.id
      and status = 'pending';
  end if;

  return new;
end;
$$;

drop trigger if exists sync_distribution_after_purchase on public.lead_purchases;
create trigger sync_distribution_after_purchase
after insert on public.lead_purchases
for each row execute function public.sync_distribution_after_purchase();

alter table public.lead_distribution_runs enable row level security;
alter table public.lead_distribution_candidates enable row level security;
alter table public.professional_distribution_settings enable row level security;

create policy "admins manage distribution runs"
  on public.lead_distribution_runs
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals read own distribution runs"
  on public.lead_distribution_runs
  for select
  using (
    exists (
      select 1
      from public.lead_distribution_candidates c
      where c.distribution_run_id = lead_distribution_runs.id
        and c.professional_id = public.current_professional_id()
    )
  );

create policy "admins manage distribution candidates"
  on public.lead_distribution_candidates
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals read own distribution candidates"
  on public.lead_distribution_candidates
  for select
  using (professional_id = public.current_professional_id());

create policy "professionals update own distribution candidates"
  on public.lead_distribution_candidates
  for update
  using (professional_id = public.current_professional_id())
  with check (professional_id = public.current_professional_id());

create policy "admins manage distribution settings"
  on public.professional_distribution_settings
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals read own distribution settings"
  on public.professional_distribution_settings
  for select
  using (professional_id = public.current_professional_id());

create policy "professionals manage own distribution settings"
  on public.professional_distribution_settings
  for all
  using (professional_id = public.current_professional_id())
  with check (professional_id = public.current_professional_id());

revoke all on function public.enforce_active_offer_for_purchase() from public;
revoke all on function public.sync_distribution_after_purchase() from public;
