-- Operational reviews never change lead outcomes, purchases or wallet balances.
create table public.lead_quality_reviews (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.leads(id) on delete restrict,
  status text not null check (status in ('open','in_review','resolved','dismissed')),
  resolution text check (resolution in ('valid_lead','incorrect_contact','duplicate','wrong_service',
    'wrong_region','already_completed','refund_approved','refund_not_applicable',
    'insufficient_evidence','data_issue','other')),
  created_by uuid not null references auth.users(id),
  updated_by uuid not null references auth.users(id),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  check ((status in ('resolved','dismissed')) = (resolution is not null))
);

create table public.lead_quality_review_events (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.lead_quality_reviews(id) on delete restrict,
  action text not null check (action in ('created','status_changed','reopened','note_added')),
  from_status text,
  to_status text not null,
  resolution text,
  body text check (body is null or char_length(btrim(body)) between 1 and 2000),
  actor_user_id uuid not null references auth.users(id),
  created_at timestamptz not null
);
create index lead_quality_review_events_review_time_idx
  on public.lead_quality_review_events(review_id, created_at, id);
alter table public.lead_quality_reviews enable row level security;
alter table public.lead_quality_review_events enable row level security;
revoke all on public.lead_quality_reviews, public.lead_quality_review_events from public, anon, authenticated, service_role;
grant select on public.lead_quality_reviews, public.lead_quality_review_events to authenticated;
create policy quality_reviews_admin_read on public.lead_quality_reviews for select to authenticated
  using (auth.role() = 'authenticated' and auth.uid() is not null and public.is_admin());
create policy quality_events_admin_read on public.lead_quality_review_events for select to authenticated
  using (auth.role() = 'authenticated' and auth.uid() is not null and public.is_admin());

create function public.guard_lead_quality_review_event()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  raise exception 'QUALITY_REVIEW_AUDIT_IMMUTABLE';
end;
$$;
create trigger quality_review_event_append_only before update or delete
  on public.lead_quality_review_events for each row execute function public.guard_lead_quality_review_event();
revoke all on function public.guard_lead_quality_review_event() from public, anon, authenticated, service_role;

