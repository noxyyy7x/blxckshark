'use client'

import { motion } from 'framer-motion'
import NotifyForm from '@/components/NotifyForm'

const socials = [
  { name: 'Instagram', href: 'https://instagram.com/blxckshark.co' },
  { name: 'TikTok', href: 'https://tiktok.com/@blxckshark.co' },
  { name: 'X', href: 'https://x.com/blxcksharkco' },
  { name: 'Threads', href: 'https://threads.net/@blxckshark.co' },
]

const headline = 'OPENING SOON'

export default function ComingSoonPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Base grid texture */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />

      {/* Animated gradient orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(80,90,255,0.18), transparent 70%)' }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)' }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rotating badge ring around the icon */}
      <div className="relative mb-10 flex h-32 w-32 items-center justify-center">
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          <defs>
            <path
              id="circlePath"
              d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
              fill="none"
            />
          </defs>
          <text fontSize="7.2" fill="rgba(255,255,255,0.5)" letterSpacing="3">
            <textPath href="#circlePath" startOffset="0%">
              &#8226; LAUNCHING SOON &#8226; BUILT FOR MORE &#8226; LAUNCHING SOON &#8226; BUILT FOR MORE
            </textPath>
          </text>
        </motion.svg>

        <motion.img
          src="/logo-icon.svg"
          alt="BLXCKSHARK"
          className="relative z-10 h-20 w-20 drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <motion.p
        className="mb-4 text-xs font-semibold tracking-[0.35em] text-white/50 font-body"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        PREMIUM PERFORMANCE APPAREL
      </motion.p>

      {/* Letter-by-letter headline reveal */}
      <h1 className="text-glow font-display flex flex-wrap items-center justify-center text-6xl font-bold uppercase tracking-tight text-white sm:text-8xl">
        {headline.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.25 + i * 0.035,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </h1>

      <motion.div
        className="my-6 h-px w-16 bg-white/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      />

      <motion.p
        className="max-w-md text-sm text-white/60 sm:text-base font-body"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        Engineered for those who push limits. Be the first to know when we drop.
      </motion.p>

      <motion.div
        className="relative mt-10 flex w-full justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.25 }}
      >
        <NotifyForm />
      </motion.div>

      <motion.div
        className="mt-16 flex gap-8 text-xs font-semibold tracking-widest text-white/40 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
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
