-- Add optional expiry to messages (mainly for broadcasts — e.g. a 48hr
-- sale announcement disappears from inboxes automatically once it lapses)
alter table public.messages add column if not exists expires_at timestamptz;
