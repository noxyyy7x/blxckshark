'use client'

import { motion } from 'framer-motion'

export default function TierCard({ tier, isCurrent }) {
  return (
    <div
      className={`relative flex h-[520px] w-[85vw] max-w-sm flex-shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-gradient-to-b ${tier.gradient} sm:w-[380px]`}
    >
      {/* Current tier indicator */}
      {isCurrent && (
        <span className="absolute right-4 top-4 z-10 rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
          YOUR TIER
        </span>
      )}

      {/* Giant faded tier number in background */}
      <span className="font-display pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 text-[130px] font-bold leading-none text-white/[0.08]">
        {tier.number}
      </span>

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-14 text-center">
        <p className="font-body mb-1 text-xs font-semibold tracking-[0.25em] text-white/70">
          TIER {tier.number}
        </p>
        <h3 className="font-display mb-6 text-3xl font-bold uppercase tracking-tight text-white">
          {tier.name}
        </h3>

        {/* Icon badge — placeholder circle until real tier icon artwork is added */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm"
        >
          {tier.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tier.icon} alt={tier.name} className="h-20 w-20 object-contain" />
          ) : (
            <span className="font-body text-[10px] text-white/50">Icon coming soon</span>
          )}
        </motion.div>

        <p className="font-body mb-6 text-xs text-white/70">
          {tier.xpRequired.toLocaleString()} XP required
        </p>
      </div>

      {/* Benefits checklist */}
      <div className="relative z-10 flex flex-col gap-3 bg-black/20 px-6 py-6 backdrop-blur-sm">
        {tier.benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-3">
            <CheckIcon />
            <span className="font-body text-sm text-white">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 text-white">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
