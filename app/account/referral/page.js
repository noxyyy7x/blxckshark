'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { generateShareCard } from '@/lib/generateShareCard'
import BrandLoader from '@/components/BrandLoader'
import EmptyState from '@/components/EmptyState'
import { ShareIcon } from '@/components/Icons'
import { motion } from 'framer-motion'

const CASHOUT_THRESHOLDS = { customer: 50, athlete: 200 }
const COMMISSION_PERCENT = { customer: 10, athlete: 20 }

export default function ReferralPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [uses, setUses] = useState([])
  const [cashouts, setCashouts] = useState([])
  const [copied, setCopied] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: p }, { data: usesData }, { data: cashoutData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('referral_uses').select('*').eq('referrer_id', user.id).order('created_at', { ascending: false }),
        supabase.from('cashout_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])
      setProfile(p)
      setUses(usesData || [])
      setCashouts(cashoutData || [])
      setPageLoading(false)
    }
    load()
  }, [user])

  if (loading || !user || pageLoading) {
    return (
      <>
        <NotificationBar />
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-[#0a0a0a] text-white">
          <BrandLoader />
        </main>
        <Footer />
      </>
    )
  }

  const role = profile?.role || 'customer'
  const threshold = CASHOUT_THRESHOLDS[role]
  const percent = COMMISSION_PERCENT[role]
  const balance = Number(profile?.referral_balance || 0)
  const canCashout = balance >= threshold
  const referralLink = `https://blxckshark.com?ref=${profile?.referral_code}`

  function handleCopy() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleCashoutRequest() {
    setRequesting(true)
    const { error } = await supabase.from('cashout_requests').insert({
      user_id: user.id,
      amount: balance,
    })
    if (!error) {
      const { data } = await supabase
        .from('cashout_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setCashouts(data || [])
    }
    setRequesting(false)
  }

  const hasPendingCashout = cashouts.some((c) => c.status === 'pending')

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-xl px-6 py-12">
          <div className="mb-2 flex items-center gap-2.5">
            <ShareIcon className="h-5 w-5 text-white/50" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
              Refer a Friend
            </h1>
          </div>
          <p className="font-body mb-8 text-sm text-white/50">
            Share your link — they get {percent}% off, you earn {percent}% commission on every
            order they place.
          </p>

          {/* Referral link */}
          <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <p className="font-body mb-2 text-xs font-semibold tracking-wide text-white/50">
              YOUR REFERRAL LINK
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={referralLink}
                className="font-body flex-1 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70 outline-none"
              />
              <button
                onClick={handleCopy}
                className="font-body rounded-md bg-white px-4 py-2 text-xs font-semibold text-black transition-transform hover:scale-105"
              >
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <p className="font-body mt-3 text-xs text-white/40">
              Code: <span className="text-white/70">{profile?.referral_code}</span>
            </p>
            <button
              onClick={() => generateShareCard({ code: profile?.referral_code, percent })}
              className="font-body mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-white/15 py-2.5 text-xs font-semibold transition-colors hover:bg-white/10"
            >
              📲 Download Share Card
            </button>
          </div>

          {/* Balance + cashout */}
          <div className="mb-8 rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-xs font-semibold tracking-wide text-white/50">
                  REFERRAL BALANCE
                </p>
                <p className="font-display text-2xl font-bold">£{balance.toFixed(2)}</p>
              </div>
              <p className="font-body text-xs text-white/40">
                Redeem as discount code at £{threshold}
              </p>
            </div>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (balance / threshold) * 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-white"
              />
            </div>

            <button
              onClick={handleCashoutRequest}
              disabled={!canCashout || requesting || hasPendingCashout}
              className="font-body mt-5 w-full rounded-md bg-white py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            >
              {hasPendingCashout
                ? 'Redemption Requested — Pending'
                : requesting
                ? 'Requesting...'
                : canCashout
                ? 'Redeem Balance as Discount Code'
                : `Reach £${threshold} to redeem`}
            </button>
          </div>

          {/* History */}
          <div>
            <h2 className="font-body mb-3 text-sm font-semibold">Referral Activity</h2>
            {uses.length === 0 ? (
              <EmptyState
                title="No referral activity yet."
                subtitle="Share your link to start earning commission."
              />
            ) : (
              <div className="divide-y divide-white/10 border-y border-white/10">
                {uses.map((u, i) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                    className="flex items-center justify-between py-3 text-sm transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="font-body text-white/60">
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-body text-white/70">
                      Order £{Number(u.order_amount).toFixed(2)}
                    </span>
                    <span className="font-body font-semibold text-green-400">
                      +£{Number(u.commission_earned).toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
