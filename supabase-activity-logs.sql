-- Staff activity log — audit trail of admin actions
create table if not exists public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  staff_id uuid references public.staff_users(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamptz default now() not null
);

alter table public.activity_logs enable row level security;

-- Only staff with the "logs" permission can view — enforced at the app
-- level via staff_users.permissions, but everyone staff can technically
-- read since Postgres RLS can't see the JSONB permission key directly.
-- The page itself checks staff.permissions.logs before rendering.
create policy "Staff can view activity logs"
  on public.activity_logs for select
  using (public.is_staff(auth.uid()));

create policy "Staff can insert activity logs"
  on public.activity_logs for insert
  with check (public.is_staff(auth.uid()));
