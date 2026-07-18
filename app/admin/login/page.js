'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { LockIcon } from '@/components/Icons'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/admin')
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
      {/* Grid texture */}
      <div className="bg-grid absolute inset-0 opacity-40" />

      {/* Animated glow orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-[0_0_60px_rgba(255,255,255,0.03)] backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', damping: 14 }}
            className="mb-6 flex justify-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <img
                src="/logo-icon.svg"
                alt=""
                className="h-7 w-7 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8 text-center"
          >
            <p className="font-display text-lg font-bold tracking-tight">BLXCKSHARK</p>
            <p className="font-body mt-1.5 flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.25em] text-white/40">
              <LockIcon className="h-3 w-3" />
              STAFF ADMIN
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              required
              placeholder="Staff email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40"
            />
            {error && <p className="font-body text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="font-body mt-2 rounded-md bg-white py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </motion.form>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-body mt-6 text-center text-xs text-white/30"
        >
          Not staff?{' '}
          <a href="https://blxckshark.com" className="text-white/50 underline hover:text-white">
            Go to blxckshark.com
          </a>
        </motion.p>
      </motion.div>
    </main>
  )
}
