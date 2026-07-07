-- Allow referral cashout rewards to reuse the user_rewards table (which
-- already powers the customer Rewards page), distinguishing them from
-- tier-unlock rewards via a "source" column. tier_number becomes optional
-- since referral cashout codes aren't tied to a specific tier.

alter table public.user_rewards alter column tier_number drop not null;
alter table public.user_rewards add column if not exists source text default 'tier' not null check (source in ('tier', 'referral_cashout'));
