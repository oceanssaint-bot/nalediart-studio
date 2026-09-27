-- Naledi Art Studio — two-stage booking
--
-- Before: a customer booking was created 'confirmed', so there was nothing
-- left for Naledi to confirm. Now:
--
--   pending    customer asked. The slot IS held so nobody else can take it,
--              but Naledi has not spoken to them yet.
--   confirmed  Naledi pressed Confirm. Call made, deposit agreed. Locked.
--   cancelled  slot released, immediately bookable again.
--
-- The important part is that pending still blocks the time. If it did not,
-- two people could request the same Saturday morning and one would have to
-- be turned away.
--
-- ORDER MATTERS. The live site currently sends status='confirmed'. Part 1
-- accepts BOTH values so nothing breaks while the new build rolls out. Run
-- Part 2 once the site is redeployed, to lock customers to requests only.

-- =====================================================================
-- PART 1 — run this now. The live site keeps working throughout.
-- =====================================================================

alter table public.bookings drop constraint if exists bookings_status_valid;
alter table public.bookings add constraint bookings_status_valid
  check (status in ('pending', 'confirmed', 'cancelled'));

alter table public.bookings alter column status set default 'pending';
alter table public.bookings add column if not exists confirmed_at timestamptz;

-- A held slot blocks others whether or not it has been confirmed yet.
alter table public.bookings drop constraint if exists bookings_no_overlap;
alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (tstzrange(starts_at, ends_at) with &&)
  where (status <> 'cancelled');

-- Transitional: tolerate the old build and the new one at the same time.
drop policy if exists "anon may create a booking" on public.bookings;
create policy "anon may create a booking"
  on public.bookings for insert to anon
  with check (status in ('pending', 'confirmed'));

-- The public calendar must show pending slots as taken, not just confirmed.
drop view if exists public.availability;
create view public.availability as
  select starts_at, ends_at
  from public.bookings
  where status <> 'cancelled';

grant select on public.availability to anon, authenticated;

select status, count(*) from public.bookings group by status order by status;


-- =====================================================================
-- PART 2 — run only AFTER the new site is live.
-- Locks customers to creating requests. Confirming becomes Naledi's alone,
-- since updates are already restricted to allowlisted admins.
-- =====================================================================
--
-- drop policy if exists "anon may create a booking" on public.bookings;
-- create policy "anon may create a booking"
--   on public.bookings for insert to anon
--   with check (status = 'pending');
