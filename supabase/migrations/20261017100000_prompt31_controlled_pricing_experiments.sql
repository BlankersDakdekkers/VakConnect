alter table public.experiments
  add column experiment_type text not null default 'cro'
    check (experiment_type in ('cro', 'pricing')),
  add column description text check (description is null or char_length(trim(description)) between 3 and 1000),
  add column created_by uuid references auth.users(id) on delete set null,
  add column pricing_config jsonb,
  add column primary_metric text
    check (primary_metric is null or primary_metric in (
      'offer_to_purchase_rate', 'purchase_to_reached_rate', 'purchase_to_appointment_rate',
      'purchase_to_won_rate', 'net_credits_per_offer', 'net_credits_per_purchase',
      'matured_credits_per_won'
    )),
  add column guardrail_metrics text[] not null default '{}';

alter table public.experiment_variants
  add column price_credits integer check (price_credits between 1 and 100);

alter table public.experiment_audit_log
  add column action text not null default 'status_transition'
    check (action in ('status_transition', 'created', 'config_changed', 'decision_recorded')),
  add column metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 2048);

alter table public.lead_purchases
  add column pricing_experiment_id uuid references public.experiments(id) on delete restrict,
  add column pricing_variant_id uuid;

alter table public.lead_purchases
  add constraint lead_purchases_pricing_variant_fk
    foreign key (pricing_experiment_id, pricing_variant_id)
    references public.experiment_variants(experiment_id, id)
    on delete restrict,
  add constraint lead_purchases_pricing_pair_check
    check ((pricing_experiment_id is null) = (pricing_variant_id is null));

create table public.pricing_experiment_assignments (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid references public.experiments(id) on delete restrict,
  variant_id uuid,
  lead_id uuid not null references public.leads(id) on delete restrict,
  professional_id uuid not null references public.professionals(id) on delete restrict,
  control_price_credits integer not null check (control_price_credits between 1 and 100),
  assigned_price_credits integer not null check (assigned_price_credits between 1 and 100),
  context jsonb not null check (
    jsonb_typeof(context) = 'object'
    and context - array['service_id', 'commercial_type', 'control_price_credits'] = '{}'::jsonb
    and context ?& array['service_id', 'commercial_type', 'control_price_credits']
    and jsonb_typeof(context->'service_id') = 'string'
    and context->>'service_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    and context->>'commercial_type' in ('shared', 'exclusive')
    and jsonb_typeof(context->'control_price_credits') = 'number'
    and (context->>'control_price_credits')::integer between 1 and 100
    and (context->>'control_price_credits')::integer = control_price_credits
  ),
  assigned_at timestamptz not null default timezone('utc', now()),
  foreign key (experiment_id, variant_id)
    references public.experiment_variants(experiment_id, id)
    on delete restrict,
  check ((experiment_id is null) = (variant_id is null)),
  unique (lead_id, professional_id)
);

create index pricing_experiment_assignments_experiment_variant_idx
  on public.pricing_experiment_assignments (experiment_id, variant_id, assigned_at desc);

create index lead_purchases_pricing_experiment_idx
  on public.lead_purchases (pricing_experiment_id, pricing_variant_id, purchased_at desc)
  where pricing_experiment_id is not null;

create table public.pricing_experiment_decisions (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.experiments(id) on delete restrict,
  decision text not null check (decision in ('keep_control', 'adopt_later', 'inconclusive', 'stop')),
  note text not null check (char_length(trim(note)) between 3 and 1000),
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now())
);

create index pricing_experiment_decisions_experiment_created_idx
  on public.pricing_experiment_decisions (experiment_id, created_at desc);

