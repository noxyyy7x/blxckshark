-- Add display_name (username) field to profiles
alter table public.profiles add column if not exists display_name text;
