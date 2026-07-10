-- Athlete signup applications — account is created immediately at signup,
-- but stays a regular customer until staff manually approve. Their chosen
-- vanity code is held separately and only goes live on approval.
alter table public.profiles add column if not exists pending_athlete_code text;
alter table public.profiles add column if not exists athlete_application_status text
  check (athlete_application_status in ('pending', 'approved', 'rejected'));

-- Staff already have "Staff can update all profiles" from the athletes
-- management feature, which covers approving/rejecting applications too.
