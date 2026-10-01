-- Prompt 11 post-merge hardening:
-- * onboarding submit returns exactly once (no fall-through into the step transition)
-- * null-safe self-update guard for professionals
-- * document metadata must reference a storage path owned by the same professional/document
-- * professionals cannot self-approve documents or rebind document metadata
-- * least-privilege execution for trigger-only helpers

create or replace function public.professional_document_storage_path_is_owned(target_path text, target_professional_id uuid)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select coalesce(
    target_path is not null
      and target_professional_id is not null
      and position('..' in target_path) = 0
      and target_path ~ (
        '^professionals/' || target_professional_id::text
        || '/documents/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[A-Za-z0-9._-]+$'
      ),
    false
  );
$$;

create or replace function public.professional_document_record_path_is_owned(
  target_path text,
  target_professional_id uuid,
  target_document_id uuid
)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select coalesce(
    target_document_id is not null
      and public.professional_document_storage_path_is_owned(target_path, target_professional_id)
      and starts_with(
        target_path,
        'professionals/' || target_professional_id::text || '/documents/' || target_document_id::text || '/'
      ),
    false
  );
$$;

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

  if target_step is null then
    raise exception 'INVALID_ONBOARDING_STEP';
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

  if coalesce(submit_for_review, false) then
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
    return;
  end if;

  if current_professional.onboarding_status in ('approved', 'submitted', 'rejected') then
    raise exception 'INVALID_ONBOARDING_TRANSITION_STATE';
  end if;

  current_index := array_position(enum_range(null::professional_onboarding_step)::text[], current_professional.onboarding_step::text);
  requested_index := array_position(enum_range(null::professional_onboarding_step)::text[], target_step::text);
  resolved_step := target_step;

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
  return;
end;
$$;

create or replace function public.enforce_professional_self_update()
returns trigger
language plpgsql
set search_path = public, auth, pg_temp
as $$
declare
  critical_change boolean := false;
begin
  if public.is_admin() or auth.role() = 'service_role' or current_user = 'postgres' then
    return new;
  end if;

  if auth.uid() is null or old.auth_user_id is null or old.auth_user_id is distinct from auth.uid() then
    raise exception 'UNAUTHORIZED_PROFESSIONAL_UPDATE';
  end if;

  if new.id is distinct from old.id
    or new.auth_user_id is distinct from old.auth_user_id
    or new.email is distinct from old.email
    or new.status is distinct from old.status
    or new.quality_score is distinct from old.quality_score
    or new.quality_breakdown is distinct from old.quality_breakdown
    or new.verification_status is distinct from old.verification_status
    or new.verification_status_reason is distinct from old.verification_status_reason
    or new.onboarding_status is distinct from old.onboarding_status
    or new.onboarding_step is distinct from old.onboarding_step
    or new.onboarding_completion is distinct from old.onboarding_completion
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

create or replace function public.enforce_professional_document_integrity()
returns trigger
language plpgsql
set search_path = public, auth, pg_temp
as $$
declare
  privileged boolean := public.is_admin() or auth.role() = 'service_role' or current_user = 'postgres';
begin
  if tg_op = 'UPDATE' then
    if new.id is distinct from old.id
      or new.professional_id is distinct from old.professional_id
      or new.storage_path is distinct from old.storage_path
    then
      raise exception 'PROFESSIONAL_DOCUMENT_BINDING_IMMUTABLE';
    end if;
  elsif not public.professional_document_record_path_is_owned(new.storage_path, new.professional_id, new.id) then
    raise exception 'PROFESSIONAL_DOCUMENT_PATH_NOT_OWNED';
  end if;

  if privileged then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.verification_status is distinct from 'pending'
      or new.rejection_reason is not null
      or new.reviewed_at is not null
      or new.reviewed_by is not null
      or new.archived_at is not null
      or new.superseded_by_document_id is not null
    then
      raise exception 'PROFESSIONAL_DOCUMENT_REVIEW_FIELDS_IMMUTABLE';
    end if;
    return new;
  end if;

  if new.verification_status is distinct from old.verification_status
    or new.rejection_reason is distinct from old.rejection_reason
    or new.reviewed_at is distinct from old.reviewed_at
    or new.reviewed_by is distinct from old.reviewed_by
    or new.document_type is distinct from old.document_type
    or new.expires_at is distinct from old.expires_at
  then
    raise exception 'PROFESSIONAL_DOCUMENT_REVIEW_FIELDS_IMMUTABLE';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_professional_document_integrity on public.professional_documents;
create trigger enforce_professional_document_integrity
before insert or update on public.professional_documents
for each row execute function public.enforce_professional_document_integrity();

drop policy if exists "professionals upload own document metadata" on public.professional_documents;
create policy "professionals upload own document metadata"
  on public.professional_documents
  for insert
  with check (
    professional_id = public.current_professional_id()
    and verification_status = 'pending'
    and public.professional_document_record_path_is_owned(storage_path, professional_id, id)
  );

drop policy if exists "professionals delete own pending documents" on public.professional_documents;
drop policy if exists "professionals delete own professional document storage" on storage.objects;

revoke all on function public.professional_document_storage_path_is_owned(text, uuid) from public, anon;
revoke all on function public.professional_document_record_path_is_owned(text, uuid, uuid) from public, anon;
grant execute on function public.professional_document_storage_path_is_owned(text, uuid) to authenticated, service_role;
grant execute on function public.professional_document_record_path_is_owned(text, uuid, uuid) to authenticated, service_role;

revoke all on function public.enforce_professional_self_update() from public, anon, authenticated, service_role;
revoke all on function public.protect_professional_document_delete() from public, anon, authenticated, service_role;
revoke all on function public.enforce_professional_document_integrity() from public, anon, authenticated, service_role;
revoke all on function public.touch_professional_verification_on_document_change() from public, anon, authenticated, service_role;
revoke all on function public.track_professional_audit_after_change() from public, anon, authenticated, service_role;
revoke all on function public.track_professional_document_audit_after_change() from public, anon, authenticated, service_role;
revoke all on function public.append_professional_audit_log(uuid, uuid, professional_audit_event_type, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.enqueue_professional_notification(uuid, professional_notification_event_type, jsonb) from public, anon, authenticated, service_role;

revoke all on function public.transition_own_professional_onboarding(professional_onboarding_step, boolean) from public, anon;
revoke all on function public.delete_own_pending_professional_document(uuid) from public, anon;
grant execute on function public.transition_own_professional_onboarding(professional_onboarding_step, boolean) to authenticated, service_role;
grant execute on function public.delete_own_pending_professional_document(uuid) to authenticated, service_role;
