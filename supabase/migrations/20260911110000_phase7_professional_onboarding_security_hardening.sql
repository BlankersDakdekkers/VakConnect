create or replace function public.transition_own_professional_onboarding(
  target_step professional_onboarding_step,
  submit_for_review boolean default false
)
returns table (
  professional_id uuid,
  onboarding_status professional_onboarding_status,
  onboarding_step professional_onboarding_step,
  submitted_for_review_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  current_professional public.professionals%rowtype;
  current_index integer;
  requested_index integer;
  resolved_step professional_onboarding_step;
  resolved_status professional_onboarding_status;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
  into current_professional
  from public.professionals
  where id = public.current_professional_id()
    and auth_user_id = auth.uid()
  for update;

  if current_professional.id is null then
    raise exception 'PROFESSIONAL_NOT_FOUND';
  end if;

  if current_professional.status = 'suspended'
    or current_professional.verification_status in ('rejected', 'suspended')
  then
    raise exception 'ONBOARDING_TRANSITION_FORBIDDEN';
  end if;

  current_index := array_position(enum_range(null::professional_onboarding_step)::text[], current_professional.onboarding_step::text);
  requested_index := array_position(enum_range(null::professional_onboarding_step)::text[], target_step::text);
  resolved_step := target_step;

  if submit_for_review then
    if target_step <> 'review' then
      raise exception 'INVALID_ONBOARDING_SUBMIT_TARGET';
    end if;

    if current_professional.onboarding_status not in ('in_progress', 'changes_requested') then
      raise exception 'INVALID_ONBOARDING_SUBMIT_STATE';
    end if;

    update public.professionals as p
      set onboarding_status = 'submitted',
          onboarding_step = 'review',
          onboarding_started_at = coalesce(p.onboarding_started_at, timezone('utc', now())),
          submitted_for_review_at = timezone('utc', now()),
          verification_status = case
            when p.verification_status = 'verified' then p.verification_status
            else 'pending'
          end,
          updated_at = timezone('utc', now())
    where p.id = current_professional.id
    returning p.id, p.onboarding_status, p.onboarding_step, p.submitted_for_review_at
    into professional_id, onboarding_status, onboarding_step, submitted_for_review_at;

    return next;
  end if;

  if current_professional.onboarding_status in ('approved', 'submitted', 'rejected') then
    raise exception 'INVALID_ONBOARDING_TRANSITION_STATE';
  end if;

  if requested_index is null then
    raise exception 'INVALID_ONBOARDING_STEP';
  end if;

  if current_index is not null then
    if requested_index < current_index then
      resolved_step := current_professional.onboarding_step;
    elsif requested_index > current_index + 1 then
      raise exception 'INVALID_ONBOARDING_STEP_TRANSITION';
    end if;
  end if;

  resolved_status := case
    when current_professional.onboarding_status in ('not_started', 'changes_requested') then 'in_progress'
    else current_professional.onboarding_status
  end;

  update public.professionals as p
    set onboarding_status = resolved_status,
        onboarding_step = resolved_step,
        onboarding_started_at = coalesce(p.onboarding_started_at, timezone('utc', now())),
        submitted_for_review_at = case
          when current_professional.onboarding_status = 'changes_requested' then null
          else p.submitted_for_review_at
        end,
        updated_at = timezone('utc', now())
  where p.id = current_professional.id
  returning p.id, p.onboarding_status, p.onboarding_step, p.submitted_for_review_at
  into professional_id, onboarding_status, onboarding_step, submitted_for_review_at;

  return next;
end;
$$;

create or replace function public.delete_own_pending_professional_document(
  target_document_id uuid
)
returns text
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  current_professional_id uuid;
  target_document public.professional_documents%rowtype;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  current_professional_id := public.current_professional_id();

  if current_professional_id is null then
    raise exception 'PROFESSIONAL_NOT_FOUND';
  end if;

  select *
  into target_document
  from public.professional_documents
  where id = target_document_id
    and professional_id = current_professional_id
  for update;

  if target_document.id is null then
    raise exception 'DOCUMENT_NOT_FOUND';
  end if;

  if target_document.verification_status not in ('pending', 'rejected') then
    raise exception 'DOCUMENT_DELETE_FORBIDDEN';
  end if;

  delete from public.professional_documents
  where id = target_document.id
    and professional_id = current_professional_id;

  return target_document.storage_path;
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
    or new.onboarding_step <> old.onboarding_step
    or new.onboarding_completion <> old.onboarding_completion
    or new.onboarding_started_at is distinct from old.onboarding_started_at
    or new.onboarding_completed_at is distinct from old.onboarding_completed_at
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

  return new;
end;
$$;

drop policy if exists "professionals delete own pending documents" on public.professional_documents;
drop policy if exists "professionals delete own professional document storage" on storage.objects;

revoke all on function public.append_professional_audit_log(uuid, uuid, professional_audit_event_type, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.enqueue_professional_notification(uuid, professional_notification_event_type, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.touch_professional_verification_on_document_change() from public, anon, authenticated, service_role;
revoke all on function public.track_professional_audit_after_change() from public, anon, authenticated, service_role;
revoke all on function public.track_professional_document_audit_after_change() from public, anon, authenticated, service_role;
revoke all on function public.transition_own_professional_onboarding(professional_onboarding_step, boolean) from public, anon, authenticated, service_role;
revoke all on function public.delete_own_pending_professional_document(uuid) from public, anon, authenticated, service_role;

grant execute on function public.transition_own_professional_onboarding(professional_onboarding_step, boolean) to authenticated, service_role;
grant execute on function public.delete_own_pending_professional_document(uuid) to authenticated, service_role;
