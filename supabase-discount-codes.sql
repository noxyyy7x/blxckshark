-- Manual discount codes (separate from referral/athlete codes, which live
-- on profiles.referral_code and are handled automatically)
create table if not exists public.discount_codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  percent_off integer not null check (percent_off > 0 and percent_off <= 100),
  active boolean default true not null,
  created_at timestamptz default now() not null
);

alter table public.discount_codes enable row level security;

-- Anyone can look up a code at checkout to validate it (only active ones)
create policy "Anyone can view active discount codes"
  on public.discount_codes for select
  using (active = true);

-- Only staff can view inactive codes / manage codes
create policy "Staff can view all discount codes"
  on public.discount_codes for select
  using (public.is_staff(auth.uid()));

create policy "Staff can create discount codes"
  on public.discount_codes for insert
  with check (public.is_staff(auth.uid()));

create policy "Staff can update discount codes"
  on public.discount_codes for update
  using (public.is_staff(auth.uid()));
