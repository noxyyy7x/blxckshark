import { supabase } from './supabaseClient'

// Manual promo codes (not tied to a referrer) — TODO: move to admin panel later
const MANUAL_CODES = {
  WELCOME10: { type: 'manual', percentOff: 10 },
}

const REFERRAL_PERCENT_OFF = { customer: 15, athlete: 20 }

// One code per order — checks manual codes first, then real referral/athlete
// codes from Supabase. currentUserId is used to block self-referral.
export async function validateDiscountCode(codeInput, currentUserId) {
  const code = codeInput.trim().toUpperCase()

  if (MANUAL_CODES[code]) {
    return { valid: true, code, ...MANUAL_CODES[code] }
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
