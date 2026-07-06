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

      <main className="flex min-h-[80vh] items-center justify-center bg-[#0a0a0a] px-6 py-16 text-white">
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
              className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
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
      </main>

      <Footer />
    </>
  )
}
