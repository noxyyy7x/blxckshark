-- Allow staff members to view and update ALL orders (not just their own),
-- needed for the admin Orders/Dispatch panel.

create policy "Staff can view all orders"
  on public.orders for select
  using (public.is_staff(auth.uid()));

create policy "Staff can update all orders"
  on public.orders for update
  using (public.is_staff(auth.uid()));
