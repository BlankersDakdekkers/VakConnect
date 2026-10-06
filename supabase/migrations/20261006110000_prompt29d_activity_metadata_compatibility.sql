-- Keep visitor analytics separate from operational lead audit metadata.
-- PostgreSQL bounded repetition cannot exceed 255. Only the route expression
-- changes here: the existing allowlist, 120-character string cap and PII checks
-- remain intact, including for routes.
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
      or entry.value #>> '{}' !~ '^/[A-Za-z0-9_./-]*$'
      or char_length(entry.value #>> '{}') > 301
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

create or replace function public.lead_activity_metadata_is_safe(metadata jsonb)
returns boolean
language plpgsql
stable
set search_path = ''
as $$
declare
  entry record;
  value_text text;
  allowed_values text[];
begin
  if metadata is null then
    return true;
  end if;
  if jsonb_typeof(metadata) <> 'object'
    or octet_length(metadata::text) > 4096
    or (select count(*) from jsonb_object_keys(metadata)) > 24 then
    return false;
  end if;

  -- Preserve existing analytics-shaped activity rows as a separate domain.
  -- Operational keys are never added to the analytics allowlist or mixed into it.
  if public.analytics_metadata_is_safe(metadata) then
    return true;
  end if;

  for entry in select key, value from jsonb_each(metadata) loop
    value_text := entry.value #>> '{}';
    if entry.key in ('assignment_id', 'candidate_id', 'run_id', 'actor_user_id') then
      if entry.key = 'actor_user_id' and entry.value = 'null'::jsonb then
        continue;
      end if;
      if jsonb_typeof(entry.value) <> 'string'
        or value_text !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
        return false;
      end if;
    elsif entry.key in ('score', 'match_count', 'candidate_count') then
      if jsonb_typeof(entry.value) <> 'number' then
        return false;
      end if;
      if value_text::numeric <> trunc(value_text::numeric)
        or value_text::numeric < 0
        or value_text::numeric > (case entry.key
          when 'score' then 100 when 'candidate_count' then 40 else 1000000 end) then
        return false;
      end if;
    else
      allowed_values := case entry.key
        when 'source' then array['assignment_quality', 'website']
        when 'step' then array['submitted']
        when 'strategy_version' then array['v2']
        when 'action' then array['requeue', 'pause_run', 'manual_offer']
        when 'reachability' then array['reached', 'no_answer', 'invalid_phone', 'invalid_email', 'unreachable_other']
        when 'appointment_status' then array['not_scheduled', 'scheduled', 'completed', 'cancelled']
        when 'loss_reason' then array[
          'prijs', 'klant_niet_bereikbaar', 'klant_koos_andere_partij', 'klus_uitgesteld', 'buiten_scope', 'anders',
          'duplicate', 'already_completed', 'wrong_service', 'wrong_region', 'invalid_contact']
        when 'mismatch_reason' then array[
          'wrong_service', 'wrong_region', 'incorrect_information', 'already_completed', 'duplicate',
          'unreachable', 'invalid_contact', 'profile_mismatch', 'other']
        when 'reason' then array[
          'te_ver', 'geen_capaciteit', 'klus_past_niet', 'prijs_te_hoog', 'timing_past_niet', 'anders',
          'wrong_service', 'wrong_region', 'incorrect_information', 'already_completed', 'duplicate',
          'unreachable', 'invalid_contact', 'profile_mismatch', 'required_document_expired']
        else null end;
      if allowed_values is null then
        return false;
      end if;
      if entry.value = 'null'::jsonb and entry.key in ('reachability', 'loss_reason', 'mismatch_reason', 'reason') then
        continue;
      end if;
      if jsonb_typeof(entry.value) <> 'string'
        or char_length(value_text) > 120
        or not (value_text = any(allowed_values)) then
        return false;
      end if;
    end if;
  end loop;
  return true;
end;
$$;

-- Direct activity writes are server-only; quality audit inserts run as the
-- existing definer trigger owner. Do not widen analytics or session privileges.
revoke all on function public.lead_activity_metadata_is_safe(jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public.lead_activity_metadata_is_safe(jsonb) to service_role;

-- Preserve existing history without rewriting/deleting rows. NOT VALID skips
-- only the existing-row scan; INSERT and UPDATE still enforce the new CHECK.
alter table public.lead_activity drop constraint if exists lead_activity_metadata_check;
alter table public.lead_activity add constraint lead_activity_metadata_check
  check (public.lead_activity_metadata_is_safe(metadata)) not valid;
