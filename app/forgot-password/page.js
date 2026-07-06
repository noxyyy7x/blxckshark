'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await resetPassword(email)
    setLoading(false)
    setSent(true)
  }

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="flex min-h-[80vh] items-center justify-center bg-[#0a0a0a] px-6 py-16 text-white">
        <div className="w-full max-w-sm">
          <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">
            Reset Password
          </h1>
          <p className="font-body mb-8 text-sm text-white/50">
            Enter your email and we&apos;ll send a link to reset your password.
          </p>

          {sent ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <p className="font-body text-sm text-white/80">
                If an account exists for <strong>{email}</strong>, a reset link is on its way.
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
              <button
                type="submit"
                disabled={loading}
                className="font-body mt-2 rounded-md bg-white py-3 text-sm font-semibold text-black disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
