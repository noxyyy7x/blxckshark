'use client'

import { motion } from 'framer-motion'

// Branded loading state — the shark monogram gently pulsing, used anywhere
// the site would otherwise show plain "Loading..." text.
export default function BrandLoader({ size = 'default' }) {
  const dimensions = size === 'small' ? 'h-6 w-6' : size === 'large' ? 'h-14 w-14' : 'h-9 w-9'

  return (
    <div className="flex items-center justify-center py-12">
      <motion.img
        src="/logo-icon.svg"
        alt=""
        className={dimensions}
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.92, 1, 0.92] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
