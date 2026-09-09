do $$
begin
  if not exists (select 1 from pg_type where typname = 'contact_submission_status') then
    create type contact_submission_status as enum ('new', 'read', 'handled', 'spam');
  end if;
end
$$;

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  reason text not null check (reason in ('consument', 'vakman', 'algemeen')),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email citext not null,
  phone text check (phone is null or phone ~ '^[0-9+()\\-\\s]{8,30}$'),
  message text not null check (char_length(trim(message)) between 20 and 3000),
  status contact_submission_status not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);
create index contact_submissions_status_idx on public.contact_submissions (status);

create trigger set_contact_submissions_updated_at
before update on public.contact_submissions
for each row execute function public.set_updated_at();

alter table public.contact_submissions enable row level security;

create policy "admins manage contact submissions"
  on public.contact_submissions
  for all
  using (public.is_admin())
  with check (public.is_admin());
