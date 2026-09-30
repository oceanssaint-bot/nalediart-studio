-- Naledi Art Studio, the details that go on an invoice.
--
-- Run this in the Supabase SQL editor after the other scripts.
--
-- WHY THIS IS A TABLE AND NOT A CONSTANT IN THE PAGE
-- studio.html is served from GitHub Pages. Anyone can read its source
-- without signing in, so anything written into it is public. A bank account
-- number printed on an invoice is not a secret, but publishing it on the
-- open web is a different thing from sending it to a client: altered
-- banking details on a forged invoice is one of the commonest frauds
-- against small studios, and an exposed account makes impersonation easy.
-- So the details sit behind the same admin login as the bookings.

create table if not exists public.studio_settings (
  id           int primary key default 1,
  trading_name text,
  address      text,     -- newlines are kept, one line per line
  phone        text,
  email        text,
  reg_no       text,     -- CIPC registration, blank for a sole proprietor
  vat_no       text,     -- blank unless registered for VAT
  bank         text,     -- what the invoice prints under Banking
  terms        text,     -- payment terms, one line
  notes        text,     -- the "Kindly note" block
  thanks       text,     -- the closing line
  updated_at   timestamptz not null default now(),

  constraint one_row check (id = 1)
);

alter table public.studio_settings enable row level security;

-- Only an allowlisted studio account may read or write it. is_admin() comes
-- from admin.sql; anon gets nothing at all, which is the point.
drop policy if exists "admins read settings"  on public.studio_settings;
drop policy if exists "admins write settings" on public.studio_settings;

create policy "admins read settings"
  on public.studio_settings for select to authenticated
  using (public.is_admin());

create policy "admins write settings"
  on public.studio_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- A row must exist for the dashboard to update. The real values are not in
-- this file on purpose: it is committed to a public repository. Paste the
-- filled-in update separately, straight into the SQL editor.
insert into public.studio_settings (id) values (1)
on conflict (id) do nothing;

-- Template. Fill it in and run it in the SQL editor; do not commit it.
--
-- update public.studio_settings set
--   trading_name = 'Naledi Art',
--   address      = E'Unit 603, 6th Floor\n39 Station Drive, Greyville\nDurban 4001\nSouth Africa',
--   phone        = '065 838 1532',
--   email        = 'naledi@nalediart.com',
--   reg_no       = '',
--   vat_no       = '',
--   bank         = E'FNB\nName: NALEDI ART STUDIO\nAccount: 0000000000\nBranch: 250655\nReference: your name',
--   terms        = 'Due on receipt',
--   notes        = E'No refunds.\nOne free date and time change, up to 24 hours before the booking.\nThe studio keeps the right to use photographs and video made here in its own marketing, on the website, on social media and in print. Tell us on the day if something must not be published.',
--   thanks       = 'Thank you for your support. Welcome to the creative family.',
--   updated_at   = now()
-- where id = 1;

-- --------------------------------------------------- do not publish (POPIA)
-- The studio's default is that work made here may be used in its own
-- marketing. A client may say no, and that has to be recorded against the
-- booking rather than remembered from a conversation on the day.
alter table public.bookings
  add column if not exists no_publish boolean not null default false;

drop function if exists public.book_day(text, text, text, timestamptz, timestamptz,
                                       text, text, text, text, text, int, boolean);

create or replace function public.book_day(
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
  p_max_displaced int     default 3,
  p_marketing     boolean default false,
  p_no_publish    boolean default false
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
  v_day := (p_starts_at at time zone 'Africa/Johannesburg')::date;

  if exists (select 1 from public.blocks where day = v_day) then
    raise exception 'DAY_BLOCKED';
  end if;

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
     name, phone, email, notes, ref, status, took_over, marketing_opt_in, no_publish)
  values
    (p_service, p_service_name, p_amount, p_starts_at, p_ends_at,
     p_name, p_phone, p_email, p_notes, p_ref, 'pending', v_count > 0, p_marketing, p_no_publish)
  returning id into v_id;

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

grant execute on function public.book_day(text, text, text, timestamptz, timestamptz,
                                          text, text, text, text, text, int, boolean, boolean)
  to anon, authenticated;

select 'studio_settings and no_publish ready' as status;
