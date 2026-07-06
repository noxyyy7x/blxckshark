-- Tier-unlocked reward codes (£5/£10/£15/£20 per tier)
create table if not exists public.user_rewards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tier_number integer not null,
  code text unique not null,
  amount numeric not null,
  redeemed boolean default false not null,
  created_at timestamptz default now() not null,
  unique (user_id, tier_number)
);

alter table public.user_rewards enable row level security;

create policy "Users can view own rewards"
  on public.user_rewards for select
  using (auth.uid() = user_id);

-- Lookup view so checkout can validate a reward code belongs to the
-- logged-in user without exposing everyone else's rewards
create or replace view public.reward_lookup as
select id, user_id, code, amount, redeemed
from public.user_rewards;

grant select on public.reward_lookup to authenticated;
