// Tier definitions — XP thresholds, benefits, and visual styling per tier.
// Icon paths are placeholders (`icon: null`) until real tier badge artwork
// is provided — swap the null for a path once icons are uploaded
// (e.g. '/tiers/white-shark.svg').

export const TIERS = [
  {
    number: 1,
    name: 'White Shark',
    xpRequired: 0,
    icon: null,
    gradient: 'from-neutral-300 via-neutral-500 to-neutral-700',
    accent: '#d4d4d4',
    benefits: [
      '20% Birthday Reward',
      '1-Year Anniversary Reward',
    ],
  },
  {
    number: 2,
    name: 'Blue Shark',
    xpRequired: 1000,
    icon: null,
    gradient: 'from-sky-300 via-sky-600 to-blue-900',
    accent: '#38bdf8',
    benefits: [
      'Tier 1 benefits',
      '£5 Reward',
      'Early Access to Restocks (24hrs)',
      '+10% Weekend XP Boost',
    ],
  },
  {
    number: 3,
    name: 'Red Shark',
    xpRequired: 2500,
    icon: null,
    gradient: 'from-red-400 via-red-600 to-red-900',
    accent: '#ef4444',
    benefits: [
      'Tier 2 benefits',
      '£10 Reward',
      'Early Access to New Drops (24hrs)',
      '+15% Weekend XP Boost',
    ],
  },
  {
    number: 4,
    name: 'Gold Shark',
    xpRequired: 4500,
    icon: null,
    gradient: 'from-yellow-300 via-amber-500 to-yellow-800',
    accent: '#eab308',
    benefits: [
      'Tier 3 benefits',
      '£15 Reward',
      'Exclusive Access to New Drops (48hrs)',
      '+25% Weekend XP Boost',
    ],
  },
  {
    number: 5,
    name: 'BLXCKSHARK',
    xpRequired: 6500,
    icon: null,
    gradient: 'from-neutral-700 via-neutral-900 to-black',
    accent: '#ffffff',
    benefits: [
      'Tier 4 benefits',
      '£20 Reward',
      'Earliest Access to New Drops (96hrs)',
      'BLXCKSHARK Anniversary Gift',
    ],
  },
]

export function getTierForXp(xp) {
  let current = TIERS[0]
  for (const tier of TIERS) {
    if (xp >= tier.xpRequired) current = tier
  }
  return current
}

export function getNextTier(currentTierNumber) {
  return TIERS.find((t) => t.number === currentTierNumber + 1) || null
}

export function getTierProgress(xp) {
  const current = getTierForXp(xp)
  const next = getNextTier(current.number)
  if (!next) return { current, next: null, progress: 100 }
  const range = next.xpRequired - current.xpRequired
  const earned = xp - current.xpRequired
  return { current, next, progress: Math.min(100, (earned / range) * 100) }
}
