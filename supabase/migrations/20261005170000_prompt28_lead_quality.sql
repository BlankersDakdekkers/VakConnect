-- Assignment outcomes are professional-specific, never a global lead outcome.
alter table public.lead_assignments
  add column contacted_at timestamptz,
  add column reached_at timestamptz,
  add column appointment_scheduled_at timestamptz,
  add column outcome_at timestamptz,
  add column reachability text,
  add column appointment_status text not null default 'not_scheduled',
  add column mismatch_reason text,
  add column feedback_note text,
  add column quality_updated_at timestamptz not null default now(),
  add column quality_updated_by uuid references auth.users(id);

alter table public.lead_assignments
  add constraint assignment_reachability_values check (
    reachability is null or reachability in ('reached', 'no_answer', 'invalid_phone', 'invalid_email', 'unreachable_other')
  ),
  add constraint assignment_appointment_values check (
    appointment_status in ('not_scheduled', 'scheduled', 'completed', 'cancelled')
  ),
  add constraint assignment_loss_values check (
    loss_reason is null or loss_reason in (
      'prijs', 'klant_niet_bereikbaar', 'klant_koos_andere_partij', 'klus_uitgesteld', 'buiten_scope', 'anders',
      'duplicate', 'already_completed', 'wrong_service', 'wrong_region', 'invalid_contact'
    )
  ) not valid,
  add constraint assignment_mismatch_values check (
    mismatch_reason is null or mismatch_reason in (
      'wrong_service', 'wrong_region', 'incorrect_information', 'already_completed', 'duplicate',
      'unreachable', 'invalid_contact', 'profile_mismatch', 'other'
    )
  ),
  add constraint assignment_feedback_note check (
    feedback_note is null or (
      char_length(feedback_note) between 1 and 500
      and coalesce(mismatch_reason = 'other' or loss_reason = 'anders', false)
    )
  );

create or replace function public.is_valid_lead_progress_transition(current_status lead_progress_status, next_status lead_progress_status)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select case
    when current_status = next_status then true
    when current_status = 'new' and next_status = 'contacted' then true
    when current_status = 'contacted' and next_status in ('appointment_scheduled', 'lost') then true
    when current_status = 'appointment_scheduled' and next_status in ('quote_sent', 'lost') then true
    when current_status = 'quote_sent' and next_status in ('won', 'lost') then true
    else false
  end;
$$;

-- Invoker trigger: no privileged-role bypass for quality data or actor attribution.
-- Existing access, progress, financial and notification triggers remain enabled.
create function public.enforce_assignment_quality()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  quality_changed boolean;
  rejection_feedback boolean;
  event_time timestamptz;
