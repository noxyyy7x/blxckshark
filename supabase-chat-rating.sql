-- Add rating capability to chats (thumbs up/down after chat closes, no comment)
alter table public.chats add column if not exists rating text check (rating in ('up', 'down'));
alter table public.chats add column if not exists rated_at timestamptz;

-- Allow customers to update their own chat's rating field (currently only
-- select/insert policies exist for customers, not update)
create policy "Users can rate own closed chat"
  on public.chats for update
  using (auth.uid() = user_id);
