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

      <main className="flex min-h-[80vh] items-center justify-center bg-[#0a0a0a] px-6 py-16 text-white">
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
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
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
      </main>

      <Footer />
    </>
  )
}
