import { getTierForXp } from './tiers'

// Checks if the customer has crossed into a new tier since we last showed
// them a celebration for it. If so, marks it as seen (so it never shows
// twice) and returns the new tier to celebrate. Returns null otherwise.
export async function checkAndMarkTierUp(supabase, userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, last_seen_tier')
    .eq('id', userId)
    .single()

  if (!profile) return null

  const currentTier = getTierForXp(profile.xp)
  const lastSeen = profile.last_seen_tier || 1

  if (currentTier.number > lastSeen) {
    await supabase.from('profiles').update({ last_seen_tier: currentTier.number }).eq('id', userId)
    return currentTier
  }

  return null
}
