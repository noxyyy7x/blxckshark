import { NextResponse } from 'next/server'

// EU country codes we ship to (Vercel provides the visitor's country via
// the x-vercel-ip-country header automatically on deployed requests)
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
]

export async function GET(request) {
  const country = request.headers.get('x-vercel-ip-country')

  let region = 'UK' // default fallback (also used in local dev, where this header doesn't exist)

  if (country === 'GB') {
    region = 'UK'
  } else if (country === 'US') {
    region = 'US'
  } else if (country && EU_COUNTRIES.includes(country)) {
    region = 'EU'
  }

  return NextResponse.json({ region, detectedCountry: country || null })
}
