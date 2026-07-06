-- Cashout requests table
create table if not exists public.cashout_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric not null,
  status text default 'pending' not null check (status in ('pending', 'paid', 'rejected')),
  created_at timestamptz default now() not null
);

alter table public.cashout_requests enable row level security;

create policy "Users can view own cashout requests"
  on public.cashout_requests for select
  using (auth.uid() = user_id);

create policy "Users can create own cashout requests"
  on public.cashout_requests for insert
  with check (auth.uid() = user_id);

-- Referral usage log (tracks each time a code is used, for history/auditing)
create table if not exists public.referral_uses (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references public.profiles(id) on delete cascade not null,
  referred_email text,
  order_amount numeric not null,
  commission_earned numeric not null,
  created_at timestamptz default now() not null
);

alter table public.referral_uses enable row level security;

create policy "Users can view own referral uses"
  on public.referral_uses for select
  using (auth.uid() = referrer_id);

-- Allow lookup of a profile by referral_code (needed to validate codes at checkout,
-- even for people not logged in / looking up someone else's code).
-- Only exposes non-sensitive fields via a view, not the full profiles table.
create or replace view public.referral_lookup as
select id, referral_code, role
from public.profiles
where referral_code is not null;

grant select on public.referral_lookup to anon, authenticated;
