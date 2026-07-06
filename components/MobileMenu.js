'use client'

import { motion, AnimatePresence } from 'framer-motion'

const categories = ['Men', 'Women', 'Accessories']

// TODO: replace with real Supabase auth state once accounts are built
const isLoggedIn = false
const mockUser = { name: 'Qasim', tier: 'Red Shark', tierNumber: 3 }

export default function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 z-50 flex h-full w-[80%] max-w-xs flex-col bg-[#0d0d0d] px-6 py-8"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-lg font-bold tracking-tight">
                BLXCKSHARK
              </span>
              <button onClick={onClose} aria-label="Close menu" className="text-2xl leading-none">
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`/shop/${cat.toLowerCase()}`}
                  className="font-body border-b border-white/10 py-4 text-base font-medium tracking-wide"
                >
                  {cat}
                </a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4 pt-8">
              {isLoggedIn ? (
                <>
                  <a href="/account" className="flex items-center gap-3 rounded-lg bg-white/5 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-display text-sm">
                      {mockUser.name.charAt(0)}
                    </div>
                    <div className="font-body text-left">
                      <p className="text-sm font-semibold">{mockUser.name}</p>
                      <p className="text-xs text-white/50">
                        Tier {mockUser.tierNumber} · {mockUser.tier}
                      </p>
                    </div>
                  </a>
                  <a href="/wishlist" className="font-body py-2 text-sm text-white/70">
                    Wishlist
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="font-body rounded-md bg-white py-3 text-center text-sm font-semibold text-black"
                  >
                    Sign In / Sign Up
                  </a>
                  <a href="/wishlist" className="font-body py-2 text-center text-sm text-white/70">
                    Wishlist
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
