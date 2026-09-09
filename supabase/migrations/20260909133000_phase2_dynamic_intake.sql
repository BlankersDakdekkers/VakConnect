create table public.service_questions (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  question text not null check (char_length(trim(question)) >= 3),
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  type text not null check (type in ('text', 'textarea', 'select', 'multiselect', 'radio', 'boolean', 'number')),
  help_text text,
  required boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (service_id, slug)
);

create table public.service_question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.service_questions(id) on delete cascade,
  label text not null check (char_length(trim(label)) >= 1),
  value text not null check (char_length(trim(value)) >= 1),
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  unique (question_id, value)
);

create table public.lead_answers (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  question_id uuid not null references public.service_questions(id) on delete cascade,
  answer_text text,
  answer_number numeric,
  answer_boolean boolean,
  answer_json jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (lead_id, question_id),
  check (num_nonnulls(answer_text, answer_number, answer_boolean, answer_json) >= 1)
);

alter table public.leads
  add column lead_score integer,
  add column score_reasons jsonb,
  add constraint leads_lead_score_range check (lead_score is null or (lead_score >= 0 and lead_score <= 100));

create table public.lead_matches (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  match_score integer not null check (match_score >= 0 and match_score <= 100),
  reasons jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (lead_id, professional_id)
);

create index service_questions_service_active_sort_idx on public.service_questions (service_id, active, sort_order);
create index service_question_options_question_active_sort_idx on public.service_question_options (question_id, active, sort_order);
create index lead_answers_lead_idx on public.lead_answers (lead_id);
create index lead_answers_question_idx on public.lead_answers (question_id);
create index leads_lead_score_idx on public.leads (lead_score desc);
create index lead_matches_lead_score_idx on public.lead_matches (lead_id, match_score desc);
create index lead_matches_professional_idx on public.lead_matches (professional_id);

create trigger set_service_questions_updated_at
before update on public.service_questions
for each row execute function public.set_updated_at();

alter table public.service_questions enable row level security;
alter table public.service_question_options enable row level security;
alter table public.lead_answers enable row level security;
alter table public.lead_matches enable row level security;

create policy "service questions are publicly readable when active"
  on public.service_questions
  for select
  using (active = true or public.is_admin());

create policy "admins manage service questions"
  on public.service_questions
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "service question options are publicly readable when active"
  on public.service_question_options
  for select
  using (
    active = true
    and exists (
      select 1
      from public.service_questions sq
      where sq.id = service_question_options.question_id
        and sq.active = true
    )
  );

create policy "admins manage service question options"
  on public.service_question_options
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read lead answers for assigned leads"
  on public.lead_answers
  for select
  using (
    exists (
      select 1
      from public.lead_assignments la
      where la.lead_id = lead_answers.lead_id
        and la.professional_id = public.current_professional_id()
    )
  );

create policy "admins manage lead answers"
  on public.lead_answers
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "professionals can read own lead matches"
  on public.lead_matches
  for select
  using (professional_id = public.current_professional_id());

create policy "admins manage lead matches"
  on public.lead_matches
  for all
  using (public.is_admin())
  with check (public.is_admin());

with dakdekker_service as (
  select id
  from public.services
  where slug = 'dakdekker'
  limit 1
),
seed_questions as (
  insert into public.service_questions (service_id, question, slug, type, required, active, sort_order)
  select dakdekker_service.id, v.question, v.slug, v.type, v.required, true, v.sort_order
  from dakdekker_service
  cross join (
    values
      ('Wat voor dak heeft de woning?', 'daktype-woning', 'radio', true, 10),
      ('Waar bevindt het probleem zich?', 'probleem-locatie', 'multiselect', true, 20),
      ('Is er actieve waterinloop?', 'actieve-waterinloop', 'radio', true, 30),
      ('Geschatte oppervlakte in m²', 'geschatte-oppervlakte', 'number', false, 40)
  ) as v(question, slug, type, required, sort_order)
  on conflict (service_id, slug) do update
    set question = excluded.question,
        type = excluded.type,
        required = excluded.required,
        active = excluded.active,
        sort_order = excluded.sort_order,
        updated_at = timezone('utc', now())
  returning id, slug
)
insert into public.service_question_options (question_id, label, value, sort_order, active)
select seed_questions.id, option_values.label, option_values.value, option_values.sort_order, true
from seed_questions
join (
  values
    ('daktype-woning', 'Hellend pannendak', 'hellend-pannendak', 10),
    ('daktype-woning', 'Plat dak', 'plat-dak', 20),
    ('daktype-woning', 'Beide', 'beide', 30),
    ('daktype-woning', 'Weet ik niet', 'weet-ik-niet', 40),
    ('probleem-locatie', 'Rond de schoorsteen', 'rond-de-schoorsteen', 10),
    ('probleem-locatie', 'Dakkapel', 'dakkapel', 20),
    ('probleem-locatie', 'Dakgoot', 'dakgoot', 30),
    ('probleem-locatie', 'Dakvlak', 'dakvlak', 40),
    ('probleem-locatie', 'Nok', 'nok', 50),
    ('probleem-locatie', 'Anders', 'anders', 60),
    ('actieve-waterinloop', 'Ja', 'ja', 10),
    ('actieve-waterinloop', 'Nee', 'nee', 20),
    ('actieve-waterinloop', 'Alleen bij regen', 'alleen-bij-regen', 30)
) as option_values(question_slug, label, value, sort_order)
  on option_values.question_slug = seed_questions.slug
on conflict (question_id, value) do update
  set label = excluded.label,
      sort_order = excluded.sort_order,
      active = excluded.active;
