-- Naledi Art Studio — booking store
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- Design notes, because the anon key ships in the page and is public:
--   * Customers may INSERT a booking and nothing else.
--   * Customers may NOT read the bookings table — it holds names, phone
--     numbers and email addresses. They read a view that exposes only the
--     occupied time ranges, which is all the calendar needs.
--   * Double booking is prevented by the database itself, with an exclusion
--     constraint on overlapping ranges. Two people tapping the same slot at
--     the same instant cannot both win: the second INSERT is rejected.

create extension if not exists btree_gist;

-- ---------------------------------------------------------------- bookings
create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  service      text        not null,
  service_name text        not null,
  amount       text,
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  name         text        not null,
  phone        text,
  email        text,
  notes        text,
  ref          text        not null unique,
  status       text        not null default 'confirmed',
  created_at   timestamptz not null default now(),

  constraint sane_window check (ends_at > starts_at),
  constraint sane_length check (ends_at - starts_at <= interval '14 hours'),
  constraint not_past    check (starts_at > now() - interval '1 day'),
  constraint not_far     check (starts_at < now() + interval '1 year'),
  constraint sane_name   check (char_length(name) between 1 and 120),
  constraint sane_notes  check (notes is null or char_length(notes) <= 1000)
);

-- The real guarantee: no two confirmed bookings may overlap in time.
alter table public.bookings drop constraint if exists bookings_no_overlap;
alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (tstzrange(starts_at, ends_at) with &&)
  where (status = 'confirmed');

create index if not exists bookings_starts_at_idx on public.bookings (starts_at);

-- ------------------------------------------------------------------ blocks
-- Dates the studio has closed by hand (holidays, an existing shoot).
create table if not exists public.blocks (
  day        date primary key,
  reason     text,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------- RLS
alter table public.bookings enable row level security;
alter table public.blocks   enable row level security;

drop policy if exists "anon may create a booking" on public.bookings;
create policy "anon may create a booking"
  on public.bookings for insert to anon
  with check (status = 'confirmed');
-- No select/update/delete policy for anon, so all three are denied.

drop policy if exists "anon may read closed dates" on public.blocks;
create policy "anon may read closed dates"
  on public.blocks for select to anon using (true);

-- ------------------------------------------------- public availability view
-- Occupied ranges only. No name, phone, email or notes.
-- The view runs as its owner, so it can read the table the customer cannot.
drop view if exists public.availability;
create view public.availability as
  select starts_at, ends_at
  from public.bookings
  where status = 'confirmed';

grant select on public.availability to anon;
grant insert on public.bookings     to anon;
grant select on public.blocks       to anon;
