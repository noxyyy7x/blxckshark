-- Support real payment flow: orders start as 'pending_payment' when created
-- (before the customer pays), then get confirmed by the Revolut webhook —
-- never trust the client alone to mark something as paid.

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending_payment', 'processing', 'dispatched', 'delivered', 'cancelled'));

alter table public.orders add column if not exists referrer_id uuid references public.profiles(id);
alter table public.orders add column if not exists revolut_order_id text;
