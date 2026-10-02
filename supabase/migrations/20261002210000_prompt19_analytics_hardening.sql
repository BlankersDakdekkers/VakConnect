alter table public.analytics_events
  add column idempotency_key text,
  add constraint analytics_events_idempotency_key_length
    check (idempotency_key is null or char_length(trim(idempotency_key)) between 1 and 160);

create unique index analytics_events_idempotency_key_idx
  on public.analytics_events (idempotency_key);

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
    'source_page_type', 'experiment_id', 'variant_id', 'step_count', 'question_count',
    'answered_count', 'upload_count', 'viewed_count', 'completed_count', 'click_count',
    'started_count', 'submitted_count', 'dropped_count'
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

    if jsonb_typeof(entry.value) = 'string'
      and char_length(entry.value #>> '{}') > 120 then
      return false;
    end if;

    if entry.key = 'service_id'
      and (jsonb_typeof(entry.value) <> 'string' or entry.value #>> '{}' !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$') then
      return false;
    end if;

    if jsonb_typeof(entry.value) = 'string'
      and entry.key <> 'service_id'
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
        if jsonb_typeof(nested) = 'string'
          and (
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
