-- Customer message inbox — personal messages (reward unlocks) and
-- broadcasts (user_id NULL = sent to everyone, e.g. sale announcements).
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade, -- NULL = broadcast to all
  title text not null,
  body text not null,
  code text, -- optional discount code to show with a copy button
  created_at timestamptz default now() not null
);

-- Tracks when each customer last checked their inbox, to show an unread
-- badge without needing per-message read receipts (simple + good enough).
alter table public.profiles add column if not exists last_seen_messages_at timestamptz default now();

alter table public.messages enable row level security;

create policy "Users can view own messages and broadcasts"
  on public.messages for select
  using (auth.uid() = user_id or user_id is null);

create policy "Staff can send broadcast messages"
  on public.messages for insert
  with check (public.is_staff(auth.uid()) and user_id is null);
