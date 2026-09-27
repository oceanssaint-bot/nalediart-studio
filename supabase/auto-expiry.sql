-- Naledi Art Studio — auto-expiry of unconfirmed requests
--
-- The site tells customers a slot is held while Naledi confirms. Without
-- expiry, someone who never answers their phone holds that time forever.
--
-- A request that sits unconfirmed for longer than the hold window becomes
-- 'expired' and the slot is released. 'expired' is kept distinct from
-- 'cancelled' so Naledi can tell "this lapsed on its own" from "I cancelled
-- this" — they are different conversations with a customer.
--
-- A request whose appointment has already started is left alone. Auto-marking
-- something that may well have happened would be wrong, and a past slot
-- blocks nothing bookable anyway.

-- ------------------------------------------------- status and constraints
alter table public.bookings drop constraint if exists bookings_status_valid;
alter table public.bookings add constraint bookings_status_valid
  check (status in ('pending', 'confirmed', 'cancelled', 'expired'));

-- Only live rows hold a slot. Widening this from "not cancelled" to an
-- explicit list is what actually frees the time when a request lapses.
alter table public.bookings drop constraint if exists bookings_no_overlap;
alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (tstzrange(starts_at, ends_at) with &&)
  where (status in ('pending', 'confirmed'));

drop view if exists public.availability;
create view public.availability as
  select starts_at, ends_at
  from public.bookings
  where status in ('pending', 'confirmed');

grant select on public.availability to anon, authenticated;

-- ------------------------------------------------------------ the sweep
-- Change the default here to change the hold window.
create or replace function public.expire_stale_requests(hold_hours int default 48)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  update public.bookings
     set status = 'expired'
   where status = 'pending'
     and created_at < now() - make_interval(hours => hold_hours)
     and starts_at > now();
  get diagnostics n = row_count;
  return n;
end;
$$;

revoke all on function public.expire_stale_requests(int) from public, anon;

-- ------------------------------------------------------------- schedule
-- Every 15 minutes, so a released slot reappears quickly rather than at the
-- top of the hour. The job is idempotent: it only ever touches rows that are
-- still pending and already past the window.
create extension if not exists pg_cron;

select cron.unschedule('expire-stale-booking-requests')
where exists (select 1 from cron.job where jobname = 'expire-stale-booking-requests');

select cron.schedule(
  'expire-stale-booking-requests',
  '*/15 * * * *',
  $job$select public.expire_stale_requests(48)$job$
);

-- Confirm it is registered.
select jobname, schedule, active from cron.job
where jobname = 'expire-stale-booking-requests';
