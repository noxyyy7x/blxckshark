-- Replace hardcoded owner-email chat policies with proper staff-wide ones,
-- using the same is_staff() function everything else uses. Since the owner
-- is already a staff_users row, they're automatically included — no need
-- for a separate owner-specific policy anymore.

drop policy if exists "Owner can view all chats" on public.chats;
drop policy if exists "Owner can update chats" on public.chats;
drop policy if exists "Owner can view all messages" on public.chat_messages;
drop policy if exists "Owner can send staff messages" on public.chat_messages;

create policy "Staff can view all chats"
  on public.chats for select
  using (public.is_staff(auth.uid()));

create policy "Staff can update all chats"
  on public.chats for update
  using (public.is_staff(auth.uid()));

create policy "Staff can view all chat messages"
  on public.chat_messages for select
  using (public.is_staff(auth.uid()));

create policy "Staff can send chat messages"
  on public.chat_messages for insert
  with check (public.is_staff(auth.uid()) and sender_role = 'staff');
