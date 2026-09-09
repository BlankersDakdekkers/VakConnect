create type wallet_transaction_type as enum (
  'credit_purchase',
  'lead_purchase',
  'refund',
  'admin_credit',
  'admin_debit',
  'promotional_credit',
  'correction'
);

create type lead_commercial_type as enum ('shared', 'exclusive');
create type lead_sales_status as enum ('unavailable', 'available', 'partially_sold', 'sold_out', 'closed');
create type lead_purchase_status as enum ('purchased', 'refunded', 'cancelled');

alter table public.leads
  add column if not exists subservice_slug text,
  add column if not exists commercial_type lead_commercial_type not null default 'shared',
  add column if not exists price_credits integer,
  add column if not exists max_buyers integer not null default 3,
  add column if not exists buyers_count integer not null default 0,
  add column if not exists sales_status lead_sales_status not null default 'available',
  add column if not exists locked_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_subservice_slug_format'
  ) then
    alter table public.leads
      add constraint leads_subservice_slug_format
      check (subservice_slug is null or subservice_slug ~ '^[a-z0-9-]+$');
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'leads_price_credits_positive'
  ) then
    alter table public.leads
      add constraint leads_price_credits_positive
      check (price_credits is null or price_credits > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'leads_buyer_counters_non_negative'
  ) then
    alter table public.leads
      add constraint leads_buyer_counters_non_negative
      check (buyers_count >= 0 and max_buyers >= 1);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'leads_sales_capacity_valid'
  ) then
    alter table public.leads
      add constraint leads_sales_capacity_valid
      check (
        (commercial_type = 'exclusive' and max_buyers = 1 and buyers_count <= 1)
        or (commercial_type = 'shared' and buyers_count <= max_buyers)
      );
  end if;
end
$$;

