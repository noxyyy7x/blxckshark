-- Grants your account (the owner) full visibility into all chats.
-- This is a temporary stand-in for proper staff roles/permissions,
-- which will replace this once the full admin panel with staff
-- accounts is built. Replace the email below if needed.

create policy "Owner can view all chats"
  on public.chats for select
  using (auth.email() = 'bossmann0xyyy@gmail.com');

create policy "Owner can update chats"
  on public.chats for update
  using (auth.email() = 'bossmann0xyyy@gmail.com');

create policy "Owner can view all messages"
  on public.chat_messages for select
  using (auth.email() = 'bossmann0xyyy@gmail.com');

create policy "Owner can send staff messages"
  on public.chat_messages for insert
  with check (
    auth.email() = 'bossmann0xyyy@gmail.com'
    and sender_role = 'staff'
  );
