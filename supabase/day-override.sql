-- Naledi Art Studio, day bookings that may take a date off other people.
--
-- Run this in the Supabase SQL editor, after schema.sql, admin.sql,
-- confirm-flow.sql and auto-expiry.sql. Safe to run more than once.
--
-- The rule: a half day or a full day may be booked on a date that already
-- has a few hours on it. Up to three of them are moved aside and Naledi
-- calls those clients herself. More than three is too much to unpick, so
-- the day is refused and the customer is asked to pick another day or book
-- by the hour. The whole thing happens in one transaction under a row
-- lock, so two people cannot both be told they have the same day.

-- ------------------------------------------------------------- statuses
-- Five states, and two constraints have accumulated across the earlier
-- scripts: bookings_status_valid from auto-expiry.sql and
-- bookings_status_check from confirm-flow.sql. Both are replaced here by
-- one, listing every status the system actually writes. Leaving 'expired'
-- out of the list is what made the first version of this script fail: rows
-- already carried it.
alter table public.bookings drop constraint if exists bookings_status_valid;
alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending', 'confirmed', 'cancelled', 'expired', 'displaced'));

-- Only a live booking holds a slot. Cancelled, expired and displaced rows
-- all release the time, so the list stays the one auto-expiry.sql settled
-- on rather than being restated as "not cancelled".
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

-- What a day booking did, so the dashboard can shout about it.
alter table public.bookings add column if not exists took_over    boolean not null default false;
alter table public.bookings add column if not exists displaced_of uuid references public.bookings (id);
alter table public.bookings add column if not exists displaced_at timestamptz;

create index if not exists bookings_took_over_idx
  on public.bookings (took_over) where took_over;

-- ------------------------------------------- marketing consent (POPIA)
-- Direct marketing by electronic means needs consent that was actually
-- given, so it is stored per booking with the moment it was given. A row
-- with false here must never be sent studio news.
alter table public.bookings
  add column if not exists marketing_opt_in boolean not null default false;
alter table public.bookings
  add column if not exists marketing_opt_in_at timestamptz;

create or replace function public.stamp_marketing_consent()
returns trigger language plpgsql as $$
begin
  if new.marketing_opt_in and new.marketing_opt_in_at is null then
    new.marketing_opt_in_at := now();
  end if;
  if not new.marketing_opt_in then
    new.marketing_opt_in_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_marketing_consent on public.bookings;
create trigger bookings_marketing_consent
  before insert or update of marketing_opt_in on public.bookings
  for each row execute function public.stamp_marketing_consent();

-- ----------------------------------------------------------------- book_day
-- Returns { ref, displaced } or raises. The client matches on the message.
drop function if exists public.book_day(text, text, text, timestamptz, timestamptz,
                                        text, text, text, text, text, int);
drop function if exists public.book_day(text, text, text, timestamptz, timestamptz,
                                        text, text, text, text, text, int, boolean);

create function public.book_day(
  p_service       text,
  p_service_name  text,
  p_amount        text,
  p_starts_at     timestamptz,
  p_ends_at       timestamptz,
  p_name          text,
  p_phone         text,
  p_email         text,
  p_notes         text,
  p_ref           text,
  p_max_displaced int default 3,
  p_marketing     boolean default false
) returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day   date;
  v_count int;
  v_id    uuid;
begin
  -- Durban is UTC+2 all year, so the calendar day is unambiguous.
  v_day := (p_starts_at at time zone 'Africa/Johannesburg')::date;

  if exists (select 1 from public.blocks where day = v_day) then
    raise exception 'DAY_BLOCKED';
  end if;

  -- Lock the date's live rows so two day bookings cannot both count three.
  select count(*) into v_count
  from public.bookings
  where status in ('pending', 'confirmed')
    and (starts_at at time zone 'Africa/Johannesburg')::date = v_day
  for update;

  if v_count > p_max_displaced then
    raise exception 'DAY_TOO_FULL';
  end if;

  insert into public.bookings
    (service, service_name, amount, starts_at, ends_at,
     name, phone, email, notes, ref, status, took_over, marketing_opt_in)
  values
    (p_service, p_service_name, p_amount, p_starts_at, p_ends_at,
     p_name, p_phone, p_email, p_notes, p_ref, 'pending', v_count > 0, p_marketing)
  returning id into v_id;

  -- Move what was on the date aside, pointing at the booking that took it.
  if v_count > 0 then
    update public.bookings
       set status = 'displaced', displaced_of = v_id, displaced_at = now()
     where id <> v_id
       and status in ('pending', 'confirmed')
       and (starts_at at time zone 'Africa/Johannesburg')::date = v_day;
  end if;

  return json_build_object('ref', p_ref, 'displaced', v_count);
end;
$$;

revoke all on function public.book_day(text, text, text, timestamptz, timestamptz,
                                       text, text, text, text, text, int, boolean) from public;
grant execute on function public.book_day(text, text, text, timestamptz, timestamptz,
                                          text, text, text, text, text, int, boolean) to anon, authenticated;

-- Auto-expiry releases unconfirmed holds. A displaced booking is not a hold
-- and must survive until Naledi has dealt with it: the sweep already filters
-- on status = 'pending', so it leaves displaced rows alone.

-- ------------------------------------------------------------------ check
-- What is actually in the table now, so nothing has to be guessed at.
select status, count(*) from public.bookings group by status order by status;
