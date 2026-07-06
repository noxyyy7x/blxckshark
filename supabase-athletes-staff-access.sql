-- Allow staff to view and update ALL customer profiles (needed to
-- promote/demote athletes, set custom codes, view referral balances, etc.)

create policy "Staff can view all profiles"
  on public.profiles for select
  using (public.is_staff(auth.uid()));

create policy "Staff can update all profiles"
  on public.profiles for update
  using (public.is_staff(auth.uid()));
