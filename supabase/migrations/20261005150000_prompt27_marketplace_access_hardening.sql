-- Purchased assignments must not become legacy/direct access after a refund.
create or replace function public.can_professional_view_lead_contact(
  target_lead_id uuid,
  target_professional_id uuid default public.current_professional_id()
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.lead_purchases lp
    where lp.lead_id = target_lead_id
      and lp.professional_id = target_professional_id
      and lp.status = 'purchased'
  ) or exists (
    select 1
    from public.lead_assignments la
    where la.lead_id = target_lead_id
      and la.professional_id = target_professional_id
      and la.status = 'accepted'
      and la.lead_purchase_id is null
      and not exists (
        select 1
        from public.lead_purchases lp
        where lp.lead_id = target_lead_id
          and lp.professional_id = target_professional_id
      )
  );
$$;

create or replace function public.enforce_assignment_access_immutability()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if public.is_admin() or auth.role() = 'service_role' or current_user = 'postgres' then
    return new;
  end if;

  if new.id is distinct from old.id
    or new.lead_id is distinct from old.lead_id
    or new.professional_id is distinct from old.professional_id
    or new.lead_purchase_id is distinct from old.lead_purchase_id
  then
    raise exception 'ASSIGNMENT_ACCESS_IMMUTABLE';
  end if;

  return new;
end;
$$;

create trigger enforce_assignment_access_immutability
before update on public.lead_assignments
for each row execute function public.enforce_assignment_access_immutability();

revoke all on function public.enforce_assignment_access_immutability() from public;

-- Preserve undistributed legacy leads; a historical run never bypasses expiry.
create or replace function public.enforce_active_offer_for_purchase()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  active_run_id uuid;
  active_candidate_id uuid;
begin
  select r.id
  into active_run_id
  from public.lead_distribution_runs r
  where r.lead_id = new.lead_id
    and r.status in ('pending', 'active')
  order by r.created_at desc
  limit 1;

  if active_run_id is null then
    if exists (select 1 from public.lead_distribution_runs r where r.lead_id = new.lead_id) then
      raise exception 'LEAD_OFFER_NOT_ACTIVE';
    end if;
    return new;
  end if;

  select c.id
  into active_candidate_id
  from public.lead_distribution_candidates c
  where c.lead_id = new.lead_id
    and c.professional_id = new.professional_id
    and c.distribution_run_id = active_run_id
    and c.status in ('offered', 'viewed')
    and (c.offer_expires_at is null or c.offer_expires_at > timezone('utc', now()))
  for update;

  if active_candidate_id is null then
    raise exception 'LEAD_OFFER_NOT_ACTIVE';
  end if;

  return new;
end;
$$;