begin
  if tg_op = 'INSERT' then
    if new.contacted_at is not null or new.reached_at is not null
      or new.appointment_scheduled_at is not null or new.outcome_at is not null
      or new.quality_updated_by is not null or new.quality_updated_at is distinct from now()
      or new.reachability is not null or new.appointment_status <> 'not_scheduled'
      or new.mismatch_reason is not null or new.feedback_note is not null
      or new.progress_status <> 'new' or new.loss_reason is not null
    then
      raise exception 'QUALITY_INSERT_FORBIDDEN';
    end if;
    return new;
  end if;

  if new.contacted_at is distinct from old.contacted_at
    or new.reached_at is distinct from old.reached_at
    or new.appointment_scheduled_at is distinct from old.appointment_scheduled_at
    or new.outcome_at is distinct from old.outcome_at
    or new.quality_updated_at is distinct from old.quality_updated_at
    or new.quality_updated_by is distinct from old.quality_updated_by
    or (new.progress_updated_at is distinct from old.progress_updated_at
      and old.status = 'accepted')
  then
    raise exception 'QUALITY_SERVER_FIELDS_IMMUTABLE';
  end if;

  quality_changed := row(new.progress_status, new.reachability, new.appointment_status,
    new.loss_reason, new.mismatch_reason, new.feedback_note)
    is distinct from row(old.progress_status, old.reachability, old.appointment_status,
    old.loss_reason, old.mismatch_reason, old.feedback_note);
  if not quality_changed then
    return new;
  end if;

  if auth.uid() is null or (not public.is_admin()
    and old.professional_id is distinct from public.current_professional_id())
    or new.professional_id is distinct from old.professional_id
    or new.lead_id is distinct from old.lead_id
  then
    raise exception 'QUALITY_NOT_AUTHORIZED';
  end if;
  if old.progress_status in ('won', 'lost') then
    raise exception 'QUALITY_TERMINAL';
  end if;
  if exists (
    select 1 from public.lead_purchases
    where lead_id = old.lead_id and professional_id = old.professional_id
  ) and not exists (
    select 1 from public.lead_purchases
    where lead_id = old.lead_id and professional_id = old.professional_id and status = 'purchased'
  ) then
    raise exception 'QUALITY_ACCESS_REVOKED';
  end if;

  rejection_feedback := old.status in ('pending', 'viewed') and new.status = 'rejected'
    and new.progress_status = old.progress_status
    and new.reachability is not distinct from old.reachability
    and new.appointment_status = old.appointment_status
    and new.loss_reason is not distinct from old.loss_reason;
  if not rejection_feedback and (old.status <> 'accepted' or new.status <> 'accepted') then
    raise exception 'QUALITY_ASSIGNMENT_NOT_ACCEPTED';
  end if;
  if not rejection_feedback and not public.can_professional_view_lead_contact(old.lead_id, old.professional_id) then
    raise exception 'QUALITY_ACCESS_REVOKED';
  end if;

  if not public.is_valid_lead_progress_transition(old.progress_status, new.progress_status) then
    raise exception 'QUALITY_INVALID_PROGRESS';
  end if;
  if (new.progress_status = 'lost' and new.loss_reason is null)
    or (new.progress_status <> 'lost' and new.loss_reason is not null)
  then
    raise exception 'QUALITY_LOSS_REASON_REQUIRED';
  end if;
  if (new.appointment_status in ('scheduled', 'completed') and new.reachability is distinct from 'reached')
    or (new.progress_status in ('quote_sent', 'won') and new.reachability is distinct from 'reached')
    or (new.progress_status = 'appointment_scheduled' and new.appointment_status = 'not_scheduled')
    or (new.progress_status = 'new' and (new.reachability is not null or new.appointment_status <> 'not_scheduled'))
  then
    raise exception 'QUALITY_CONTRADICTORY_CONTACT';
  end if;

  event_time := greatest(clock_timestamp(), old.quality_updated_at + interval '1 microsecond');
  new.quality_updated_at := event_time;
  new.quality_updated_by := auth.uid();
  if new.progress_status is distinct from old.progress_status then
    new.progress_updated_at := now();
    if new.progress_status <> 'new' then
      new.contacted_at := coalesce(old.contacted_at, event_time);
    end if;
    if new.progress_status in ('won', 'lost') then
      new.outcome_at := coalesce(old.outcome_at, event_time);
    end if;
  end if;
  if new.reachability = 'reached' then
    new.reached_at := coalesce(old.reached_at, event_time);
  end if;
  if new.appointment_status in ('scheduled', 'completed') then
    new.appointment_scheduled_at := coalesce(old.appointment_scheduled_at, event_time);
  end if;
  return new;
end;
$$;

create trigger enforce_assignment_quality
before insert or update on public.lead_assignments
for each row execute function public.enforce_assignment_quality();

