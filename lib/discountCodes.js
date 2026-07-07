import { supabase } from './supabaseClient'

const REFERRAL_PERCENT_OFF = { customer: 15, athlete: 20 }

// One code per order — checks manual discount codes (from admin panel) first,
// then tier reward codes (fixed £ amount, must belong to the logged-in user),
// then real referral/athlete codes from Supabase. currentUserId is used to
// block self-referral and to verify reward code ownership.
export async function validateDiscountCode(codeInput, currentUserId) {
  const code = codeInput.trim().toUpperCase()

  // Manual discount codes (admin-managed)
  const { data: manualCode } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .maybeSingle()

  if (manualCode) {
    return { valid: true, code, type: 'manual', percentOff: manualCode.percent_off }
  }

  // Check tier reward codes (only valid for their owner, and only once)
  if (currentUserId) {
    const { data: reward } = await supabase
      .from('reward_lookup')
      .select('*')
      .eq('code', code)
      .eq('user_id', currentUserId)
      .single()

    if (reward) {
      if (reward.redeemed) {
        return { valid: false, alreadyRedeemed: true }
      }
      return { valid: true, code, type: 'reward', amountOff: Number(reward.amount) }
    }
  }

  const { data, error } = await supabase
    .from('referral_lookup')
    .select('id, referral_code, role')
    .eq('referral_code', code)
    .single()

  if (error || !data) {
    return { valid: false }
  }

  if (currentUserId && data.id === currentUserId) {
    return { valid: false, selfReferral: true }
  }

  return {
    valid: true,
    code,
    type: data.role === 'athlete' ? 'athlete' : 'referral',
    percentOff: REFERRAL_PERCENT_OFF[data.role] ?? REFERRAL_PERCENT_OFF.customer,
    referrerId: data.id,
  }
}