-- Private aggregation, deliberately not callable through the client API.
create function public.admin_lead_quality_items(p_days integer default null, p_lead_id uuid default null)
returns table (
  lead_id uuid, reference text, service_id uuid, service_name text, source text, type text,
  created_at timestamptz, status text, review_id uuid, updated_at timestamptz, resolution text,
  priority text, signals jsonb, signal_count integer
)
language sql stable security definer set search_path = public, pg_temp as $$
  with scoped as (
    select l.* from public.leads l
    where (p_days is null or l.created_at >= now() - make_interval(days => p_days))
      and (p_lead_id is null or l.id = p_lead_id)
  ), a as (
    select la.* from public.lead_assignments la join scoped l on l.id = la.lead_id
  ), professional_flags as (
    select lead_id, professional_id,
      bool_or(mismatch_reason is not null) as mismatch,
      bool_or(reachability in ('invalid_phone','invalid_email') or mismatch_reason = 'invalid_contact' or loss_reason = 'invalid_contact') as invalid_contact,
      bool_or(reachability in ('no_answer','unreachable_other') or mismatch_reason = 'unreachable' or loss_reason = 'klant_niet_bereikbaar') as unreachable,
      bool_or(mismatch_reason = 'duplicate' or loss_reason = 'duplicate') as duplicate,
      bool_or(mismatch_reason = 'already_completed' or loss_reason = 'already_completed') as already_completed,
      bool_or(mismatch_reason = 'wrong_service' or loss_reason = 'wrong_service') as wrong_service,
      bool_or(mismatch_reason = 'wrong_region' or loss_reason = 'wrong_region') as wrong_region,
      bool_or(progress_status = 'lost') as lost,
      bool_or(progress_status = 'won') as won,
      bool_or(status = 'accepted' and progress_status not in ('won','lost') and quality_updated_at < now() - interval '14 days') as stale,
      -- A legacy null timestamp is unknown, not a proven impossible state.
      bool_or(progress_status in ('won','lost') and outcome_at is null and quality_updated_by is not null) as data_issue
    from a group by lead_id, professional_id
  ), complaints as (
    select lead_id, reason, count(distinct professional_id) as n from (
      select lead_id, professional_id, mismatch_reason as reason from a where mismatch_reason is not null
      union
      select lead_id, professional_id,
        case loss_reason when 'klant_niet_bereikbaar' then 'unreachable' else loss_reason end
      from a where loss_reason in ('duplicate','already_completed','wrong_service','wrong_region','invalid_contact','klant_niet_bereikbaar')
      union
      select lead_id, professional_id,
        case when reachability in ('invalid_phone','invalid_email') then 'invalid_contact' else 'unreachable' end
      from a where reachability in ('invalid_phone','invalid_email','no_answer','unreachable_other')
    ) reasons group by lead_id, reason
  ), af as (
    select lead_id,
      count(*) filter (where mismatch)::integer as mismatch,
      count(*) filter (where invalid_contact)::integer as invalid_contact,
      count(*) filter (where unreachable)::integer as unreachable,
      count(*) filter (where duplicate)::integer as duplicate,
      count(*) filter (where already_completed)::integer as already_completed,
      count(*) filter (where wrong_service)::integer as wrong_service,
      count(*) filter (where wrong_region)::integer as wrong_region,
      case when count(*) filter (where lost) >= 3 then count(*) filter (where lost)::integer else 0 end as negative_outcomes,
      count(*) filter (where stale)::integer as stale_open,
      count(*) filter (where data_issue)::integer as data_issue
    from professional_flags group by lead_id
  ), pf as (
    select lp.lead_id, count(*) filter (where lp.status = 'refunded')::integer as refund,
      count(*) filter (where
        (lp.status = 'refunded' and exists (
          select 1 from professional_flags f where f.lead_id = lp.lead_id and f.professional_id = lp.professional_id and f.won))
        or (lp.status = 'purchased' and not exists (
          select 1 from a where a.id = lp.lead_assignment_id and a.lead_purchase_id = lp.id
            and a.lead_id = lp.lead_id and a.professional_id = lp.professional_id))
      )::integer as financial_conflict,
      count(*) filter (where lp.status = 'purchased' and not exists (
        select 1 from a where a.id = lp.lead_assignment_id and a.lead_purchase_id = lp.id
          and a.lead_id = lp.lead_id and a.professional_id = lp.professional_id))::integer as missing_assignment
    from public.lead_purchases lp join scoped l on l.id = lp.lead_id group by lp.lead_id
  ), cf as (
    select w.lead_id, count(*)::integer as correction from public.wallet_transactions w
    join scoped l on l.id = w.lead_id where w.type = 'correction' group by w.lead_id
  ), conflicts as (
    select distinct winner.lead_id, negative.professional_id
    from professional_flags winner join professional_flags negative
      on negative.lead_id = winner.lead_id and negative.professional_id <> winner.professional_id
    where winner.won and (negative.lost or negative.mismatch or negative.invalid_contact or negative.unreachable)
    union
    select distinct winner.lead_id, lp.professional_id from professional_flags winner
    join public.lead_purchases lp on lp.lead_id = winner.lead_id and lp.professional_id <> winner.professional_id
    where winner.won and lp.status = 'refunded'
  ), raw as (
    select l.id as lead_id, l.public_reference as reference, l.service_id, s.name as service_name,
      case
        when lower(btrim(l.utm_source)) in ('google','google_ads','bing','bing_ads') then 'Zoekmachines'
        when lower(btrim(l.utm_source)) in ('facebook','instagram','meta','meta_ads','linkedin','tiktok') then 'Social'
        when lower(btrim(l.utm_source)) in ('email','newsletter') then 'E-mail'
        when lower(btrim(l.utm_source)) = 'direct' then 'Direct'
        when lower(btrim(l.utm_source)) in ('referral','partner') then 'Verwijzing'
        else 'Onbekend / overig' end as source,
      l.commercial_type::text as type, l.created_at,
      coalesce(r.status,'open') as status, r.id as review_id, r.updated_at, r.resolution,
      jsonb_build_object(
        'mismatch',coalesce(af.mismatch,0),'invalid_contact',coalesce(af.invalid_contact,0),
        'unreachable',coalesce(af.unreachable,0),'duplicate',coalesce(af.duplicate,0),
        'already_completed',coalesce(af.already_completed,0),'wrong_service',coalesce(af.wrong_service,0),
        'wrong_region',coalesce(af.wrong_region,0),'refund',coalesce(pf.refund,0),
        'correction',coalesce(cf.correction,0),
        'repeated_complaint',coalesce((select max(n)::integer from complaints c where c.lead_id = l.id and n >= 2),0),
        'negative_outcomes',coalesce(af.negative_outcomes,0),'stale_open',coalesce(af.stale_open,0),
        'conflicting_feedback',(select count(*)::integer from conflicts c where c.lead_id = l.id),
        'financial_conflict',coalesce(pf.financial_conflict,0),
        'data_issue',coalesce(af.data_issue,0) + coalesce(pf.missing_assignment,0)
      ) as all_signals
    from scoped l join public.services s on s.id = l.service_id
    left join public.lead_quality_reviews r on r.lead_id = l.id
    left join af on af.lead_id = l.id left join pf on pf.lead_id = l.id left join cf on cf.lead_id = l.id
  ), shaped as (
    select raw.*, coalesce((select jsonb_object_agg(key,value) from jsonb_each(all_signals) where value::integer > 0),'{}'::jsonb) as signals
    from raw
  )
  select lead_id, reference, service_id, service_name, source, type, created_at, status, review_id, updated_at, resolution,
    case when (all_signals->>'invalid_contact')::integer >= 2
      or (all_signals->>'financial_conflict')::integer > 0
      or ((all_signals->>'refund')::integer > 0 and (all_signals->>'duplicate')::integer > 0 and (all_signals->>'unreachable')::integer > 0) then 'high'
      when signals - 'refund' - 'correction' <> '{}'::jsonb then 'medium' else 'low' end,
    signals, (select coalesce(sum(value::integer),0)::integer from jsonb_each(signals))
  from shaped where signals <> '{}'::jsonb or review_id is not null;
