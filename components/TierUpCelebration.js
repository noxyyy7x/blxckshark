'use client'

import { motion, AnimatePresence } from 'framer-motion'

// Lightweight particle burst — small dots animating outward and fading,
// no external confetti library needed.
function Particles({ accent }) {
  const particles = Array.from({ length: 24 })
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2
        const distance = 140 + Math.random() * 80
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 1.1 + Math.random() * 0.4, ease: 'easeOut', delay: 0.1 }}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent }}
          />
        )
      })}
    </div>
  )
}

export default function TierUpCelebration({ tier, onClose }) {
  if (!tier) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm px-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${tier.gradient} p-8 text-center`}
        >
          <div className="absolute inset-0 bg-black/40" />
          <Particles accent={tier.accent} />

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-body mb-4 text-xs font-semibold tracking-[0.3em] text-white/70"
            >
              TIER UP
            </motion.p>

            {tier.icon && (
              <motion.img
                src={tier.icon}
                alt=""
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.3 }}
                className="mx-auto mb-4 h-24 w-24 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              />
            )}

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display mb-2 text-2xl font-bold uppercase tracking-tight text-white"
            >
              You&apos;re a {tier.name}!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-body mb-6 text-sm text-white/70"
            >
              You&apos;ve unlocked new rewards for reaching Tier {tier.number}.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6 flex flex-col gap-2 text-left"
            >
              {tier.benefits?.slice(0, 3).map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <span className="h-1 w-1 flex-shrink-0 rounded-full bg-white/60" />
                  <span className="font-body text-xs text-white/70">{b}</span>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={onClose}
              className="font-body w-full rounded-md bg-white py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              Let&apos;s Go
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
