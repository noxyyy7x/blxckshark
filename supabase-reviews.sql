-- Product reviews — submitted by customers, moderated by staff before
-- appearing publicly (per spec: Sanity-style approval workflow, now via
-- Supabase + admin panel instead)
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  image_url text,
  status text default 'pending' not null check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now() not null
);

alter table public.reviews enable row level security;

-- Anyone can view approved reviews (public storefront)
create policy "Anyone can view approved reviews"
  on public.reviews for select
  using (status = 'approved');

-- Users can view their own reviews regardless of status
create policy "Users can view own reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

-- Logged-in users can submit a review
create policy "Users can submit reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

-- Staff can view/moderate all reviews
create policy "Staff can view all reviews"
  on public.reviews for select
  using (public.is_staff(auth.uid()));

create policy "Staff can update reviews"
  on public.reviews for update
  using (public.is_staff(auth.uid()));
