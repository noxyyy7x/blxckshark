'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'

const PERKS = [
  { title: '20% Commission', desc: 'On every sale generated through your custom code.' },
  { title: 'Custom Vanity Code', desc: 'Your own branded code instead of a random referral code.' },
  { title: 'Real Cash Payouts', desc: 'Cash out at £200 via direct bank transfer.' },
  { title: 'Early Access', desc: 'Exclusive access to new drops before public launch.' },
  { title: 'Athlete Badge', desc: 'A distinct badge on your profile across the BLXCKSHARK community.' },
]

const EXPECTATIONS = [
  'Regular training content tagging @blxckshark.co or #blxckshark across your platforms',
  'Honest, authentic feedback on the products you receive \u2014 no scripts, just your real experience',
  'Representing the brand well \u2014 your activity reflects on BLXCKSHARK',
  'Athlete status and perks are reviewed periodically based on activity and engagement',
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

export default function AthleteSignupPage() {
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '')

    if (!cleanCode || cleanCode.length < 3) {
      setError('Choose a code at least 3 characters long.')
      return
    }
    if (!email.trim() || password.length < 6) {
      setError('Enter a valid email and a password of at least 6 characters.')
      return
    }

    setSubmitting(true)

    // Check the chosen code isn't already taken as a referral code or an
    // existing discount code, before creating the account.
    const [{ data: existingProfile }, { data: existingDiscount }] = await Promise.all([
      supabase.from('profiles').select('id').eq('referral_code', cleanCode).maybeSingle(),
      supabase.from('discount_codes').select('id').eq('code', cleanCode).maybeSingle(),
    ])

    if (existingProfile || existingDiscount) {
      setError('That code is already taken — please choose another.')
      setSubmitting(false)
      return
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setSubmitting(false)
      return
    }

    if (signUpData.user) {
      await supabase
        .from('profiles')
        .update({ pending_athlete_code: cleanCode, athlete_application_status: 'pending' })
        .eq('id', signUpData.user.id)
    }

    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/coming-soon-bg.jpg"
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: '65% center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
        <motion.p {...fadeUp} transition={{ duration: 0.6 }} className="font-body mb-3 text-xs font-semibold tracking-[0.35em] text-white/50">
          PRIVATE INVITE
        </motion.p>
        <motion.h1 {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Become a BLXCKSHARK Athlete
        </motion.h1>
        <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="font-body mt-5 max-w-md text-sm text-white/60">
          You&apos;ve been personally invited to join the roster. Set up your account below.
        </motion.p>

        {/* Perks grid */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {PERKS.map((perk) => (
            <div key={perk.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-left">
              <p className="font-body text-sm font-semibold">{perk.title}</p>
              <p className="font-body mt-1 text-xs text-white/50">{perk.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Expectations */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.35 }} className="mt-10 w-full rounded-xl border border-white/10 bg-white/[0.02] p-6 text-left">
          <p className="font-body mb-4 text-xs font-semibold tracking-[0.25em] text-white/40">WHAT WE EXPECT</p>
          <ul className="flex flex-col gap-3">
            {EXPECTATIONS.map((item) => (
              <li key={item} className="font-body flex items-start gap-3 text-sm text-white/70">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Signup form */}
        <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.4 }} className="mt-14 w-full max-w-sm">
          {submitted ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
              <p className="font-body mb-2 text-lg font-semibold">Application Submitted 🦈</p>
              <p className="font-body text-sm text-white/60">
                Check your email to confirm your account. Our team will review your application and
                be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Choose your custom code (e.g. YOURNAME20)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm uppercase outline-none placeholder:text-white/40 placeholder:normal-case"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              <input
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              {error && <p className="font-body text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="font-body mt-2 rounded-md bg-white py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}

          <p className="font-body mt-6 text-xs text-white/30">
            Already have an account?{' '}
            <a href="https://blxckshark.com/login" className="underline hover:text-white">
              Log in
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
