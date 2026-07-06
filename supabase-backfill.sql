-- Backfill profiles for any existing auth users created before the trigger existed
insert into public.profiles (id, email, referral_code)
select
  id,
  email,
  upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
from auth.users
where id not in (select id from public.profiles);
