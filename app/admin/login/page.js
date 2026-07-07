'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

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
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-lg font-bold tracking-tight">BLXCKSHARK</p>
          <p className="font-body mt-1 text-xs font-semibold tracking-[0.2em] text-white/40">
            STAFF ADMIN
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Staff email"
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

          <button
            type="submit"
            disabled={loading}
            className="font-body mt-2 rounded-md bg-white py-3 text-sm font-semibold text-black disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="font-body mt-8 text-center text-xs text-white/30">
          Not staff?{' '}
          <a href="https://blxckshark.com" className="text-white/50 underline hover:text-white">
            Go to blxckshark.com
          </a>
        </p>
      </div>
    </main>
  )
}
