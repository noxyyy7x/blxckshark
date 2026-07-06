// Regional shipping + free-shipping threshold config.
// TODO: move to admin panel Site Settings once built, so these can be
// adjusted without a code change.

export const REGIONS = {
  UK: { label: 'United Kingdom', currency: 'GBP', symbol: '£', freeShippingThreshold: 50, flatRate: 3.99 },
  US: { label: 'United States', currency: 'USD', symbol: '$', freeShippingThreshold: 85, flatRate: 9.99 },
  EU: { label: 'European Union', currency: 'EUR', symbol: '€', freeShippingThreshold: 75, flatRate: 7.99 },
}

// Placeholder — real implementation will use Vercel's geolocation headers
// (req.geo.country) to auto-detect. Defaulting to UK for now.
export function detectRegion() {
  return 'UK'
}
