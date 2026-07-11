'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signUp(email, password)

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="flex min-h-[85vh] bg-[#0a0a0a] text-white">
        {/* Branded left panel */}
        <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-900 to-black px-16 lg:flex">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="relative z-10">
            <img src="/logo-icon.svg" alt="" className="mb-8 h-10 w-10 opacity-80" />
            <h2 className="font-display mb-4 text-3xl font-bold uppercase leading-tight tracking-tight">
              Join The Movement.
            </h2>
            <p className="font-body mb-8 max-w-sm text-sm text-white/50">
              Create an account and start earning from your very first order.
            </p>
            <div className="flex flex-col gap-4">
              {[
                'Earn 10 XP for every £1 spent',
                'Unlock tier rewards from day one',
                'Get your own referral code instantly',
                'Free to join, no strings attached',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-white/40" />
                  <p className="font-body text-sm text-white/60">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex w-full items-center justify-center px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-sm">
          <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">
            Join The Movement
          </h1>
          <p className="font-body mb-8 text-sm text-white/50">
            Create an account to start earning XP, tiers, and rewards.
          </p>

          {success ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <p className="font-body text-sm text-white/80">
                Almost there — check <strong>{email}</strong> for a verification link to activate
                your account.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40"
              />
              {error && <p className="font-body text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="font-body mt-2 rounded-md bg-white py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          )}

          <p className="font-body mt-6 text-center text-sm text-white/50">
            Already have an account?{' '}
            <a href="/login" className="text-white underline">
              Log in
            </a>
          </p>
        </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
