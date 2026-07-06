-- Orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_ref text not null,
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  items jsonb not null,
  subtotal numeric not null,
  discount_amount numeric default 0 not null,
  shipping_cost numeric default 0 not null,
  total numeric not null,
  discount_code text,
  region text not null,
  shipping_address jsonb not null,
  status text default 'processing' not null check (status in ('processing', 'dispatched', 'delivered')),
  tracking_number text,
  created_at timestamptz default now() not null
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Note: inserts happen via the server-side API route (service role key),
-- not directly from the client, so no insert policy is needed for regular users.
