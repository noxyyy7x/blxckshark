// Mock discount/referral/athlete codes for testing the checkout flow.
// TODO: replace with a real lookup against Supabase "discount_codes" table
// once the admin panel exists. One code per order — no stacking (per spec).

const MOCK_CODES = {
  WELCOME10: { type: 'manual', percentOff: 10 },
  QASIM20: { type: 'athlete', percentOff: 20 },
  FRIEND15: { type: 'referral', percentOff: 15 },
}

export function validateDiscountCode(code) {
  const match = MOCK_CODES[code.trim().toUpperCase()]
  if (!match) return { valid: false }
  return { valid: true, ...match }
}
