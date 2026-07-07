-- Allow staff to view and update all cashout requests (needed for the
-- admin approval queue)

create policy "Staff can view all cashout requests"
  on public.cashout_requests for select
  using (public.is_staff(auth.uid()));

create policy "Staff can update cashout requests"
  on public.cashout_requests for update
  using (public.is_staff(auth.uid()));