create table if not exists public.professional_wallets (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null unique references public.professionals(id) on delete cascade,
  cached_balance integer not null default 0 check (cached_balance >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lead_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete cascade,
  service_slug text,
  subservice_slug text,
  lead_type lead_commercial_type not null,
  base_price_credits integer not null check (base_price_credits > 0),
  exclusive_multiplier numeric(6,2) check (exclusive_multiplier is null or exclusive_multiplier > 0),
  shared_multiplier numeric(6,2) check (shared_multiplier is null or shared_multiplier > 0),
  min_score integer check (min_score is null or (min_score >= 0 and min_score <= 100)),
  max_score integer check (max_score is null or (max_score >= 0 and max_score <= 100)),
  active boolean not null default true,
  priority integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (service_slug is null or service_slug ~ '^[a-z0-9-]+$'),
  check (subservice_slug is null or subservice_slug ~ '^[a-z0-9-]+$'),
  check (min_score is null or max_score is null or min_score <= max_score)
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.professional_wallets(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  type wallet_transaction_type not null,
  amount integer not null check (amount <> 0),
  balance_after integer not null check (balance_after >= 0),
  lead_id uuid references public.leads(id) on delete set null,
  lead_assignment_id uuid references public.lead_assignments(id) on delete set null,
  reference text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_by_admin_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  check (jsonb_typeof(metadata) = 'object')
);

create table if not exists public.lead_purchases (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  lead_assignment_id uuid,
  price_credits integer not null check (price_credits > 0),
  commercial_type lead_commercial_type not null,
  wallet_transaction_id uuid not null unique references public.wallet_transactions(id) on delete restrict,
  refund_transaction_id uuid unique references public.wallet_transactions(id) on delete restrict,
  status lead_purchase_status not null default 'purchased',
  idempotency_key text,
  purchased_at timestamptz not null default timezone('utc', now()),
  refunded_at timestamptz,
  unique (lead_id, professional_id),
  check (status <> 'refunded' or refunded_at is not null),
  check (status <> 'refunded' or refund_transaction_id is not null),
  check (status <> 'cancelled' or refunded_at is null)
);

alter table public.lead_purchases
  add constraint lead_purchases_assignment_fk
  foreign key (lead_assignment_id) references public.lead_assignments(id) on delete set null;

alter table public.lead_assignments
  add column if not exists lead_purchase_id uuid unique references public.lead_purchases(id) on delete set null;

create table if not exists public.commercial_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_professional_id uuid references public.professionals(id) on delete set null,
  entity_type text not null check (entity_type in ('wallet', 'wallet_transaction', 'lead', 'lead_purchase', 'lead_pricing_rule')),
  entity_id uuid not null,
  action text not null check (
    action in (
      'wallet_credit',
      'wallet_debit',
      'lead_purchase',
      'refund',
      'pricing_change',
      'commercial_type_change'
    )
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  check (jsonb_typeof(metadata) = 'object')
);

create index if not exists professional_wallets_professional_idx on public.professional_wallets (professional_id);
create index if not exists wallet_transactions_wallet_created_idx on public.wallet_transactions (wallet_id, created_at desc);
create index if not exists wallet_transactions_professional_created_idx on public.wallet_transactions (professional_id, created_at desc);
create index if not exists wallet_transactions_lead_idx on public.wallet_transactions (lead_id);
create index if not exists lead_pricing_rules_lookup_idx on public.lead_pricing_rules (active, lead_type, priority desc, service_id, service_slug, subservice_slug);
create index if not exists lead_purchases_professional_created_idx on public.lead_purchases (professional_id, purchased_at desc);
create index if not exists lead_purchases_lead_status_idx on public.lead_purchases (lead_id, status, purchased_at desc);
create unique index if not exists lead_purchases_professional_idempotency_idx
  on public.lead_purchases (professional_id, idempotency_key)
  where idempotency_key is not null;
create index if not exists commercial_audit_log_entity_created_idx on public.commercial_audit_log (entity_type, entity_id, created_at desc);
create index if not exists leads_sales_status_idx on public.leads (sales_status, commercial_type, created_at desc);
create index if not exists leads_subservice_slug_idx on public.leads (subservice_slug);

create trigger set_professional_wallets_updated_at
before update on public.professional_wallets
for each row execute function public.set_updated_at();

create trigger set_lead_pricing_rules_updated_at
before update on public.lead_pricing_rules
for each row execute function public.set_updated_at();

create or replace function public.resolve_effective_lead_capacity(input_type lead_commercial_type, configured_max_buyers integer)
returns integer
language sql
immutable
as $$
  select case when input_type = 'exclusive' then 1 else greatest(coalesce(configured_max_buyers, 1), 1) end;
$$;

create or replace function public.append_commercial_audit_log(
  input_actor_user_id uuid,
  input_actor_professional_id uuid,
  input_entity_type text,
  input_entity_id uuid,
  input_action text,
  input_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.commercial_audit_log (
    actor_user_id,
    actor_professional_id,
    entity_type,
    entity_id,
    action,
    metadata
  ) values (
    input_actor_user_id,
    input_actor_professional_id,
    input_entity_type,
    input_entity_id,
    input_action,
    coalesce(input_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public.ensure_professional_wallet(target_professional_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_wallet_id uuid;
begin
  insert into public.professional_wallets (professional_id)
  values (target_professional_id)
  on conflict (professional_id) do nothing;

  select id
  into resolved_wallet_id
  from public.professional_wallets
  where professional_id = target_professional_id
  limit 1;

  if resolved_wallet_id is null then
    raise exception 'WALLET_NOT_FOUND';
  end if;

  return resolved_wallet_id;
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
set search_path = public
as $$
declare
  lead_row record;
  rule_row record;
  multiplier numeric(6,2);
begin
  select
    l.id,
    l.service_id,
    l.subservice_slug,
    l.commercial_type,
    l.price_credits,
    l.max_buyers,
    l.buyers_count,
    l.sales_status,
    l.lead_score,
    s.slug as service_slug
  into lead_row
  from public.leads l
  join public.services s on s.id = l.service_id
  where l.id = target_lead_id
  limit 1;

  if lead_row is null then
    raise exception 'LEAD_NOT_FOUND';
  end if;

  if lead_row.price_credits is not null then
    return query
    select
      lead_row.price_credits,
      lead_row.commercial_type,
      public.resolve_effective_lead_capacity(lead_row.commercial_type, lead_row.max_buyers),
      lead_row.buyers_count,
      lead_row.sales_status,
      null::uuid,
      'lead_override'::text;
    return;
  end if;

  select *
  into rule_row
  from public.lead_pricing_rules rule
  where rule.active = true
    and rule.lead_type = lead_row.commercial_type
    and (rule.service_id is null or rule.service_id = lead_row.service_id)
    and (rule.service_slug is null or rule.service_slug = lead_row.service_slug)
    and (rule.subservice_slug is null or rule.subservice_slug = lead_row.subservice_slug)
    and (rule.min_score is null or lead_row.lead_score is null or lead_row.lead_score >= rule.min_score)
    and (rule.max_score is null or lead_row.lead_score is null or lead_row.lead_score <= rule.max_score)
  order by
    (rule.subservice_slug is not null) desc,
    (rule.service_id is not null) desc,
    (rule.service_slug is not null) desc,
    rule.priority desc,
    rule.created_at desc
  limit 1;

  if rule_row is null then
    return query
    select
      case when lead_row.commercial_type = 'exclusive' then 20 else 12 end,
      lead_row.commercial_type,
      public.resolve_effective_lead_capacity(lead_row.commercial_type, lead_row.max_buyers),
      lead_row.buyers_count,
      lead_row.sales_status,
      null::uuid,
      'default'::text;
    return;
  end if;

  multiplier := coalesce(
    case
      when lead_row.commercial_type = 'exclusive' then rule_row.exclusive_multiplier
      else rule_row.shared_multiplier
    end,
    1
  );

  return query
  select
    greatest(1, round(rule_row.base_price_credits * multiplier)::integer),
    lead_row.commercial_type,
    public.resolve_effective_lead_capacity(lead_row.commercial_type, lead_row.max_buyers),
    lead_row.buyers_count,
    lead_row.sales_status,
    rule_row.id,
    'rule'::text;
end;
$$;

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
  )
  or exists (
    select 1
    from public.lead_assignments la
    where la.lead_id = target_lead_id
      and la.professional_id = target_professional_id
      and la.status = 'accepted'
      and (
        la.lead_purchase_id is null
        or exists (
          select 1
          from public.lead_purchases lp
          where lp.id = la.lead_purchase_id
            and lp.status = 'purchased'
        )
      )
  );
$$;

create or replace function public.refresh_lead_sales_state(target_lead_id uuid)
returns table (
  buyers_count integer,
  sales_status lead_sales_status,
  max_buyers integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  lead_row record;
  effective_capacity integer;
  purchased_count integer;
  next_status lead_sales_status;
begin
  select id, commercial_type, max_buyers, sales_status, locked_at
  into lead_row
  from public.leads
  where id = target_lead_id
  for update;

  if lead_row is null then
    raise exception 'LEAD_NOT_FOUND';
  end if;

  select count(*)::integer
  into purchased_count
  from public.lead_purchases
  where lead_id = target_lead_id
    and status = 'purchased';

  effective_capacity := public.resolve_effective_lead_capacity(lead_row.commercial_type, lead_row.max_buyers);

  if lead_row.sales_status in ('unavailable', 'closed') then
    next_status := lead_row.sales_status;
  elsif purchased_count = 0 then
    next_status := 'available';
  elsif purchased_count < effective_capacity then
    next_status := 'partially_sold';
  else
    next_status := 'sold_out';
  end if;

  update public.leads
  set
    buyers_count = purchased_count,
    sales_status = next_status,
    locked_at = case when next_status = 'sold_out' then coalesce(lead_row.locked_at, timezone('utc', now())) else null end,
    updated_at = timezone('utc', now())
  where id = target_lead_id;

  return query
  select purchased_count, next_status, effective_capacity;
end;
$$;

create or replace function public.prevent_wallet_transaction_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Wallet transacties zijn immutable.';
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

create trigger prevent_wallet_transactions_update
before update on public.wallet_transactions
for each row execute function public.prevent_wallet_transaction_mutation();

create trigger prevent_wallet_transactions_delete
before delete on public.wallet_transactions
for each row execute function public.prevent_wallet_transaction_mutation();

create trigger enforce_lead_purchases_update
before update on public.lead_purchases
for each row execute function public.enforce_lead_purchase_update();

create or replace function public.apply_wallet_transaction(
  target_professional_id uuid,
  transaction_type wallet_transaction_type,
  transaction_amount integer,
  transaction_lead_id uuid default null,
  transaction_lead_assignment_id uuid default null,
  transaction_reference text default null,
  transaction_description text default null,
  transaction_metadata jsonb default '{}'::jsonb,
  transaction_created_by_admin_id uuid default null
)
returns table (
  transaction_id uuid,
  wallet_id uuid,
  balance_after integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_wallet_id uuid;
  current_balance integer;
  next_balance integer;
  resolved_transaction_id uuid;
  actor_user_id uuid;
  actor_professional_id uuid;
begin
  if transaction_amount = 0 then
    raise exception 'ZERO_AMOUNT_NOT_ALLOWED';
  end if;

  if not (
    auth.role() = 'service_role'
    or public.is_admin()
    or (
      transaction_type = 'lead_purchase'
      and public.current_professional_id() = target_professional_id
    )
  ) then
    raise exception 'UNAUTHORIZED_WALLET_MUTATION';
  end if;

  resolved_wallet_id := public.ensure_professional_wallet(target_professional_id);

  select cached_balance
  into current_balance
  from public.professional_wallets
  where id = resolved_wallet_id
  for update;

  next_balance := current_balance + transaction_amount;

  if next_balance < 0 then
    raise exception 'INSUFFICIENT_BALANCE';
  end if;

  update public.professional_wallets
  set cached_balance = next_balance,
      updated_at = timezone('utc', now())
  where id = resolved_wallet_id;

  insert into public.wallet_transactions (
    wallet_id,
    professional_id,
    type,
    amount,
    balance_after,
    lead_id,
    lead_assignment_id,
    reference,
    description,
    metadata,
    created_by_admin_id
  ) values (
    resolved_wallet_id,
    target_professional_id,
    transaction_type,
    transaction_amount,
    next_balance,
    transaction_lead_id,
    transaction_lead_assignment_id,
    transaction_reference,
    transaction_description,
    coalesce(transaction_metadata, '{}'::jsonb),
    transaction_created_by_admin_id
  )
  returning id into resolved_transaction_id;

  actor_user_id := case when auth.role() = 'service_role' then transaction_created_by_admin_id else auth.uid() end;
  actor_professional_id := case when auth.role() = 'service_role' then null else public.current_professional_id() end;

  perform public.append_commercial_audit_log(
    actor_user_id,
    actor_professional_id,
    'wallet_transaction',
    resolved_transaction_id,
    case when transaction_amount > 0 then 'wallet_credit' else 'wallet_debit' end,
    jsonb_build_object(
      'type', transaction_type,
      'amount', transaction_amount,
      'balance_after', next_balance,
      'lead_id', transaction_lead_id,
      'lead_assignment_id', transaction_lead_assignment_id,
      'reference', transaction_reference
    )
  );

  return query
  select resolved_transaction_id, resolved_wallet_id, next_balance;
end;
$$;

create or replace function public.purchase_lead(
  target_lead_id uuid,
  purchase_idempotency_key text default null
)
returns table (
  purchase_id uuid,
  wallet_transaction_id uuid,
  lead_assignment_id uuid,
  balance_after integer,
  price_credits integer,
  commercial_type lead_commercial_type,
  sales_status lead_sales_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_professional uuid := public.current_professional_id();
  professional_row record;
  lead_row record;
  price_row record;
  existing_purchase record;
  existing_assignment record;
  wallet_row record;
  sales_row record;
  transaction_row record;
  purchased_count integer;
  resolved_purchase_id uuid;
  resolved_assignment_id uuid;
  now_utc timestamptz := timezone('utc', now());
  has_match boolean;
  has_live_eligibility boolean;
begin
  if current_professional is null then
    raise exception 'UNAUTHORIZED_PURCHASE';
  end if;

  select id, status, verification_status
  into professional_row
  from public.professionals
  where id = current_professional
  limit 1;

  if professional_row is null or professional_row.status <> 'active' or professional_row.verification_status = 'rejected' then
    raise exception 'PROFESSIONAL_NOT_ELIGIBLE';
  end if;

  if purchase_idempotency_key is not null then
    select id, wallet_transaction_id, lead_assignment_id, price_credits, commercial_type
    into existing_purchase
    from public.lead_purchases
    where professional_id = current_professional
      and idempotency_key = purchase_idempotency_key
    limit 1;

    if existing_purchase is not null then
      select balance_after into wallet_row from public.wallet_transactions where id = existing_purchase.wallet_transaction_id;
      select sales_status into lead_row from public.leads where id = target_lead_id;
      return query
      select
        existing_purchase.id,
        existing_purchase.wallet_transaction_id,
        existing_purchase.lead_assignment_id,
        wallet_row.balance_after,
        existing_purchase.price_credits,
        existing_purchase.commercial_type,
        lead_row.sales_status;
      return;
    end if;
  end if;

  select id, service_id, postal_code, commercial_type, max_buyers, buyers_count, sales_status
  into lead_row
  from public.leads
  where id = target_lead_id
  for update;

  if lead_row is null then
    raise exception 'LEAD_NOT_FOUND';
  end if;

  select id, wallet_transaction_id, lead_assignment_id, price_credits, commercial_type
  into existing_purchase
  from public.lead_purchases
  where lead_id = target_lead_id
    and professional_id = current_professional
  limit 1;

  if existing_purchase is not null then
    select balance_after into wallet_row from public.wallet_transactions where id = existing_purchase.wallet_transaction_id;
    return query
    select
      existing_purchase.id,
      existing_purchase.wallet_transaction_id,
      existing_purchase.lead_assignment_id,
      wallet_row.balance_after,
      existing_purchase.price_credits,
      existing_purchase.commercial_type,
      lead_row.sales_status;
    return;
  end if;

  if lead_row.sales_status in ('unavailable', 'closed', 'sold_out') then
    raise exception 'LEAD_NOT_AVAILABLE';
  end if;

  select exists (
    select 1
    from public.lead_matches lm
    where lm.lead_id = target_lead_id
      and lm.professional_id = current_professional
  ) into has_match;

  select exists (
    select 1
    from public.professional_services ps
    join public.professional_service_areas psa on psa.professional_id = ps.professional_id
    where ps.professional_id = current_professional
      and ps.service_id = lead_row.service_id
      and ps.active = true
      and psa.postal_code_prefix = left(lead_row.postal_code, 4)
  ) into has_live_eligibility;

  if not has_match and not has_live_eligibility then
    raise exception 'LEAD_MATCH_REQUIRED';
  end if;

  select * into price_row from public.resolve_lead_price(target_lead_id);

  select count(*)::integer
  into purchased_count
  from public.lead_purchases
  where lead_id = target_lead_id
    and status = 'purchased';

  if lead_row.commercial_type = 'exclusive' and purchased_count >= 1 then
    raise exception 'LEAD_SOLD_OUT';
  end if;

  if lead_row.commercial_type = 'shared' and purchased_count >= price_row.max_buyers then
    raise exception 'LEAD_SOLD_OUT';
  end if;

  select *
  into existing_assignment
  from public.lead_assignments
  where lead_id = target_lead_id
    and professional_id = current_professional
  limit 1;

  if existing_assignment is not null and existing_assignment.status = 'rejected' then
    raise exception 'ASSIGNMENT_ALREADY_REJECTED';
  end if;

  if existing_assignment is null then
    insert into public.lead_assignments (
      lead_id,
      professional_id,
      status,
      progress_status,
      assigned_at,
      viewed_at,
      accepted_at,
      progress_updated_at
    ) values (
      target_lead_id,
      current_professional,
      'accepted',
      'new',
      now_utc,
      now_utc,
      now_utc,
      now_utc
    )
    returning id into resolved_assignment_id;

    insert into public.lead_activity (lead_id, professional_id, actor_user_id, activity_type, created_at)
    values (target_lead_id, current_professional, auth.uid(), 'lead_assigned', now_utc);
  else
    update public.lead_assignments
    set
      status = 'accepted',
      viewed_at = coalesce(existing_assignment.viewed_at, now_utc),
      accepted_at = now_utc,
      rejected_at = null,
      progress_status = coalesce(existing_assignment.progress_status, 'new'),
      progress_updated_at = coalesce(existing_assignment.progress_updated_at, now_utc),
      loss_reason = null
    where id = existing_assignment.id
    returning id into resolved_assignment_id;
  end if;

  select *
  into transaction_row
  from public.apply_wallet_transaction(
    current_professional,
    'lead_purchase',
    -price_row.price_credits,
    target_lead_id,
    resolved_assignment_id,
    purchase_idempotency_key,
    'Lead aankoop',
    jsonb_build_object(
      'commercial_type', lead_row.commercial_type,
      'pricing_source', price_row.price_source,
      'pricing_rule_id', price_row.pricing_rule_id
    )
  );

  insert into public.lead_purchases (
    lead_id,
    professional_id,
    lead_assignment_id,
    price_credits,
    commercial_type,
    wallet_transaction_id,
    status,
    idempotency_key,
    purchased_at
  ) values (
    target_lead_id,
    current_professional,
    resolved_assignment_id,
    price_row.price_credits,
    lead_row.commercial_type,
    transaction_row.transaction_id,
    'purchased',
    purchase_idempotency_key,
    now_utc
  )
  returning id into resolved_purchase_id;

  update public.lead_assignments
  set lead_purchase_id = resolved_purchase_id
  where id = resolved_assignment_id;

  insert into public.lead_activity (lead_id, professional_id, actor_user_id, activity_type, created_at)
  values (target_lead_id, current_professional, auth.uid(), 'assignment_accepted', now_utc);

  perform public.append_commercial_audit_log(
    auth.uid(),
    current_professional,
    'lead_purchase',
    resolved_purchase_id,
    'lead_purchase',
    jsonb_build_object(
      'lead_id', target_lead_id,
      'price_credits', price_row.price_credits,
      'commercial_type', lead_row.commercial_type,
      'wallet_transaction_id', transaction_row.transaction_id
    )
  );

  select * into sales_row from public.refresh_lead_sales_state(target_lead_id);

  update public.leads
  set status = case
    when status in ('won', 'lost', 'closed') then status
    else 'accepted'
  end,
      updated_at = timezone('utc', now())
  where id = target_lead_id;

  return query
  select
    resolved_purchase_id,
    transaction_row.transaction_id,
    resolved_assignment_id,
    transaction_row.balance_after,
    price_row.price_credits,
    lead_row.commercial_type,
    sales_row.sales_status;
end;
$$;

create or replace function public.refund_lead_purchase(
  target_purchase_id uuid,
  refund_reason text,
  acting_admin_id uuid
)
returns table (
  purchase_id uuid,
  refund_transaction_id uuid,
  balance_after integer,
  sales_status lead_sales_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  purchase_row record;
  transaction_row record;
  sales_row record;
  now_utc timestamptz := timezone('utc', now());
begin
  if not (auth.role() = 'service_role' or public.is_admin()) then
    raise exception 'UNAUTHORIZED_REFUND';
  end if;

  select *
  into purchase_row
  from public.lead_purchases
  where id = target_purchase_id
  for update;

  if purchase_row is null then
    raise exception 'PURCHASE_NOT_FOUND';
  end if;

  if purchase_row.status <> 'purchased' or purchase_row.refund_transaction_id is not null then
    raise exception 'PURCHASE_ALREADY_REFUNDED';
  end if;

  select *
  into transaction_row
  from public.apply_wallet_transaction(
    purchase_row.professional_id,
    'refund',
    purchase_row.price_credits,
    purchase_row.lead_id,
    purchase_row.lead_assignment_id,
    concat('refund:', purchase_row.id::text),
    refund_reason,
    jsonb_build_object('purchase_id', purchase_row.id),
    acting_admin_id
  );

  update public.lead_purchases
  set
    status = 'refunded',
    refunded_at = now_utc,
    refund_transaction_id = transaction_row.transaction_id
  where id = target_purchase_id;

  if purchase_row.lead_assignment_id is not null then
    update public.lead_assignments
    set lead_purchase_id = null
    where id = purchase_row.lead_assignment_id;
  end if;

  perform public.append_commercial_audit_log(
    acting_admin_id,
    null,
    'lead_purchase',
    purchase_row.id,
    'refund',
    jsonb_build_object(
      'lead_id', purchase_row.lead_id,
      'refund_transaction_id', transaction_row.transaction_id,
      'reason', refund_reason
    )
  );

  select * into sales_row from public.refresh_lead_sales_state(purchase_row.lead_id);

  update public.leads
  set status = case
    when status in ('won', 'lost', 'closed') then status
    when sales_row.buyers_count = 0 then 'matched'
    else 'accepted'
  end,
      updated_at = timezone('utc', now())
  where id = purchase_row.lead_id;

  return query
  select purchase_row.id, transaction_row.transaction_id, transaction_row.balance_after, sales_row.sales_status;
end;
$$;

alter table public.professional_wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.lead_pricing_rules enable row level security;
alter table public.lead_purchases enable row level security;
alter table public.commercial_audit_log enable row level security;

drop policy if exists "professionals can read assigned leads" on public.leads;
create policy "professionals can read unlocked leads"
  on public.leads
  for select
  using (public.can_professional_view_lead_contact(leads.id));

drop policy if exists "professionals can read lead images for assigned leads" on public.lead_images;
create policy "professionals can read lead images for unlocked leads"
  on public.lead_images
  for select
  using (public.can_professional_view_lead_contact(lead_images.lead_id));

drop policy if exists "professionals can read lead answers for assigned leads" on public.lead_answers;
create policy "professionals can read lead answers for unlocked leads"
  on public.lead_answers
  for select
  using (public.can_professional_view_lead_contact(lead_answers.lead_id));

drop policy if exists "professionals can read lead activity for assigned leads" on public.lead_activity;
create policy "professionals can read lead activity for unlocked leads"
  on public.lead_activity
  for select
  using (public.can_professional_view_lead_contact(lead_activity.lead_id));

create policy "admins manage wallets"
  on public.professional_wallets
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read own wallet"
  on public.professional_wallets
  for select
  using (professional_id = public.current_professional_id());

create policy "admins read wallet transactions"
  on public.wallet_transactions
  for select
  using (public.is_admin());

create policy "professionals can read own wallet transactions"
  on public.wallet_transactions
  for select
  using (professional_id = public.current_professional_id());

create policy "admins manage lead pricing rules"
  on public.lead_pricing_rules
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins read lead purchases"
  on public.lead_purchases
  for select
  using (public.is_admin());

create policy "professionals can read own lead purchases"
  on public.lead_purchases
  for select
  using (professional_id = public.current_professional_id());

create policy "admins manage commercial audit log"
  on public.commercial_audit_log
  for all
  using (public.is_admin())
  with check (public.is_admin());

insert into public.lead_pricing_rules (
  service_id,
  service_slug,
  subservice_slug,
  lead_type,
  base_price_credits,
  exclusive_multiplier,
  shared_multiplier,
  min_score,
  max_score,
  active,
  priority
)
select
  s.id,
  s.slug,
  null,
  v.lead_type::lead_commercial_type,
  v.base_price_credits,
  v.exclusive_multiplier,
  v.shared_multiplier,
  v.min_score,
  v.max_score,
  true,
  v.priority
from public.services s
cross join (
  values
    ('shared', 10, 1.00::numeric, 1.00::numeric, null::integer, 49, 10),
    ('shared', 12, 1.00::numeric, 1.00::numeric, 50, 79, 20),
    ('shared', 15, 1.00::numeric, 1.00::numeric, 80, null::integer, 30),
    ('exclusive', 16, 1.35::numeric, 1.00::numeric, null::integer, 49, 10),
    ('exclusive', 18, 1.45::numeric, 1.00::numeric, 50, 79, 20),
    ('exclusive', 20, 1.60::numeric, 1.00::numeric, 80, null::integer, 30)
) as v(lead_type, base_price_credits, exclusive_multiplier, shared_multiplier, min_score, max_score, priority)
on conflict do nothing;

insert into public.professional_wallets (professional_id, cached_balance)
select p.id, 25
from public.professionals p
where not exists (
  select 1
  from public.professional_wallets w
  where w.professional_id = p.id
)
and p.status in ('active', 'pending');

insert into public.wallet_transactions (
  wallet_id,
  professional_id,
  type,
  amount,
  balance_after,
  reference,
  description,
  metadata
)
select
  w.id,
  w.professional_id,
  'promotional_credit',
  25,
  25,
  'seed-initial-credits',
  'Ontwikkel-/teststartcredits voor commerciële fase',
  jsonb_build_object('seed', true)
from public.professional_wallets w
where w.cached_balance = 25
  and not exists (
    select 1
    from public.wallet_transactions wt
    where wt.wallet_id = w.id
      and wt.reference = 'seed-initial-credits'
  );
