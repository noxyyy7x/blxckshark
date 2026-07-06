-- Chats table — one row per customer's support conversation
create table if not exists public.chats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'open' not null check (status in ('open', 'closed')),
  claimed boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Messages within a chat
create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  sender_role text not null check (sender_role in ('customer', 'staff')),
  content text not null,
  created_at timestamptz default now() not null
);

alter table public.chats enable row level security;
alter table public.chat_messages enable row level security;

-- Customers can only see/manage their own chat
create policy "Users can view own chat"
  on public.chats for select
  using (auth.uid() = user_id);

create policy "Users can create own chat"
  on public.chats for insert
  with check (auth.uid() = user_id);

create policy "Users can view messages in own chat"
  on public.chat_messages for select
  using (
    chat_id in (select id from public.chats where user_id = auth.uid())
  );

create policy "Users can send messages in own chat"
  on public.chat_messages for insert
  with check (
    sender_role = 'customer'
    and chat_id in (select id from public.chats where user_id = auth.uid())
  );

-- Enable realtime updates for live chat
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.chats;
