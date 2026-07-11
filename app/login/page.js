'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
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
      router.push('/account')
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
              Built For More.
            </h2>
            <p className="font-body mb-8 max-w-sm text-sm text-white/50">
              Your account unlocks the full BLXCKSHARK experience.
            </p>
            <div className="flex flex-col gap-4">
              {[
                'Earn XP and climb through 5 loyalty tiers',
                'Unlock reward codes as you level up',
                'Earn commission by referring friends',
                'Track every order in one place',
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
            Welcome Back
          </h1>
          <p className="font-body mb-8 text-sm text-white/50">
            Log in to track orders, XP, and rewards.
          </p>

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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40"
            />
            {error && <p className="font-body text-xs text-red-400">{error}</p>}

            <div className="text-right">
              <a href="/forgot-password" className="font-body text-xs text-white/50 underline hover:text-white">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="font-body mt-2 rounded-md bg-white py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="font-body mt-6 text-center text-sm text-white/50">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-white underline">
              Sign up
            </a>
          </p>
        </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
