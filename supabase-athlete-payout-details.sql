-- Athlete bank payout details — separate table from profiles, so it's
-- never accidentally exposed alongside normal profile queries. Supports
-- both UK (sort code + account number) and international (IBAN/SWIFT).
create table if not exists public.athlete_payout_details (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  payout_type text not null check (payout_type in ('uk_bank', 'international')),
  account_name text not null,
  sort_code text,
  account_number text,
  iban text,
  swift_bic text,
  country text,
  updated_at timestamptz default now() not null
);

alter table public.athlete_payout_details enable row level security;

-- Athletes can view and manage only their own payout details
create policy "Users can view own payout details"
  on public.athlete_payout_details for select
  using (auth.uid() = user_id);

create policy "Users can insert own payout details"
  on public.athlete_payout_details for insert
  with check (auth.uid() = user_id);

create policy "Users can update own payout details"
  on public.athlete_payout_details for update
  using (auth.uid() = user_id);

-- Staff can VIEW any athlete's payout details (needed to actually send the
-- transfer) but can never edit them — only the athlete themselves can
-- change their own bank details, preventing staff from redirecting payouts.
create policy "Staff can view all payout details"
  on public.athlete_payout_details for select
  using (public.is_staff(auth.uid()));
