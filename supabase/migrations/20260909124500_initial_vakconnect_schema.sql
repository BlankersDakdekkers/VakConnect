create extension if not exists pgcrypto;
create extension if not exists citext;

create type professional_status as enum ('pending', 'active', 'paused', 'suspended');
create type lead_status as enum ('new', 'qualified', 'matched', 'assigned', 'accepted', 'rejected', 'won', 'lost', 'closed');
create type lead_urgency as enum ('normal', 'urgent');
create type lead_preferred_timing as enum ('asap', 'few_weeks', 'one_to_three_months', 'later', 'unknown');
create type lead_assignment_status as enum ('pending', 'viewed', 'accepted', 'rejected');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.generate_lead_public_reference()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  output text := 'VC-';
  idx integer := 1;
begin
  while idx <= 8 loop
    output := output || substr(alphabet, 1 + floor(random() * length(alphabet))::integer, 1);
    idx := idx + 1;
  end loop;
  return output;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create or replace function public.enforce_lead_assignment_update()
returns trigger
language plpgsql
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.professional_id <> old.professional_id then
    raise exception 'Het professional_id veld kan niet worden gewijzigd.';
  end if;

  if new.lead_id <> old.lead_id then
    raise exception 'Het lead_id veld kan niet worden gewijzigd.';
  end if;

  if old.status in ('accepted', 'rejected') and new.status <> old.status then
    raise exception 'Een definitieve assignment status kan niet worden aangepast.';
  end if;

  if new.status not in ('viewed', 'accepted', 'rejected') then
    raise exception 'Alleen viewed, accepted of rejected statusupdates zijn toegestaan.';
  end if;

  if new.status = 'accepted' and (new.accepted_at is null or new.rejected_at is not null) then
    raise exception 'Accepted assignments moeten accepted_at hebben en rejected_at leeg laten.';
  end if;

  if new.status = 'rejected' and (new.rejected_at is null or new.accepted_at is not null) then
    raise exception 'Rejected assignments moeten rejected_at hebben en accepted_at leeg laten.';
  end if;

  if new.status = 'viewed' and (new.accepted_at is not null or new.rejected_at is not null) then
    raise exception 'Viewed assignments mogen geen accepted_at of rejected_at bevatten.';
  end if;

  return new;
end;
$$;

