-- Wishlist — saved products per customer
create table if not exists public.wishlist_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (user_id, product_id)
);

alter table public.wishlist_items enable row level security;

create policy "Users can view own wishlist"
  on public.wishlist_items for select
  using (auth.uid() = user_id);

create policy "Users can add to own wishlist"
  on public.wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can remove from own wishlist"
  on public.wishlist_items for delete
  using (auth.uid() = user_id);
