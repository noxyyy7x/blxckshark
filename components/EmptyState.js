'use client'

import { motion } from 'framer-motion'

// Reusable branded empty state — used for empty cart, wishlist, no orders,
// no messages, etc. Keeps a bit of brand personality instead of plain text.
export default function EmptyState({ title, subtitle, ctaLabel, ctaHref }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center py-20 text-center"
    >
      <img src="/logo-icon.svg" alt="" className="mb-5 h-10 w-10 opacity-30" />
      <p className="font-body text-sm font-semibold text-white/70">{title}</p>
      {subtitle && <p className="font-body mt-1.5 max-w-xs text-xs text-white/40">{subtitle}</p>}
      {ctaLabel && ctaHref && (
        <a
          href={ctaHref}
          className="font-body mt-6 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        >
          {ctaLabel}
        </a>
      )}
    </motion.div>
  )
}
