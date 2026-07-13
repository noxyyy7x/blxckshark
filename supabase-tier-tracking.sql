-- Tracks which tier the customer has already seen celebrated, so the
-- tier-up animation only ever shows once per tier, not on every page load.
alter table public.profiles add column if not exists last_seen_tier integer default 1;
