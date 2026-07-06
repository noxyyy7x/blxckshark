'use client'

import { motion } from 'framer-motion'
import NotifyForm from '@/components/NotifyForm'

const socials = [
  { name: 'Instagram', href: 'https://instagram.com/blxckshark' },
  { name: 'TikTok', href: 'https://tiktok.com/@blxckshark' },
  { name: 'X', href: 'https://x.com/blxckshark' },
  { name: 'Threads', href: 'https://threads.net/@blxckshark' },
]

export default function ComingSoonPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Ambient background glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06), transparent 60%)',
        }}
      />

      {/* Faint drifting shark silhouette shape (placeholder — swap for real SVG icon) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 opacity-[0.04]"
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 200 200" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 100 L90 60 L110 80 L190 40 L160 90 L110 110 L90 140 Z" />
        </svg>
      </motion.div>

      <motion.img
        src="/logo-icon.svg"
        alt="BLXCKSHARK"
        className="mb-8 h-16 w-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <motion.p
        className="mb-3 text-xs font-semibold tracking-[0.3em] text-white/50 font-body"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        PREMIUM PERFORMANCE APPAREL
      </motion.p>

      <motion.h1
        className="font-display text-5xl font-bold uppercase tracking-tight text-white sm:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
      >
        Opening Soon
      </motion.h1>

      <motion.p
        className="mt-4 max-w-md text-sm text-white/60 sm:text-base font-body"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Built for more. Be the first to know when we launch.
      </motion.p>

      <motion.div
        className="relative mt-10 flex w-full justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
      >
        <NotifyForm />
      </motion.div>

      <motion.div
        className="mt-14 flex gap-6 text-xs font-semibold tracking-widest text-white/40 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.85 }}
      >
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            {s.name.toUpperCase()}
          </a>
        ))}
      </motion.div>
    </main>
  )
}