create table public.professionals (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  company_name text not null check (char_length(trim(company_name)) >= 2),
  contact_name text not null check (char_length(trim(contact_name)) >= 2),
  email citext not null unique,
  phone text not null check (char_length(trim(phone)) >= 8),
  kvk_number text,
  website text,
  status professional_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.current_professional_id()
returns uuid
language sql
stable
as $$
  select p.id
  from public.professionals p
  where p.auth_user_id = auth.uid()
  limit 1;
$$;

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  category text not null check (char_length(trim(category)) >= 2),
  description text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.professional_services (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  unique (professional_id, service_id)
);

create table public.professional_service_areas (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  postal_code_prefix text not null check (postal_code_prefix ~ '^[1-9][0-9]{3}$'),
  created_at timestamptz not null default timezone('utc', now()),
  unique (professional_id, postal_code_prefix)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique default public.generate_lead_public_reference(),
  service_id uuid not null references public.services(id) on delete restrict,
  first_name text not null check (char_length(trim(first_name)) >= 1),
  last_name text not null check (char_length(trim(last_name)) >= 1),
  email citext not null,
  phone text not null check (char_length(trim(phone)) >= 8),
  postal_code text not null check (postal_code ~ '^[1-9][0-9]{3}[A-Z]{2}$'),
  house_number text not null check (char_length(trim(house_number)) >= 1),
  house_number_addition text,
  city text,
  description text not null check (char_length(trim(description)) >= 20),
  urgency lead_urgency not null default 'normal',
  preferred_timing lead_preferred_timing,
  status lead_status not null default 'new',
  source text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.lead_images (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  storage_path text not null unique,
  mime_type text,
  file_size integer check (file_size is null or file_size > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.lead_assignments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete restrict,
  status lead_assignment_status not null default 'pending',
  assigned_at timestamptz not null default timezone('utc', now()),
  viewed_at timestamptz,
  accepted_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (lead_id, professional_id),
  check (accepted_at is null or status = 'accepted'),
  check (rejected_at is null or status = 'rejected')
);

create index professionals_status_idx on public.professionals (status);
create index services_active_idx on public.services (active);
create index professional_services_service_idx on public.professional_services (service_id, active);
create index professional_services_professional_idx on public.professional_services (professional_id);
create index professional_service_areas_prefix_idx on public.professional_service_areas (postal_code_prefix);
create index leads_service_idx on public.leads (service_id);
create index leads_status_idx on public.leads (status);
create index leads_postal_code_idx on public.leads (postal_code);
create index leads_created_at_idx on public.leads (created_at desc);
create index lead_assignments_professional_idx on public.lead_assignments (professional_id, status);
create index lead_assignments_lead_idx on public.lead_assignments (lead_id);
create index lead_images_lead_idx on public.lead_images (lead_id);

create trigger set_professionals_updated_at
before update on public.professionals
for each row execute function public.set_updated_at();

create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create trigger enforce_lead_assignments_update
before update on public.lead_assignments
for each row execute function public.enforce_lead_assignment_update();

alter table public.professionals enable row level security;
alter table public.services enable row level security;
alter table public.professional_services enable row level security;
alter table public.professional_service_areas enable row level security;
alter table public.leads enable row level security;
alter table public.lead_images enable row level security;
alter table public.lead_assignments enable row level security;

create policy "services are publicly readable when active"
  on public.services
  for select
  using (active = true or public.is_admin());

create policy "admins manage services"
  on public.services
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins manage professionals"
  on public.professionals
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read own profile"
  on public.professionals
  for select
  using (auth_user_id = auth.uid());

create policy "admins manage professional services"
  on public.professional_services
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read own services"
  on public.professional_services
  for select
  using (professional_id = public.current_professional_id());

create policy "admins manage professional areas"
  on public.professional_service_areas
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read own areas"
  on public.professional_service_areas
  for select
  using (professional_id = public.current_professional_id());

create policy "admins manage leads"
  on public.leads
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read assigned leads"
  on public.leads
  for select
  using (
    exists (
      select 1
      from public.lead_assignments la
      where la.lead_id = leads.id
        and la.professional_id = public.current_professional_id()
    )
  );

create policy "admins manage lead images"
  on public.lead_images
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read lead images for assigned leads"
  on public.lead_images
  for select
  using (
    exists (
      select 1
      from public.lead_assignments la
      where la.lead_id = lead_images.lead_id
        and la.professional_id = public.current_professional_id()
    )
  );

create policy "admins manage assignments"
  on public.lead_assignments
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read own assignments"
  on public.lead_assignments
  for select
  using (professional_id = public.current_professional_id());

create policy "professionals can update own assignments"
  on public.lead_assignments
  for update
  using (professional_id = public.current_professional_id())
  with check (
    professional_id = public.current_professional_id()
    and status in ('viewed', 'accepted', 'rejected')
    and (
      (status = 'viewed' and accepted_at is null and rejected_at is null)
      or (status = 'accepted' and accepted_at is not null and rejected_at is null)
      or (status = 'rejected' and rejected_at is not null and accepted_at is null)
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lead-images',
  'lead-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

create policy "admins manage lead image storage"
  on storage.objects
  for all
  using (bucket_id = 'lead-images' and public.is_admin())
  with check (bucket_id = 'lead-images' and public.is_admin());

insert into public.services (name, slug, category, description, active)
values
  ('Dakdekker', 'dakdekker', 'Dakwerk', 'Voor dakreparaties, inspecties en vervanging van dakbedekking.', true),
  ('Schilder', 'schilder', 'Schilderwerk', 'Binnen- en buitenschilderwerk voor onderhoud en renovatie.', true),
  ('Loodgieter', 'loodgieter', 'Installatie', 'Voor lekkages, leidingwerk en sanitair onderhoud.', true),
  ('Elektricien', 'elektricien', 'Installatie', 'Voor elektra, groepenkasten en storingen.', true),
  ('Isolatie', 'isolatie', 'Verduurzaming', 'Voor vloer-, gevel- en dakisolatieprojecten.', true),
  ('Badkamer verbouwen', 'badkamer-verbouwen', 'Verbouwing', 'Voor renovatie en complete badkamerprojecten.', true)
on conflict (slug) do nothing;