$$;
revoke all on function public.admin_lead_quality_items(integer,uuid) from public, anon, authenticated, service_role;

create function public.admin_lead_quality_queue(
  p_days integer default 28, p_status text default 'open', p_signal text default '',
  p_service uuid default null, p_source text default '', p_type text default '',
  p_refund boolean default false, p_search text default '', p_sort text default 'priority', p_page integer default 1
) returns jsonb language plpgsql stable security definer set search_path = public, pg_temp as $$
declare result jsonb;
begin
  if auth.role() is distinct from 'authenticated' or auth.uid() is null or not public.is_admin() then
    raise exception 'QUALITY_REVIEW_NOT_AUTHORIZED';
  end if;
  if p_days is null or p_days < 1 or p_days > 365 or p_page is null or p_page < 1 or p_page > 10000
    or p_status is null or p_status not in ('','all','open','in_review','resolved','dismissed')
    or p_sort is null or p_sort not in ('priority','newest','oldest')
    or p_signal is null or p_signal not in ('','mismatch','invalid_contact','unreachable','duplicate','already_completed',
      'wrong_service','wrong_region','refund','correction','repeated_complaint','negative_outcomes','stale_open','conflicting_feedback','financial_conflict','data_issue')
    or p_source is null or p_source not in ('','Zoekmachines','Social','E-mail','Direct','Verwijzing','Onbekend / overig')
    or p_type is null or p_type not in ('','shared','exclusive') or p_refund is null
    or p_search is null or char_length(p_search) > 100 then
    raise exception 'QUALITY_REVIEW_INVALID_INPUT';
  end if;
  with base as materialized (select * from public.admin_lead_quality_items(p_days)),
  filtered as materialized (
    select b.* from base b
    where (p_service is null or b.service_id = p_service) and (p_source = '' or b.source = p_source)
      and (p_type = '' or b.type = p_type) and (not p_refund or b.signals ? 'refund')
      and (p_signal = '' or b.signals ? p_signal)
      and (btrim(p_search) = '' or b.reference ilike '%' || replace(replace(replace(btrim(p_search),'\','\\'),'%','\%'),'_','\_') || '%'
        or b.lead_id::text = btrim(p_search)
        or exists (select 1 from public.lead_assignments a where a.lead_id = b.lead_id and a.id::text = btrim(p_search))
        or exists (select 1 from public.lead_purchases p where p.lead_id = b.lead_id and p.id::text = btrim(p_search)))
  ), status_filtered as (
    select * from filtered where p_status in ('','all') or status = p_status
  ), paged as (
    select * from status_filtered order by
      case when p_sort = 'priority' then case priority when 'high' then 0 when 'medium' then 1 else 2 end end,
      case when p_sort in ('priority','newest') then created_at end desc,
      case when p_sort = 'oldest' then created_at end asc, lead_id
    limit 25 offset (p_page - 1) * 25
  )
  select jsonb_build_object(
    'items',coalesce((select jsonb_agg(to_jsonb(p)) from paged p),'[]'::jsonb),
    'total',(select count(*) from status_filtered),'page',p_page,
    'pages',greatest(1,ceil((select count(*) from status_filtered) / 25.0)::integer),
    'counts',jsonb_build_object(
      'open',(select count(*) from filtered where status = 'open'),
      'in_review',(select count(*) from filtered where status = 'in_review'),
      'resolved',(select count(*) from filtered where status = 'resolved'),
      'high',(select count(*) from filtered where priority = 'high')),
    'options',jsonb_build_object(
      'services',coalesce((select jsonb_agg(jsonb_build_object('value',service_id,'label',service_name) order by service_name,service_id)
        from (select distinct service_id,service_name from base) s),'[]'::jsonb),
      'sources',coalesce((select jsonb_agg(jsonb_build_object('value',source,'label',source) order by source)
        from (select distinct source from base) s),'[]'::jsonb))
  ) into result;
  return result;
end;
$$;

create function public.admin_lead_quality_detail(p_lead_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public, pg_temp as $$
declare item jsonb; result jsonb;
begin
  if auth.role() is distinct from 'authenticated' or auth.uid() is null or not public.is_admin() then
    raise exception 'QUALITY_REVIEW_NOT_AUTHORIZED';
  end if;
  if p_lead_id is null then raise exception 'QUALITY_REVIEW_INVALID_INPUT'; end if;
  -- Check cardinality before materializing a potentially oversized response.
  if (select count(*) from (select 1 from public.lead_assignments where lead_id = p_lead_id limit 501) x) > 500
    or (select count(*) from (select 1 from public.lead_purchases where lead_id = p_lead_id limit 501) x) > 500
    or (select count(*) from (select 1 from public.wallet_transactions where lead_id = p_lead_id and type = 'correction' limit 501) x) > 500
    or (select count(*) from (select 1 from public.lead_quality_review_events e
      join public.lead_quality_reviews r on r.id = e.review_id where r.lead_id = p_lead_id limit 1001) x) > 1000 then
    raise exception 'QUALITY_REVIEW_DETAIL_TOO_LARGE';
  end if;
  select to_jsonb(i) into item from public.admin_lead_quality_items(null,p_lead_id) i;
  if item is null then return null; end if;
  with assignments as materialized (
    select id,professional_id,status,progress_status,
      case when loss_reason in ('prijs','klant_niet_bereikbaar','klant_koos_andere_partij','klus_uitgesteld','buiten_scope','anders',
        'duplicate','already_completed','wrong_service','wrong_region','invalid_contact') then loss_reason end as loss_reason,
      mismatch_reason,reachability,appointment_status,assigned_at,contacted_at,reached_at,
      appointment_scheduled_at,outcome_at,quality_updated_at
    from public.lead_assignments where lead_id = p_lead_id
  ), purchases as materialized (
    select id,professional_id,status,price_credits,purchased_at,refunded_at from public.lead_purchases where lead_id = p_lead_id
  ), corrections as materialized (
    select id,professional_id,amount,created_at,type from public.wallet_transactions where lead_id = p_lead_id and type = 'correction'
  ), events as materialized (
    select e.* from public.lead_quality_review_events e join public.lead_quality_reviews r on r.id = e.review_id where r.lead_id = p_lead_id
  ), timeline as (
    select item->>'created_at' as at,'Lead aangemaakt' as label,null::uuid as assignment_id,null::uuid as purchase_id
    union all
    select v.at::text,v.label,a.id,null::uuid from assignments a cross join lateral (
      values (a.assigned_at,'Toegewezen'),(a.contacted_at,'Contact opgenomen'),(a.reached_at,'Bereikt'),
        (a.appointment_scheduled_at,'Afspraak gepland'),(a.outcome_at,'Uitkomst geregistreerd')
    ) v(at,label) where v.at is not null
    union all select purchased_at::text,'Gekocht',null::uuid,id from purchases where purchased_at is not null
    union all select refunded_at::text,'Terugbetaald',null::uuid,id from purchases where refunded_at is not null
    union all select created_at::text,'Walletcorrectie',null::uuid,null::uuid from corrections
    union all select created_at::text,'Review: ' || action,null::uuid,null::uuid from events
  )
  select jsonb_build_object(
    'item',item,'lead',jsonb_build_object('created_at',item->'created_at','reference',item->'reference',
      'service_name',item->'service_name','type',item->'type','source',item->'source'),
    'assignments',coalesce((select jsonb_agg(to_jsonb(a) order by assigned_at,id) from assignments a),'[]'::jsonb),
    'purchases',coalesce((select jsonb_agg(to_jsonb(p) order by purchased_at,id) from purchases p),'[]'::jsonb),
    'corrections',coalesce((select jsonb_agg(to_jsonb(c) order by created_at,id) from corrections c),'[]'::jsonb),
    'notes',coalesce((select jsonb_agg(jsonb_build_object('id',id,'body',body,'actor_user_id',actor_user_id,'created_at',created_at)
      order by created_at,id) from events where body is not null),'[]'::jsonb),
    'audit',coalesce((select jsonb_agg(jsonb_build_object('id',id,'action',action,'from_status',from_status,'to_status',to_status,
      'resolution',resolution,'actor_user_id',actor_user_id,'created_at',created_at) order by created_at,id) from events),'[]'::jsonb),
    'timeline',coalesce((select jsonb_agg(jsonb_strip_nulls(to_jsonb(t)) order by at::timestamptz,label,assignment_id,purchase_id) from timeline t),'[]'::jsonb)
  ) into result;
  return result;
end;
$$;

create function public.admin_update_lead_quality_review(
  p_lead_id uuid, p_expected_updated_at timestamptz default null, p_status text default 'in_review',
  p_resolution text default null, p_note text default null
) returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare existing public.lead_quality_reviews%rowtype; event_time timestamptz; actor uuid := auth.uid(); action text;
begin
  if auth.role() is distinct from 'authenticated' or actor is null or not public.is_admin() then
    raise exception 'QUALITY_REVIEW_NOT_AUTHORIZED';
  end if;
  if p_lead_id is null or p_status is null or p_status not in ('open','in_review','resolved','dismissed')
    or (p_resolution is not null and p_resolution not in ('valid_lead','incorrect_contact','duplicate','wrong_service',
      'wrong_region','already_completed','refund_approved','refund_not_applicable','insufficient_evidence','data_issue','other'))
    or (p_note is not null and (char_length(btrim(p_note)) = 0 or char_length(p_note) > 2000))
    or (p_status in ('open','in_review') and p_resolution is not null) then
    raise exception 'QUALITY_REVIEW_INVALID_INPUT';
  end if;
  if p_status in ('resolved','dismissed') and (p_resolution is null or nullif(btrim(p_note),'') is null) then
    raise exception 'QUALITY_REVIEW_REASON_REQUIRED';
  end if;
  select * into existing from public.lead_quality_reviews where lead_id = p_lead_id for update;
  if existing.id is null then
    if p_expected_updated_at is not null then raise exception 'QUALITY_REVIEW_STALE_WRITE'; end if;
    if not exists (select 1 from public.admin_lead_quality_items(null,p_lead_id) where signal_count > 0) then
      raise exception 'QUALITY_REVIEW_NO_SIGNALS';
    end if;
    event_time := clock_timestamp();
    begin
      insert into public.lead_quality_reviews(lead_id,status,resolution,created_by,updated_by,created_at,updated_at)
        values (p_lead_id,p_status,p_resolution,actor,actor,event_time,event_time) returning id into existing.id;
    exception when unique_violation then raise exception 'QUALITY_REVIEW_STALE_WRITE';
    end;
    action := 'created';
  else
    if p_expected_updated_at is null or p_expected_updated_at is distinct from existing.updated_at then
      raise exception 'QUALITY_REVIEW_STALE_WRITE';
    end if;
    if p_status = existing.status and p_note is null then raise exception 'QUALITY_REVIEW_INVALID_INPUT'; end if;
    event_time := greatest(clock_timestamp(),existing.updated_at + interval '1 microsecond');
    action := case when existing.status in ('resolved','dismissed') and p_status in ('open','in_review') then 'reopened'
      when existing.status <> p_status then 'status_changed' else 'note_added' end;
    update public.lead_quality_reviews set status = p_status,resolution = p_resolution,updated_by = actor,updated_at = event_time
      where id = existing.id;
  end if;
  insert into public.lead_quality_review_events(review_id,action,from_status,to_status,resolution,body,actor_user_id,created_at)
    values (existing.id,action,existing.status,p_status,p_resolution,btrim(p_note),actor,event_time);
  return existing.id;
end;
$$;
revoke all on function public.admin_lead_quality_queue(integer,text,text,uuid,text,text,boolean,text,text,integer) from public, anon, authenticated, service_role;
revoke all on function public.admin_lead_quality_detail(uuid) from public, anon, authenticated, service_role;
revoke all on function public.admin_update_lead_quality_review(uuid,timestamptz,text,text,text) from public, anon, authenticated, service_role;
grant execute on function public.admin_lead_quality_queue(integer,text,text,uuid,text,text,boolean,text,text,integer) to authenticated;
grant execute on function public.admin_lead_quality_detail(uuid) to authenticated;
grant execute on function public.admin_update_lead_quality_review(uuid,timestamptz,text,text,text) to authenticated;
