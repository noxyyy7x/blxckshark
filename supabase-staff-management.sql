-- Auto-link a pending staff_users row (created by the owner beforehand)
-- to a real auth account the moment that person signs up with the same
-- email — extends the existing new-user trigger.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, referral_code)
  values (
    new.id,
    new.email,
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  );

  -- Link this new auth account to a pending staff invite, if one exists
  update public.staff_users
  set auth_id = new.id
  where email = new.email and auth_id is null;

  return new;
end;
$$ language plpgsql security definer;

-- Safe owner-check function (avoids the same recursion issue as is_staff)
create or replace function public.is_owner(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(select 1 from public.staff_users where auth_id = uid and is_owner = true);
$$;

-- Only the owner can create/edit staff accounts
create policy "Owner can create staff"
  on public.staff_users for insert
  with check (public.is_owner(auth.uid()));

create policy "Owner can update staff"
  on public.staff_users for update
  using (public.is_owner(auth.uid()));
