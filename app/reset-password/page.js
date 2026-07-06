'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { updatePassword } = useAuth()
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await updatePassword(password)

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/account'), 1500)
    }
  }

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="flex min-h-[80vh] items-center justify-center bg-[#0a0a0a] px-6 py-16 text-white">
        <div className="w-full max-w-sm">
          <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">
            Set New Password
          </h1>

          {success ? (
            <p className="font-body text-sm text-white/70">
              Password updated. Redirecting to your account...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <input
                type="password"
                required
                minLength={6}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              {error && <p className="font-body text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="font-body mt-2 rounded-md bg-white py-3 text-sm font-semibold text-black disabled:opacity-60"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
