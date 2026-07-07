// Maps common color names to hex values for visual swatches. Falls back to
// a neutral grey dot with the name still shown as text if unrecognized —
// so any custom color name still works, just without a matching swatch.

const COLOR_MAP = {
  black: '#0a0a0a', white: '#ffffff', grey: '#8a8a8a', gray: '#8a8a8a',
  navy: '#1b2a4a', blue: '#2563eb', 'sky blue': '#38bdf8', teal: '#14b8a6',
  green: '#16a34a', olive: '#556b2f', khaki: '#c3b091',
  red: '#dc2626', burgundy: '#7f1d1d', maroon: '#800000',
  pink: '#ec4899', 'baby pink': '#f4c2c2', purple: '#7c3aed', lavender: '#c4b5fd',
  orange: '#ea580c', yellow: '#eab308', mustard: '#c9a227',
  brown: '#78350f', tan: '#d2b48c', beige: '#e8dcc8', cream: '#f5f0e6',
  gold: '#d4af37', silver: '#c0c0c0',
}

export function getColorSwatch(colorName) {
  if (!colorName) return '#666666'
  const key = colorName.trim().toLowerCase()
  return COLOR_MAP[key] || '#666666'
}
