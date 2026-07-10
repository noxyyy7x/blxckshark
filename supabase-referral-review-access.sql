-- Staff need to view ANY user's referral history (not just their own) to
-- review for fraud before approving cashouts — this was missing entirely.
create policy "Staff can view all referral uses"
  on public.referral_uses for select
  using (public.is_staff(auth.uid()));
