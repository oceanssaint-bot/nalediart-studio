-- Naledi Art Studio — studio dashboard access
-- Run in the Supabase SQL editor AFTER schema.sql. Safe to re-run.
--
-- Why this exists: a static site has no server, so a password checked in
-- JavaScript protects nothing — the source is public. Instead, Supabase Auth
-- verifies the password and issues a JWT, and these policies decide what that
-- JWT may read. The page never sees or stores a password.
--
-- Being signed in is NOT enough. A row in `admins` is required, so even if
-- someone creates an account they can read nothing.

create table if not exists public.admins (
  uid      uuid primary key references auth.users(id) on delete cascade,
  label    text,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- security definer so the check can read `admins` despite RLS being on it.
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where uid = auth.uid());
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------- policies
drop policy if exists "admins read bookings"    on public.bookings;
drop policy if exists "admins update bookings"  on public.bookings;
drop policy if exists "admins delete bookings"  on public.bookings;
drop policy if exists "admins manage blocks"    on public.blocks;
drop policy if exists "admins see own row"      on public.admins;

create policy "admins read bookings"   on public.bookings for select to authenticated using (public.is_admin());
create policy "admins update bookings" on public.bookings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins delete bookings" on public.bookings for delete to authenticated using (public.is_admin());

create policy "admins manage blocks"   on public.blocks   for all    to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "admins see own row"     on public.admins   for select to authenticated using (uid = auth.uid());

grant select, update, delete on public.bookings to authenticated;
grant select, insert, delete on public.blocks   to authenticated;
grant select                 on public.admins   to authenticated;
grant select                 on public.availability to authenticated;

-- ------------------------------------------------------------ allowlist
-- Create the user first: Dashboard -> Authentication -> Users -> Add user
-- (email naledi@nalediart.com, choose a password there). Then this line
-- grants it access. Change the address if you use a different one.
insert into public.admins (uid, label)
select id, 'Naledi' from auth.users where email = 'naledi@nalediart.com'
on conflict (uid) do nothing;

-- Confirm it worked: this should return one row.
select a.uid, a.label, u.email from public.admins a join auth.users u on u.id = a.uid;