create or replace function public.create_pricing_experiment(
  input_name text,
  input_description text,
  input_config jsonb,
  input_primary_metric text,
  input_control_weight integer,
  input_variant_price integer,
  input_variant_weight integer,
  input_actor_user_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_experiment_id uuid;
  new_key text := 'pricing_' || replace(gen_random_uuid()::text, '-', '');
begin
  if auth.role() <> 'service_role'
    or input_actor_user_id is null
    or input_name is null or char_length(trim(input_name)) not between 2 and 120
    or input_description is null or char_length(trim(input_description)) not between 3 and 1000
    or not public.is_valid_pricing_experiment_config(input_config)
    or input_primary_metric not in (
      'offer_to_purchase_rate', 'purchase_to_reached_rate', 'purchase_to_appointment_rate',
      'purchase_to_won_rate', 'net_credits_per_offer', 'net_credits_per_purchase',
      'matured_credits_per_won'
    )
    or input_control_weight not between 1 and 99
    or input_variant_weight not between 1 and 99
    or input_control_weight + input_variant_weight <> 100
    or input_variant_price is null
    or input_variant_price not between 1 and 100 then
    raise exception 'PRICING_EXPERIMENT_CONFIGURATION_INVALID';
  end if;
  if exists (
    select 1
    from jsonb_array_elements_text(input_config->'segment'->'service_ids') as service_id(value)
    left join public.services on services.id = service_id.value::uuid and services.active = true
    where services.id is null
  ) then
    raise exception 'PRICING_EXPERIMENT_SERVICE_INVALID';
  end if;

  insert into public.experiments (
    key, name, description, status, experiment_type, target_type, slot,
    target_rules, goal_event, pricing_config, primary_metric, guardrail_metrics, created_by
  ) values (
    new_key, trim(input_name), trim(input_description), 'draft', 'pricing', 'lead_funnel',
    'pricing.lead.offer', '{}'::jsonb, 'lead_submitted', input_config, input_primary_metric,
    array['refund_rate', 'mismatch_rate', 'reachability', 'sample_size', 'purchase_volume'],
    input_actor_user_id
  ) returning id into new_experiment_id;

  insert into public.experiment_variants (experiment_id, key, label, weight, is_control, price_credits)
  values
    (new_experiment_id, 'control', 'Normale prijs', input_control_weight, true, null),
    (new_experiment_id, 'variant_a', 'Testprijs', input_variant_weight, false, input_variant_price);

  insert into public.experiment_audit_log (
    experiment_id, actor_user_id, previous_status, next_status, action, metadata
  ) values (
    new_experiment_id, input_actor_user_id, 'draft', 'draft', 'created',
    jsonb_build_object(
      'experiment_type', 'pricing',
      'primary_metric', input_primary_metric,
      'segment', input_config->'segment',
      'max_delta_percent', 25,
      'pilot_mode', (input_config->>'pilot_mode')::boolean,
      'pilot_allowlist_count', jsonb_array_length(input_config->'pilot_professional_ids'),
      'control_weight', input_control_weight,
      'variant_weight', input_variant_weight,
      'variant_price_credits', input_variant_price
    )
  );
  return new_experiment_id;
end;
$$;

create or replace function public.is_valid_pricing_experiment_config(input_config jsonb)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  segment jsonb;
  item jsonb;
  key_name text;
  allowed_primary text[] := array[
    'offer_to_purchase_rate', 'purchase_to_reached_rate', 'purchase_to_appointment_rate',
    'purchase_to_won_rate', 'net_credits_per_offer', 'net_credits_per_purchase',
    'matured_credits_per_won'
  ];
  required_guardrails text[] := array[
    'refund_rate', 'mismatch_rate', 'reachability', 'sample_size', 'purchase_volume'
  ];
begin
  if jsonb_typeof(input_config) <> 'object'
    or (select count(*) from jsonb_object_keys(input_config)) <> 4
    or not (input_config ?& array['segment', 'max_delta_percent', 'pilot_mode', 'pilot_professional_ids'])
    or input_config->>'max_delta_percent' <> '25'
    or jsonb_typeof(input_config->'pilot_mode') <> 'boolean'
    or jsonb_typeof(input_config->'pilot_professional_ids') <> 'array'
    or jsonb_array_length(input_config->'pilot_professional_ids') > 20 then
    return false;
  end if;

  segment := input_config->'segment';
  if jsonb_typeof(segment) <> 'object'
    or (select count(*) from jsonb_object_keys(segment)) > 4
    or exists (
      select 1 from jsonb_object_keys(segment) as keys(key)
      where keys.key not in ('service_ids', 'commercial_types', 'control_price_min', 'control_price_max')
    ) then
    return false;
  end if;

  if segment ? 'service_ids' then
    if jsonb_typeof(segment->'service_ids') <> 'array'
      or jsonb_array_length(segment->'service_ids') < 1
      or jsonb_array_length(segment->'service_ids') > 20 then
      return false;
    end if;
    for item in select value from jsonb_array_elements(segment->'service_ids') loop
      if jsonb_typeof(item) <> 'string'
        or item #>> '{}' !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
        return false;
      end if;
    end loop;
    if (select count(distinct value) from jsonb_array_elements_text(segment->'service_ids')) <> jsonb_array_length(segment->'service_ids') then
      return false;
    end if;
  end if;

  if segment ? 'commercial_types' then
    if jsonb_typeof(segment->'commercial_types') <> 'array'
      or jsonb_array_length(segment->'commercial_types') < 1
      or jsonb_array_length(segment->'commercial_types') > 2 then
      return false;
    end if;
    for item in select value from jsonb_array_elements(segment->'commercial_types') loop
      if jsonb_typeof(item) <> 'string' or item #>> '{}' not in ('shared', 'exclusive') then
        return false;
      end if;
    end loop;
    if (select count(distinct value) from jsonb_array_elements_text(segment->'commercial_types')) <> jsonb_array_length(segment->'commercial_types') then
      return false;
    end if;
  end if;

  for key_name in select unnest(array['control_price_min', 'control_price_max']) loop
    if segment ? key_name and (
      jsonb_typeof(segment->key_name) <> 'number'
      or (segment->>key_name)::numeric <> trunc((segment->>key_name)::numeric)
      or (segment->>key_name)::integer not between 1 and 100
    ) then
      return false;
    end if;
  end loop;

  if segment ? 'control_price_min' and segment ? 'control_price_max'
    and (segment->>'control_price_min')::integer > (segment->>'control_price_max')::integer then
    return false;
  end if;

  for item in select value from jsonb_array_elements(input_config->'pilot_professional_ids') loop
    if jsonb_typeof(item) <> 'string'
      or item #>> '{}' !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
      return false;
    end if;
  end loop;
  if (select count(distinct value) from jsonb_array_elements_text(input_config->'pilot_professional_ids'))
    <> jsonb_array_length(input_config->'pilot_professional_ids') then
    return false;
  end if;

  if (input_config->>'pilot_mode')::boolean <> (jsonb_array_length(input_config->'pilot_professional_ids') > 0) then
    return false;
  end if;
  return true;
exception when others then
  return false;
end;
$$;

create or replace function public.guard_pricing_experiment_configuration()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.experiment_type = 'pricing' then
    if new.slot <> 'pricing.lead.offer'
      or new.pricing_config is null
      or not public.is_valid_pricing_experiment_config(new.pricing_config)
      or new.primary_metric is null
      or new.primary_metric not in (
        'offer_to_purchase_rate', 'purchase_to_reached_rate', 'purchase_to_appointment_rate',
        'purchase_to_won_rate', 'net_credits_per_offer', 'net_credits_per_purchase',
        'matured_credits_per_won'
      )
      or not (new.guardrail_metrics @> array[
        'refund_rate', 'mismatch_rate', 'reachability', 'sample_size', 'purchase_volume'
      ])
      or cardinality(new.guardrail_metrics) <> 5
      or exists (
        select 1 from unnest(new.guardrail_metrics) as guardrail(metric)
        where guardrail.metric not in ('refund_rate', 'mismatch_rate', 'reachability', 'sample_size', 'purchase_volume')
      )
      or new.target_rules <> '{}'::jsonb then
      raise exception 'PRICING_EXPERIMENT_CONFIGURATION_INVALID';
    end if;
  elsif new.pricing_config is not null or new.primary_metric is not null or cardinality(new.guardrail_metrics) <> 0 then
    raise exception 'CRO_EXPERIMENT_PRICING_FIELDS_FORBIDDEN';
  end if;

  if tg_op = 'UPDATE' and old.experiment_type = 'pricing' and old.status <> 'draft'
    and (new.experiment_type is distinct from old.experiment_type
      or new.pricing_config is distinct from old.pricing_config
      or new.primary_metric is distinct from old.primary_metric
      or new.guardrail_metrics is distinct from old.guardrail_metrics
      or new.slot is distinct from old.slot
      or new.target_rules is distinct from old.target_rules) then
    raise exception 'PRICING_EXPERIMENT_CONFIGURATION_IMMUTABLE';
  end if;
  return new;
end;
$$;

create trigger guard_pricing_experiment_configuration
before insert or update on public.experiments
for each row execute function public.guard_pricing_experiment_configuration();

create or replace function public.guard_pricing_experiment_variant()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  target_experiment_id uuid;
  old_experiment_type text;
  old_experiment_status text;
  target_type text;
  target_status text;
begin
  target_experiment_id := case when tg_op = 'DELETE' then old.experiment_id else new.experiment_id end;
  if tg_op = 'UPDATE' and new.experiment_id is distinct from old.experiment_id then
    select experiment_type, status into old_experiment_type, old_experiment_status
    from public.experiments where id = old.experiment_id;
    if old_experiment_type = 'pricing' and old_experiment_status <> 'draft' then
      raise exception 'PRICING_EXPERIMENT_VARIANTS_IMMUTABLE';
    end if;
  end if;
  select experiment_type, status into target_type, target_status
  from public.experiments where id = target_experiment_id;
  if target_type = 'pricing' then
    if target_status <> 'draft' then
      raise exception 'PRICING_EXPERIMENT_VARIANTS_IMMUTABLE';
    end if;
    if tg_op <> 'DELETE' and ((new.is_control and new.price_credits is not null)
      or (not new.is_control and new.price_credits is null)
      or new.price_credits > 100) then
      raise exception 'PRICING_EXPERIMENT_VARIANT_PRICE_INVALID';
    end if;
  elsif tg_op <> 'DELETE' and new.price_credits is not null then
    raise exception 'CRO_EXPERIMENT_PRICE_FORBIDDEN';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger guard_pricing_experiment_variant
before insert or update or delete on public.experiment_variants
for each row execute function public.guard_pricing_experiment_variant();

create or replace function public.transition_experiment_status(
  input_experiment_id uuid,
  input_next_status text,
  input_actor_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_experiment public.experiments%rowtype;
  variant_count integer;
  control_count integer;
  total_weight integer;
  priced_variant_count integer;
begin
  if input_next_status not in ('active', 'paused', 'completed', 'archived') then
    raise exception 'Ongeldige experimentstatus.';
  end if;

  select * into current_experiment
  from public.experiments where id = input_experiment_id for update;
  if not found then raise exception 'Experiment niet gevonden.'; end if;

  if not (
    (current_experiment.status = 'draft' and input_next_status = 'active')
    or (current_experiment.status = 'active' and input_next_status in ('paused', 'completed'))
    or (current_experiment.status = 'paused' and input_next_status in ('active', 'completed'))
    or (current_experiment.status = 'completed' and input_next_status = 'archived')
  ) then raise exception 'Ongeldige statusovergang.'; end if;

  select count(*), count(*) filter (where is_control), coalesce(sum(weight), 0),
    count(*) filter (where not is_control and price_credits between 1 and 100)
    into variant_count, control_count, total_weight, priced_variant_count
  from public.experiment_variants where experiment_id = input_experiment_id;

  if current_experiment.experiment_type = 'pricing' then
    if input_next_status = 'active' and (
      current_experiment.slot <> 'pricing.lead.offer'
      or not public.is_valid_pricing_experiment_config(current_experiment.pricing_config)
      or current_experiment.primary_metric is null
      or not (current_experiment.guardrail_metrics @> array[
        'refund_rate', 'mismatch_rate', 'reachability', 'sample_size', 'purchase_volume'
      ])
      or cardinality(current_experiment.guardrail_metrics) <> 5
      or exists (
        select 1 from unnest(current_experiment.guardrail_metrics) as guardrail(metric)
        where guardrail.metric not in ('refund_rate', 'mismatch_rate', 'reachability', 'sample_size', 'purchase_volume')
      )
      or variant_count < 2 or control_count <> 1 or total_weight <> 100
      or priced_variant_count <> variant_count - 1
    ) then
      raise exception 'Pricingexperiment vereist geldige segmenten, metric, guardrails, control, prijzen en 100%% allocatie.';
    end if;
  elsif input_next_status = 'active' then
    if current_experiment.target_type not in ('homepage', 'service_page', 'local_page', 'lead_funnel', 'cta', 'funnel_step')
      or current_experiment.slot !~ '^[a-z0-9_.]{3,100}$'
      or current_experiment.goal_event not in ('public_cta_click', 'lead_funnel_started', 'lead_submitted')
      or current_experiment.target_rules ?| array['h1', 'canonical', 'metadata', 'seo_body']
      or (current_experiment.target_rules ? 'page_type' and current_experiment.target_rules->>'page_type' not in ('homepage', 'core_public', 'service', 'subservice', 'service_city', 'subservice_city', 'province', 'lead_funnel', 'professional_landing', 'contact', 'costs'))
      or (current_experiment.target_rules ? 'route' and (
        current_experiment.target_rules->>'route' !~ '^/[a-z0-9_./-]{0,200}$'
        or position('//' in current_experiment.target_rules->>'route') > 0
        or char_length(regexp_replace(current_experiment.target_rules->>'route', '[^0-9]', '', 'g')) >= 7
      ))
      or (current_experiment.target_rules ? 'service_slug' and current_experiment.target_rules->>'service_slug' !~ '^[a-z0-9-]{1,80}$')
      or (current_experiment.target_rules ? 'city_slug' and current_experiment.target_rules->>'city_slug' !~ '^[a-z0-9-]{1,80}$')
      or (current_experiment.target_rules ? 'device_category' and current_experiment.target_rules->>'device_category' not in ('mobile', 'tablet', 'desktop'))
      or (current_experiment.target_rules ? 'referral_channel' and current_experiment.target_rules->>'referral_channel' not in ('organic', 'paid', 'direct', 'referral', 'unknown'))
      or (current_experiment.target_rules ? 'step_key' and current_experiment.target_rules->>'step_key' not in ('service', 'questions', 'location', 'details', 'photos', 'contact', 'review'))
      or (current_experiment.target_type = 'homepage' and current_experiment.target_rules->>'page_type' <> 'homepage')
      or (current_experiment.target_type = 'service_page' and current_experiment.target_rules->>'page_type' <> 'service')
      or (current_experiment.target_type = 'local_page' and current_experiment.target_rules->>'page_type' not in ('service_city', 'subservice_city', 'province'))
      or (current_experiment.target_type in ('lead_funnel', 'funnel_step') and current_experiment.target_rules->>'page_type' <> 'lead_funnel')
      or exists (
        select 1 from jsonb_object_keys(current_experiment.target_rules) as rules(rule_key)
        where rules.rule_key not in ('page_type', 'route', 'service_slug', 'city_slug', 'device_category', 'referral_channel', 'step_key')
      ) then
      raise exception 'Experimenttarget is niet veilig of niet ondersteund.';
    end if;
    if variant_count < 2 or control_count <> 1 or total_weight <> 100 then
      raise exception 'Een actief experiment vereist minimaal twee varianten, exact één control en gewichten van totaal 100.';
    end if;
  end if;

  update public.experiments
  set status = input_next_status,
      started_at = case when input_next_status = 'active' then coalesce(started_at, timezone('utc', now())) else started_at end,
      ended_at = case
        when input_next_status = 'completed' then timezone('utc', now())
        when input_next_status in ('active', 'paused') then null
        else ended_at
      end,
      updated_at = timezone('utc', now())
  where id = input_experiment_id;

  insert into public.experiment_audit_log (experiment_id, actor_user_id, previous_status, next_status)
  values (input_experiment_id, input_actor_user_id, current_experiment.status, input_next_status);
end;
$$;

create or replace function public.resolve_lead_price_baseline(target_lead_id uuid)
returns table (
  price_credits integer,
  commercial_type lead_commercial_type,
  max_buyers integer,
  buyers_count integer,
  sales_status lead_sales_status,
  pricing_rule_id uuid,
  price_source text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  lead_row record;
  rule_row record;
  multiplier numeric(6,2);
begin
  select l.id, l.service_id, l.subservice_slug, l.commercial_type, l.price_credits, l.max_buyers,
    l.buyers_count, l.sales_status, l.lead_score, s.slug as service_slug
  into lead_row
  from public.leads l join public.services s on s.id = l.service_id
  where l.id = target_lead_id limit 1;

  if lead_row is null then raise exception 'LEAD_NOT_FOUND'; end if;
  if lead_row.price_credits is not null then
    return query select lead_row.price_credits, lead_row.commercial_type,
      public.resolve_effective_lead_capacity(lead_row.commercial_type, lead_row.max_buyers),
      lead_row.buyers_count, lead_row.sales_status, null::uuid, 'lead_override'::text;
    return;
  end if;

  select * into rule_row
  from public.lead_pricing_rules rule
  where rule.active = true and rule.lead_type = lead_row.commercial_type
    and (rule.service_id is null or rule.service_id = lead_row.service_id)
    and (rule.service_slug is null or rule.service_slug = lead_row.service_slug)
    and (rule.subservice_slug is null or rule.subservice_slug = lead_row.subservice_slug)
    and (rule.min_score is null or lead_row.lead_score is null or lead_row.lead_score >= rule.min_score)
    and (rule.max_score is null or lead_row.lead_score is null or lead_row.lead_score <= rule.max_score)
  order by (rule.subservice_slug is not null) desc, (rule.service_id is not null) desc,
    (rule.service_slug is not null) desc, rule.priority desc, rule.created_at desc
  limit 1;

  if rule_row is null then
    return query select case when lead_row.commercial_type = 'exclusive' then 20 else 12 end,
      lead_row.commercial_type,
      public.resolve_effective_lead_capacity(lead_row.commercial_type, lead_row.max_buyers),
      lead_row.buyers_count, lead_row.sales_status, null::uuid, 'default'::text;
    return;
  end if;

  multiplier := coalesce(case when lead_row.commercial_type = 'exclusive'
    then rule_row.exclusive_multiplier else rule_row.shared_multiplier end, 1);
  return query select greatest(1, round(rule_row.base_price_credits * multiplier)::integer),
    lead_row.commercial_type,
    public.resolve_effective_lead_capacity(lead_row.commercial_type, lead_row.max_buyers),
    lead_row.buyers_count, lead_row.sales_status, rule_row.id, 'rule'::text;
end;
$$;

create or replace function public.resolve_pricing_experiment_assignment(
  target_lead_id uuid,
  target_professional_id uuid
)
returns table (price_credits integer, experiment_id uuid, variant_id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  lead_row record;
  professional_row record;
  baseline_row record;
  active_experiment public.experiments%rowtype;
  selected_variant public.experiment_variants%rowtype;
  stored_assignment public.pricing_experiment_assignments%rowtype;
  config_segment jsonb;
  bucket integer;
  cumulative integer := 0;
  candidate public.experiment_variants%rowtype;
  has_distribution_history boolean;
  assigned_experiment_id uuid;
  assigned_variant_id uuid;
  assigned_price integer;
begin
  if auth.role() <> 'service_role'
    and not (auth.role() = 'authenticated' and public.current_professional_id() = target_professional_id) then
    raise exception 'UNAUTHORIZED_PRICING_EXPERIMENT_ASSIGNMENT';
  end if;

  select * into stored_assignment
  from public.pricing_experiment_assignments
  where lead_id = target_lead_id and professional_id = target_professional_id;
  if found then
    return query select stored_assignment.assigned_price_credits,
      stored_assignment.experiment_id, stored_assignment.variant_id;
    return;
  end if;

  if exists (
    select 1 from public.lead_purchases
    where lead_id = target_lead_id and professional_id = target_professional_id
  ) then
    return;
  end if;

  select id, service_id, commercial_type, postal_code, sales_status
  into lead_row from public.leads where id = target_lead_id;
  if not found or lead_row.sales_status not in ('available', 'partially_sold') then return; end if;
  select id, status, verification_status into professional_row
  from public.professionals where id = target_professional_id;
  if not found or professional_row.status <> 'active' or professional_row.verification_status = 'rejected' then return; end if;

  select exists(select 1 from public.lead_distribution_runs where lead_id = target_lead_id)
  into has_distribution_history;
  if has_distribution_history then
    if not exists (
      select 1 from public.lead_distribution_candidates candidate_row
      join public.lead_distribution_runs run_row on run_row.id = candidate_row.distribution_run_id
      where candidate_row.lead_id = target_lead_id
        and candidate_row.professional_id = target_professional_id
        and run_row.status in ('pending', 'active')
        and candidate_row.status in ('offered', 'viewed')
        and (candidate_row.offer_expires_at is null or candidate_row.offer_expires_at > timezone('utc', now()))
    ) then return; end if;
  elsif not exists (
    select 1 from public.lead_matches match_row
    where match_row.lead_id = target_lead_id and match_row.professional_id = target_professional_id
  ) and not exists (
    select 1 from public.professional_services professional_service
    join public.professional_service_areas service_area on service_area.professional_id = professional_service.professional_id
    where professional_service.professional_id = target_professional_id
      and professional_service.service_id = lead_row.service_id
      and professional_service.active = true
      and service_area.postal_code_prefix = left(lead_row.postal_code, 4)
  ) then
    return;
  end if;

  select * into baseline_row from public.resolve_lead_price_baseline(target_lead_id);
  if baseline_row.price_credits not between 1 and 100 then return; end if;

  select * into active_experiment
  from public.experiments
  where experiment_type = 'pricing' and status = 'active' and slot = 'pricing.lead.offer'
  limit 1;
  assigned_price := baseline_row.price_credits;
  if found and public.is_valid_pricing_experiment_config(active_experiment.pricing_config) then
    config_segment := active_experiment.pricing_config->'segment';
    if (not (config_segment ? 'service_ids')
        or config_segment->'service_ids' @> to_jsonb(array[lead_row.service_id::text]))
      and (not (config_segment ? 'commercial_types')
        or config_segment->'commercial_types' @> to_jsonb(array[lead_row.commercial_type::text]))
      and (not (config_segment ? 'control_price_min')
        or baseline_row.price_credits >= (config_segment->>'control_price_min')::integer)
      and (not (config_segment ? 'control_price_max')
        or baseline_row.price_credits <= (config_segment->>'control_price_max')::integer)
      and (not (active_experiment.pricing_config->>'pilot_mode')::boolean
        or active_experiment.pricing_config->'pilot_professional_ids' @> to_jsonb(array[target_professional_id::text])) then
      bucket := mod(('x' || substr(md5(active_experiment.id::text || ':' || target_lead_id::text || ':' || target_professional_id::text), 1, 8))::bit(32)::bigint, 100)::integer;
      for candidate in
        select * from public.experiment_variants
        where experiment_variants.experiment_id = active_experiment.id
        order by key
      loop
        cumulative := cumulative + candidate.weight;
        if bucket < cumulative then
          selected_variant := candidate;
          exit;
        end if;
      end loop;

      if selected_variant.id is not null
        and (selected_variant.is_control
          or (selected_variant.price_credits between 1 and 100
            and abs(selected_variant.price_credits - baseline_row.price_credits) * 100 <= baseline_row.price_credits * 25)) then
        assigned_experiment_id := active_experiment.id;
        assigned_variant_id := selected_variant.id;
        assigned_price := case when selected_variant.is_control then baseline_row.price_credits else selected_variant.price_credits end;
      end if;
    end if;
  end if;

  insert into public.pricing_experiment_assignments (
    experiment_id, variant_id, lead_id, professional_id, control_price_credits,
    assigned_price_credits, context
  ) values (
    assigned_experiment_id, assigned_variant_id, target_lead_id, target_professional_id,
    baseline_row.price_credits, assigned_price,
    jsonb_build_object('service_id', lead_row.service_id, 'commercial_type', lead_row.commercial_type,
      'control_price_credits', baseline_row.price_credits)
  )
  on conflict (lead_id, professional_id) do nothing;

  select * into stored_assignment
  from public.pricing_experiment_assignments
  where lead_id = target_lead_id and professional_id = target_professional_id;
  if not found then return; end if;
  return query select stored_assignment.assigned_price_credits,
    stored_assignment.experiment_id, stored_assignment.variant_id;
end;
$$;

create or replace function public.resolve_pricing_experiment_assignments(
  target_lead_ids uuid[],
  target_professional_id uuid
)
returns table (lead_id uuid, price_credits integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_id uuid;
  resolved record;
begin
  if auth.role() <> 'service_role' then
    raise exception 'UNAUTHORIZED_PRICING_EXPERIMENT_ASSIGNMENT';
  end if;
  for target_id in select distinct unnest(coalesce(target_lead_ids, '{}'::uuid[])) loop
    select * into resolved
    from public.resolve_pricing_experiment_assignment(target_id, target_professional_id);
    if found then
      return query select target_id, resolved.price_credits;
    end if;
  end loop;
end;
$$;

create or replace function public.resolve_lead_price(target_lead_id uuid)
returns table (
  price_credits integer,
  commercial_type lead_commercial_type,
  max_buyers integer,
  buyers_count integer,
  sales_status lead_sales_status,
  pricing_rule_id uuid,
  price_source text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  baseline_row record;
  assigned_row record;
  professional_id uuid := public.current_professional_id();
begin
  select * into baseline_row from public.resolve_lead_price_baseline(target_lead_id);
  if professional_id is not null then
    begin
      select * into assigned_row
      from public.resolve_pricing_experiment_assignment(target_lead_id, professional_id);
      if found then
        return query select assigned_row.price_credits, baseline_row.commercial_type,
          baseline_row.max_buyers, baseline_row.buyers_count, baseline_row.sales_status,
          baseline_row.pricing_rule_id,
          case when assigned_row.experiment_id is null then baseline_row.price_source else 'pricing_experiment' end;
        return;
      end if;
    exception when others then
      null;
    end;
  end if;
  return query select baseline_row.price_credits, baseline_row.commercial_type,
    baseline_row.max_buyers, baseline_row.buyers_count, baseline_row.sales_status,
    baseline_row.pricing_rule_id, baseline_row.price_source;
end;
$$;

create or replace function public.enforce_lead_purchase_update()
returns trigger
language plpgsql
as $$
begin
  if new.lead_id <> old.lead_id
    or new.professional_id <> old.professional_id
    or new.price_credits <> old.price_credits
    or new.commercial_type <> old.commercial_type
    or new.wallet_transaction_id <> old.wallet_transaction_id
    or new.pricing_experiment_id is distinct from old.pricing_experiment_id
    or new.pricing_variant_id is distinct from old.pricing_variant_id
    or new.purchased_at <> old.purchased_at
    or coalesce(new.idempotency_key, '') <> coalesce(old.idempotency_key, '') then
    raise exception 'Lead purchase bronvelden zijn immutable.';
  end if;
  if old.lead_assignment_id is not null and new.lead_assignment_id <> old.lead_assignment_id then
    raise exception 'lead_assignment_id kan na koppeling niet meer wijzigen.';
  end if;
  if old.status = 'refunded' and new.status <> old.status then
    raise exception 'Een terugbetaalde purchase kan niet opnieuw wijzigen.';
  end if;
  if new.status = 'refunded' and (new.refunded_at is null or new.refund_transaction_id is null) then
    raise exception 'Refunded purchases vereisen refunded_at en refund_transaction_id.';
  end if;
  if old.refund_transaction_id is not null and new.refund_transaction_id <> old.refund_transaction_id then
    raise exception 'Een refundtransaction kan niet worden overschreven.';
  end if;
  return new;
end;
$$;

create or replace function public.snapshot_pricing_experiment_on_purchase()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  assignment_row public.pricing_experiment_assignments%rowtype;
begin
  select * into assignment_row
  from public.pricing_experiment_assignments
  where lead_id = new.lead_id and professional_id = new.professional_id;
  if found then
    if assignment_row.assigned_price_credits <> new.price_credits then
      raise exception 'PRICING_ASSIGNMENT_PRICE_MISMATCH';
    end if;
    new.pricing_experiment_id := assignment_row.experiment_id;
    new.pricing_variant_id := assignment_row.variant_id;
  else
    new.pricing_experiment_id := null;
    new.pricing_variant_id := null;
  end if;
  return new;
end;
$$;

create trigger snapshot_pricing_experiment_on_purchase
before insert on public.lead_purchases
for each row execute function public.snapshot_pricing_experiment_on_purchase();

create or replace function public.record_pricing_experiment_decision(
  target_experiment_id uuid,
  input_decision text,
  input_note text,
  input_actor_user_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  decision_id uuid;
begin
  if not public.is_admin() or auth.uid() is distinct from input_actor_user_id then
    raise exception 'UNAUTHORIZED_PRICING_EXPERIMENT_DECISION';
  end if;
  if not exists (
    select 1 from public.experiments
    where id = target_experiment_id and experiment_type = 'pricing'
      and status in ('paused', 'completed', 'archived')
  ) then
    raise exception 'PRICING_EXPERIMENT_MUST_BE_PAUSED_BEFORE_DECISION';
  end if;
  insert into public.pricing_experiment_decisions (experiment_id, decision, note, actor_user_id)
  values (target_experiment_id, input_decision, trim(input_note), input_actor_user_id)
  returning id into decision_id;
  insert into public.experiment_audit_log (
    experiment_id, actor_user_id, previous_status, next_status, action, metadata
  )
  select id, input_actor_user_id, status, status, 'decision_recorded',
    jsonb_build_object('decision', input_decision)
  from public.experiments where id = target_experiment_id;
  return decision_id;
end;
$$;

create or replace function public.prevent_pricing_experiment_assignment_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Pricingexperimenttoewijzingen zijn immutable.';
end;
$$;

create trigger prevent_pricing_experiment_assignments_update
before update or delete on public.pricing_experiment_assignments
for each row execute function public.prevent_pricing_experiment_assignment_mutation();

alter table public.pricing_experiment_assignments enable row level security;
alter table public.pricing_experiment_decisions enable row level security;
create policy "admins read pricing experiment assignments"
  on public.pricing_experiment_assignments for select using (public.is_admin());
create policy "admins read pricing experiment decisions"
  on public.pricing_experiment_decisions for select using (public.is_admin());

revoke all on public.pricing_experiment_assignments, public.pricing_experiment_decisions from public, anon, authenticated, service_role;
grant select on public.pricing_experiment_assignments, public.pricing_experiment_decisions to authenticated;
grant select on public.pricing_experiment_assignments, public.pricing_experiment_decisions to service_role;
grant select on public.experiments, public.experiment_variants, public.experiment_audit_log to authenticated;
grant select, insert, update on public.experiments, public.experiment_variants, public.experiment_audit_log to service_role;

revoke all on function public.is_valid_pricing_experiment_config(jsonb) from public, anon, authenticated;
revoke all on function public.guard_pricing_experiment_configuration() from public, anon, authenticated;
revoke all on function public.guard_pricing_experiment_variant() from public, anon, authenticated;
revoke all on function public.prevent_pricing_experiment_assignment_mutation() from public, anon, authenticated;
revoke all on function public.resolve_lead_price_baseline(uuid) from public, anon, authenticated;
revoke all on function public.resolve_pricing_experiment_assignment(uuid, uuid) from public, anon, authenticated;
revoke all on function public.resolve_pricing_experiment_assignments(uuid[], uuid) from public, anon, authenticated;
grant execute on function public.resolve_lead_price_baseline(uuid) to service_role;
grant execute on function public.resolve_pricing_experiment_assignment(uuid, uuid) to service_role;
grant execute on function public.resolve_pricing_experiment_assignments(uuid[], uuid) to service_role;

revoke all on function public.transition_experiment_status(uuid, text, uuid) from public, anon, authenticated;
grant execute on function public.transition_experiment_status(uuid, text, uuid) to service_role;
revoke all on function public.create_pricing_experiment(text, text, jsonb, text, integer, integer, integer, uuid) from public, anon, authenticated;
grant execute on function public.create_pricing_experiment(text, text, jsonb, text, integer, integer, integer, uuid) to service_role;
revoke all on function public.record_pricing_experiment_decision(uuid, text, text, uuid) from public, anon, authenticated;
grant execute on function public.record_pricing_experiment_decision(uuid, text, text, uuid) to authenticated;