create function public.audit_assignment_quality()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.quality_updated_at is distinct from old.quality_updated_at then
    insert into public.lead_activity (
      lead_id, professional_id, actor_user_id, activity_type, from_status, to_status, metadata, created_at
    ) values (
      new.lead_id, new.professional_id, new.quality_updated_by, 'progress_updated',
      old.progress_status, new.progress_status,
      jsonb_build_object(
        'source', 'assignment_quality', 'assignment_id', new.id,
        'reachability', new.reachability, 'appointment_status', new.appointment_status,
        'loss_reason', new.loss_reason, 'mismatch_reason', new.mismatch_reason
      ), new.quality_updated_at
    );
  end if;
  return new;
end;
$$;

create trigger audit_assignment_quality
after update on public.lead_assignments
for each row execute function public.audit_assignment_quality();

-- Reserved outcome audit events can only originate from a nested assignment trigger.
create function public.guard_assignment_quality_audit()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op <> 'INSERT' and old.metadata->>'source' = 'assignment_quality' then
    raise exception 'QUALITY_AUDIT_IMMUTABLE';
  end if;
  if tg_op <> 'DELETE' and (
    new.metadata->>'source' = 'assignment_quality'
    or new.activity_type in ('progress_updated', 'loss_reason_recorded')
  ) and pg_trigger_depth() < 2 then
    raise exception 'QUALITY_AUDIT_TRIGGER_ONLY';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger guard_assignment_quality_audit
before insert or update or delete on public.lead_activity
for each row execute function public.guard_assignment_quality_audit();

drop policy if exists "professionals can read lead activity for assigned leads" on public.lead_activity;
drop policy if exists "professionals can read lead activity for unlocked leads" on public.lead_activity;
create policy "professionals can read lead activity for assigned leads"
on public.lead_activity for select to authenticated
using (
  professional_id = public.current_professional_id()
  and public.can_professional_view_lead_contact(lead_id)
);

create function public.update_assignment_quality(
  p_assignment_id uuid,
  p_expected_updated_at timestamptz,
  p_progress_status text,
  p_reachability text,
  p_appointment_status text,
  p_loss_reason text,
  p_mismatch_reason text,
  p_feedback_note text
)
returns timestamptz
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  assignment public.lead_assignments%rowtype;
  result timestamptz;
begin
  if auth.uid() is null or auth.role() <> 'authenticated' then
    raise exception 'QUALITY_NOT_AUTHORIZED';
  end if;
  select * into assignment from public.lead_assignments
  where id = p_assignment_id for update;
  if not found or (not public.is_admin()
    and assignment.professional_id is distinct from public.current_professional_id()) then
    raise exception 'QUALITY_NOT_AUTHORIZED';
  end if;
  if assignment.status <> 'accepted' then
    raise exception 'QUALITY_ASSIGNMENT_NOT_ACCEPTED';
  end if;
  if not public.can_professional_view_lead_contact(assignment.lead_id, assignment.professional_id) then
    raise exception 'QUALITY_ACCESS_REVOKED';
  end if;
  if p_expected_updated_at is null or assignment.quality_updated_at <> p_expected_updated_at then
    raise exception 'QUALITY_STALE_WRITE';
  end if;
  if p_progress_status is null or p_appointment_status is null then
    raise exception 'QUALITY_INVALID_VALUE';
  end if;
  update public.lead_assignments set
    progress_status = p_progress_status::public.lead_progress_status,
    reachability = p_reachability,
    appointment_status = p_appointment_status,
    loss_reason = p_loss_reason,
    mismatch_reason = p_mismatch_reason,
    feedback_note = nullif(btrim(p_feedback_note), '')
  where id = p_assignment_id
  returning quality_updated_at into result;
  return result;
end;
$$;

revoke all on function public.enforce_assignment_quality() from public, anon, authenticated;
revoke all on function public.audit_assignment_quality() from public, anon, authenticated;
revoke all on function public.guard_assignment_quality_audit() from public, anon, authenticated;
revoke all on function public.update_assignment_quality(uuid, timestamptz, text, text, text, text, text, text) from public, anon;
grant execute on function public.update_assignment_quality(uuid, timestamptz, text, text, text, text, text, text) to authenticated;
