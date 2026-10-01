create index if not exists professional_notification_events_inbox_page_idx
  on public.professional_notification_events (professional_id, read_at, created_at desc)
  where status = 'delivered' and channel_type = 'in_app';
create index if not exists professional_documents_expiry_queue_idx
  on public.professional_documents (expires_at, id)
  where archived_at is null and expires_at is not null;
create index if not exists professionals_review_sla_queue_idx
  on public.professionals (submitted_for_review_at, id)
  where onboarding_status = 'submitted' and submitted_for_review_at is not null;
create index if not exists professional_review_feedback_open_sla_idx
  on public.professional_review_feedback (created_at, professional_id)
  where status = 'open';
create index if not exists operational_worker_runs_status_started_idx
  on public.operational_worker_runs (status, started_at desc);
create index if not exists lead_distribution_candidates_expiry_queue_idx
  on public.lead_distribution_candidates (offer_expires_at, id)
  where status in ('offered', 'viewed');

drop policy if exists "admins update system notification read state" on public.professional_notification_events;
create policy "admins update system notification read state"
  on public.professional_notification_events
  for update
  using (public.is_admin() and professional_id is null and channel_type = 'system' and status = 'delivered')
  with check (public.is_admin() and professional_id is null and channel_type = 'system' and status = 'delivered');

create or replace function public.notify_distribution_candidate_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status = 'offered'
    and (tg_op = 'INSERT' or old.status is distinct from new.status)
    and not exists (
      select 1
      from public.professional_notification_preferences preference
      where preference.professional_id = new.professional_id
        and (not preference.in_app_enabled or not preference.lead_offer_notifications)
    ) then
    insert into public.professional_notification_events (
      professional_id,
      lead_id,
      event_type,
      channel_type,
      payload,
      status,
      processed_at,
      deduplication_key
    ) values (
      new.professional_id,
      new.lead_id,
      'lead_offer_received',
      'in_app',
      '{"title":"Nieuw lead offer","description":"Er staat een nieuw aanbod voor je klaar.","href":"/vakman/aanvragen"}'::jsonb,
      'delivered',
      timezone('utc', now()),
      'lead-offer-received:' || new.id::text
    )
    on conflict (deduplication_key) where deduplication_key is not null do nothing;
  end if;

  if new.status = 'expired'
    and (tg_op = 'INSERT' or old.status is distinct from new.status)
    and new.expired_at is not null
    and not exists (
      select 1
      from public.professional_notification_preferences preference
      where preference.professional_id = new.professional_id
        and (not preference.in_app_enabled or not preference.lead_offer_notifications)
    ) then
    insert into public.professional_notification_events (
      professional_id,
      lead_id,
      event_type,
      channel_type,
      payload,
      status,
      processed_at,
      deduplication_key
    ) values (
      new.professional_id,
      new.lead_id,
      'lead_offer_expired',
      'in_app',
      '{"title":"Lead offer verlopen","description":"De reactietermijn voor dit aanbod is verstreken.","href":"/vakman/aanvragen"}'::jsonb,
      'delivered',
      timezone('utc', now()),
      'lead-offer-expired:' || new.id::text
    )
    on conflict (deduplication_key) where deduplication_key is not null do nothing;
  end if;

  return new;
end;
$$;

create trigger notify_distribution_candidate_lifecycle
  after insert or update of status on public.lead_distribution_candidates
  for each row execute function public.notify_distribution_candidate_lifecycle();

create or replace function public.notify_lead_assignment_created()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not exists (
    select 1
    from public.professional_notification_preferences preference
    where preference.professional_id = new.professional_id
      and (not preference.in_app_enabled or not preference.lead_offer_notifications)
  ) then
    insert into public.professional_notification_events (
      professional_id,
      lead_id,
      event_type,
      channel_type,
      payload,
      status,
      processed_at,
      deduplication_key
    ) values (
      new.professional_id,
      new.lead_id,
      'lead_assignment_created',
      'in_app',
      '{"title":"Nieuwe opdracht","description":"Er staat een nieuwe leadopdracht voor je klaar.","href":"/vakman/aanvragen"}'::jsonb,
      'delivered',
      timezone('utc', now()),
      'lead-assignment-created:' || new.id::text
    )
    on conflict (deduplication_key) where deduplication_key is not null do nothing;
  end if;
  return new;
end;
$$;

create trigger notify_lead_assignment_created
  after insert on public.lead_assignments
  for each row execute function public.notify_lead_assignment_created();

create or replace function public.notify_distribution_run_exhausted()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status = 'exhausted'
    and (tg_op = 'INSERT' or old.status is distinct from new.status) then
    insert into public.professional_notification_events (
      lead_id,
      event_type,
      channel_type,
      payload,
      status,
      processed_at,
      deduplication_key
    ) values (
      new.lead_id,
      'distribution_exhausted',
      'system',
      jsonb_build_object(
        'title', 'Distributie uitgeput',
        'description', 'Een distributierun heeft geen geschikte kandidaten meer.',
        'href', '/admin/leads/' || new.lead_id::text
      ),
      'delivered',
      timezone('utc', now()),
      'distribution-exhausted:' || new.id::text
    )
    on conflict (deduplication_key) where deduplication_key is not null do nothing;
  end if;
  return new;
end;
$$;

create trigger notify_distribution_run_exhausted
  after insert or update of status on public.lead_distribution_runs
  for each row execute function public.notify_distribution_run_exhausted();

create or replace function public.resolve_professional_review_feedback_on_status_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.onboarding_status = 'changes_requested'
    and new.onboarding_status is distinct from old.onboarding_status then
    update public.professional_review_feedback
    set status = 'resolved',
        resolved_at = timezone('utc', now())
    where professional_id = new.id
      and status = 'open';
  end if;
  return new;
end;
$$;

create trigger resolve_professional_review_feedback_on_status_change
  after update of onboarding_status on public.professionals
  for each row execute function public.resolve_professional_review_feedback_on_status_change();

revoke all on function public.notify_distribution_candidate_lifecycle() from public, anon, authenticated, service_role;
revoke all on function public.notify_lead_assignment_created() from public, anon, authenticated, service_role;
revoke all on function public.notify_distribution_run_exhausted() from public, anon, authenticated, service_role;
revoke all on function public.resolve_professional_review_feedback_on_status_change() from public, anon, authenticated, service_role;
