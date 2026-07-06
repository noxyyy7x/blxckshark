-- Staff accounts (separate from customer profiles) with granular permissions
create table if not exists public.staff_users (
  id uuid default gen_random_uuid() primary key,
  auth_id uuid references auth.users(id) on delete cascade unique,
  name text not null,
  email text not null unique,
  is_owner boolean default false not null,
  permissions jsonb default '{}' not null,
  created_at timestamptz default now() not null
);

alter table public.staff_users enable row level security;

-- Any logged-in staff member can view the staff list (needed to show names,
-- not just their own record) — permissions themselves still gate what they
-- can DO in the admin panel, this is just visibility of who exists.
create policy "Staff can view all staff"
  on public.staff_users for select
  using (
    exists (select 1 from public.staff_users su where su.auth_id = auth.uid())
  );

-- Clock in/out shifts — tracks who's currently working and for how long
create table if not exists public.staff_shifts (
  id uuid default gen_random_uuid() primary key,
  staff_id uuid references public.staff_users(id) on delete cascade not null,
  clock_in timestamptz default now() not null,
  clock_out timestamptz,
  created_at timestamptz default now() not null
);

alter table public.staff_shifts enable row level security;

-- Any staff member can see everyone's shifts (needed for the live "who's
-- working" dashboard), but can only create/end their OWN shifts.
create policy "Staff can view all shifts"
  on public.staff_shifts for select
  using (
    exists (select 1 from public.staff_users su where su.auth_id = auth.uid())
  );

create policy "Staff can clock themselves in"
  on public.staff_shifts for insert
  with check (
    staff_id in (select id from public.staff_users where auth_id = auth.uid())
  );

create policy "Staff can clock themselves out"
  on public.staff_shifts for update
  using (
    staff_id in (select id from public.staff_users where auth_id = auth.uid())
  );

-- Seed the owner account — matched by your login email
insert into public.staff_users (auth_id, name, email, is_owner, permissions)
select id, 'Qasim', email, true,
  '{"orders": true, "athletes": true, "discounts": true, "cashouts": true, "chat": true, "leaderboard": true, "staff": true, "attendance": true}'::jsonb
from auth.users
where email = 'bossmann0xyyy@gmail.com'
on conflict (email) do nothing;
