-- BLXCKSHARK: profiles table + auto-creation trigger + RLS policies
-- Run this once in Supabase SQL Editor

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  xp integer default 0 not null,
  role text default 'customer' not null check (role in ('customer', 'athlete')),
  referral_code text unique,
  referral_balance numeric default 0 not null,
  dob date,
  followed_instagram boolean default false,
  followed_x boolean default false,
  followed_tiktok boolean default false,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- XP transaction log (Points History)
create table if not exists public.xp_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount integer not null,
  source text not null,
  created_at timestamptz default now() not null
);

-- Auto-create a profile row whenever someone signs up, with a random referral code
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, referral_code)
  values (
    new.id,
    new.email,
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security: users can only read/update their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

alter table public.xp_transactions enable row level security;

create policy "Users can view own xp transactions"
  on public.xp_transactions for select
  using (auth.uid() = user_id);
