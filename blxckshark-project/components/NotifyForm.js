'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// TODO: replace with the real Google Apps Script Web App URL once created
// (same pattern as Vexer's newsletter sheet script)
const SHEET_SCRIPT_URL = process.env.NEXT_PUBLIC_SHEET_SCRIPT_URL || ''

export default function NotifyForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      if (SHEET_SCRIPT_URL) {
        await fetch(SHEET_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            date: new Date().toISOString(),
            source: 'coming-soon-page',
          }),
        })
      }
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm tracking-wide text-white/90 font-body"
      >
        You&apos;re on the list. We&apos;ll let you know the moment we drop. 🦈
      </motion.p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col sm:flex-row gap-3"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors font-body"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-md bg-white px-6 py-3 text-sm font-semibold tracking-wide text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 font-body"
      >
        {status === 'loading' ? 'Sending...' : 'NOTIFY ME'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-400 sm:absolute sm:mt-14">
          Enter a valid email address.
        </p>
      )}
    </form>
  )
}
