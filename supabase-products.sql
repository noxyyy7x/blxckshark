-- Real product catalog, replacing the mock data in lib/products.js

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category_group text not null check (category_group in ('Men', 'Women', 'Accessories')),
  category_type text not null,
  subcategory text not null,
  description text,
  fabric text,
  care text,
  fit_tags text[] default '{}',
  images text[] default '{}',
  price_gbp numeric not null,
  price_usd numeric not null,
  price_eur numeric not null,
  variants jsonb default '[]' not null, -- [{ "size": "M", "color": "Black", "stock": 12 }, ...]
  is_featured boolean default false not null,
  created_at timestamptz default now() not null
);

-- Anyone (including logged-out visitors) can view products — it's a public
-- storefront catalog
alter table public.products enable row level security;

create policy "Anyone can view products"
  on public.products for select
  using (true);

-- Only staff can create/edit/delete products
create policy "Staff can create products"
  on public.products for insert
  with check (public.is_staff(auth.uid()));

create policy "Staff can update products"
  on public.products for update
  using (public.is_staff(auth.uid()));

create policy "Staff can delete products"
  on public.products for delete
  using (public.is_staff(auth.uid()));
