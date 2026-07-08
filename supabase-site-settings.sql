-- Simple key-value site settings, editable from admin panel.
-- Starts with the notification bar message, extensible for other
-- site-wide settings later (maintenance mode, etc.)
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now() not null
);

insert into public.site_settings (key, value)
values ('notification_bar', 'FREE SHIPPING ON UK ORDERS OVER £50 · OPENING SOON')
on conflict (key) do nothing;

alter table public.site_settings enable row level security;

-- Anyone can read settings (the notification bar needs to load for all visitors)
create policy "Anyone can view site settings"
  on public.site_settings for select
  using (true);

-- Only staff can update settings
create policy "Staff can update site settings"
  on public.site_settings for update
  using (public.is_staff(auth.uid()));

create policy "Staff can insert site settings"
  on public.site_settings for insert
  with check (public.is_staff(auth.uid()));
