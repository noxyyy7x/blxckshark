-- 1. Social follow XP claiming — add missing threads column
alter table public.profiles add column if not exists followed_threads boolean default false;

-- 2. Guest checkout -> account creation bonus tracking
alter table public.orders add column if not exists guest_signup_bonus boolean default false;

-- 3. Settings: saved address book
create table if not exists public.saved_addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  label text not null default 'Address',
  name text not null,
  line1 text not null,
  city text not null,
  postcode text not null,
  is_default boolean default false not null,
  created_at timestamptz default now() not null
);

alter table public.saved_addresses enable row level security;

create policy "Users can view own addresses"
  on public.saved_addresses for select
  using (auth.uid() = user_id);

create policy "Users can insert own addresses"
  on public.saved_addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.saved_addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.saved_addresses for delete
  using (auth.uid() = user_id);
