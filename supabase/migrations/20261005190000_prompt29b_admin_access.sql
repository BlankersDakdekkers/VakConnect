-- Keep Supabase Auth metadata authoritative, including for already-issued JWTs.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.role() = 'authenticated' and exists (
    select 1 from auth.users
    where id = auth.uid() and raw_app_meta_data ->> 'role' = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon, authenticated, service_role;
-- Public read policies also call this helper; anonymous callers only receive false.
grant execute on function public.is_admin() to anon, authenticated, service_role;

alter policy "admins manage seo audit log" on public.seo_audit_log
  using (public.is_admin())
  with check (public.is_admin());

-- Worker mutations remain service-only; their distribution behavior is unchanged.
revoke execute on function public.claim_expired_distribution_candidates(integer) from public, anon, authenticated;
grant execute on function public.claim_expired_distribution_candidates(integer) to service_role;
revoke execute on function public.activate_lead_distribution_run(uuid, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.activate_lead_distribution_run(uuid, integer, integer, integer) to service_role;

create table public.admin_role_audit (
  id uuid primary key default gen_random_uuid(),
  target_user_id uuid not null,
  actor text not null,
  action text not null check (action in ('admin_granted', 'admin_revoked')),
  created_at timestamptz not null default now()
);

alter table public.admin_role_audit enable row level security;
revoke all on public.admin_role_audit from public, anon, authenticated, service_role;
grant select on public.admin_role_audit to authenticated, service_role;
create policy "admins read role audit" on public.admin_role_audit
  for select to authenticated using (public.is_admin());

create function public.audit_admin_role_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  was_admin boolean := false;
  now_admin boolean := coalesce(new.raw_app_meta_data ->> 'role' = 'admin', false);
begin
  if tg_op = 'UPDATE' then
    was_admin := coalesce(old.raw_app_meta_data ->> 'role' = 'admin', false);
  end if;
  if was_admin is distinct from now_admin then
    insert into public.admin_role_audit (target_user_id, actor, action)
    values (new.id, 'system:' || session_user,
      case when now_admin then 'admin_granted' else 'admin_revoked' end);
  end if;
  return new;
end;
$$;

revoke all on function public.audit_admin_role_change() from public, anon, authenticated, service_role;
create trigger audit_admin_role_change
  after insert or update of raw_app_meta_data on auth.users
  for each row execute function public.audit_admin_role_change();
