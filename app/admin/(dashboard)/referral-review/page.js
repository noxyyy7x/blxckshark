'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import BrandLoader from '@/components/BrandLoader'
import { SearchIcon } from '@/components/Icons'
import { motion } from 'framer-motion'

function ReviewContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [profile, setProfile] = useState(null)
  const [uses, setUses] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function runSearch(searchEmail) {
    if (!searchEmail?.trim()) return
    setLoading(true)
    setSearched(true)
    setNotFound(false)

    const { data: foundProfile } = await supabase
      .from('profiles')
      .select('id, email, display_name, role, referral_code, referral_balance, created_at')
      .ilike('email', searchEmail.trim())
      .maybeSingle()

    if (!foundProfile) {
      setProfile(null)
      setUses([])
      setNotFound(true)
      setLoading(false)
      return
    }

    setProfile(foundProfile)

    const { data: usesData } = await supabase
      .from('referral_uses')
      .select('*')
      .eq('referrer_id', foundProfile.id)
      .order('created_at', { ascending: false })

    setUses(usesData || [])
    setLoading(false)
  }

  useEffect(() => {
    if (searchParams.get('email')) runSearch(searchParams.get('email'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e) {
    e.preventDefault()
    runSearch(email)
  }

  // Simple flags to help spot suspicious patterns at a glance
  const uniqueReferredEmails = new Set(uses.map((u) => u.referred_email?.toLowerCase())).size
  const duplicateReferrals = uses.length - uniqueReferredEmails
  const totalCommission = uses.reduce((sum, u) => sum + Number(u.commission_earned || 0), 0)

  return (
    <div className="p-8">
      <div className="mb-2 flex items-center gap-2.5">
        <SearchIcon className="h-5 w-5 text-white/50" />
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Referral Review
        </h1>
      </div>
      <p className="font-body mb-6 text-sm text-white/50">
        Search any customer or athlete to review their referral code usage before approving a cashout.
      </p>

      <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
        <input
          type="email"
          placeholder="Search by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="font-body flex-1 max-w-md rounded-md border border-white/15 bg-black/30 px-4 py-2.5 text-sm outline-none placeholder:text-white/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="font-body rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105 disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {notFound && (
        <p className="font-body text-sm text-white/40">No user found with that email.</p>
      )}

      {profile && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-6 rounded-lg border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-semibold">
                  {profile.display_name || profile.email}
                  {profile.role === 'athlete' && (
                    <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-normal text-white/60">
                      ATHLETE
                    </span>
                  )}
                </p>
                <p className="font-body text-xs text-white/40">{profile.email}</p>
              </div>
              <div className="text-right">
                <p className="font-body text-xs text-white/40">Referral Code</p>
                <p className="font-body text-sm font-semibold">{profile.referral_code}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-3">
              <div>
                <p className="font-body text-xs text-white/40">Current Balance</p>
                <p className="font-body text-sm font-semibold">£{Number(profile.referral_balance).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-body text-xs text-white/40">Total Referrals</p>
                <p className="font-body text-sm font-semibold">{uses.length}</p>
              </div>
              <div>
                <p className="font-body text-xs text-white/40">Total Commission Earned</p>
                <p className="font-body text-sm font-semibold">£{totalCommission.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          {duplicateReferrals > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 overflow-hidden rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4"
            >
              <p className="font-body text-sm text-yellow-100">
                ⚠ {duplicateReferrals} referral{duplicateReferrals !== 1 ? 's' : ''} share the same email as
                another entry below — worth a closer look before approving.
              </p>
            </motion.div>
          )}

          <h2 className="font-body mb-3 text-sm font-semibold">Referral History</h2>
          {uses.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <img src="/logo-icon.svg" alt="" className="mb-3 h-8 w-8 opacity-20" />
              <p className="font-body text-sm text-white/40">No referrals used yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10 border-y border-white/10">
              {uses.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  className="flex items-center justify-between py-3 transition-colors hover:bg-white/[0.02]"
                >
                  <div>
                    <p className="font-body text-sm">{u.referred_email}</p>
                    <p className="font-body text-xs text-white/40">
                      {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm">Order: £{Number(u.order_amount).toFixed(2)}</p>
                    <p className="font-body text-xs text-white/40">Earned: £{Number(u.commission_earned).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function AdminReferralReviewPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><BrandLoader /></div>}>
      <ReviewContent />
    </Suspense>
  )
}
