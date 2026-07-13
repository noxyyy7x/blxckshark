'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import EmptyState from '@/components/EmptyState'
import BrandLoader from '@/components/BrandLoader'
import { GiftIcon } from '@/components/Icons'

export default function RewardsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [rewards, setRewards] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRewards(data || [])
        setPageLoading(false)
      })
  }, [user])

  function handleCopy(code) {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const available = rewards.filter((r) => !r.redeemed)
  const used = rewards.filter((r) => r.redeemed)

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="mb-2 flex items-center gap-2.5">
            <GiftIcon className="h-5 w-5 text-white/50" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Rewards</h1>
          </div>
          <p className="font-body mb-8 text-sm text-white/50">
            Unlocked automatically as you reach new tiers. Apply at checkout as a discount code.
          </p>

          {loading || !user || pageLoading ? (
            <BrandLoader />
          ) : rewards.length === 0 ? (
            <EmptyState
              title="No rewards yet."
              subtitle="Keep earning XP to unlock your first tier reward."
              ctaLabel="View Tiers"
              ctaHref="/tiers"
            />
          ) : (
            <>
              {available.length > 0 && (
                <div className="mb-8 flex flex-col gap-3">
                  <h2 className="font-body text-sm font-semibold text-white/70">Available</h2>
                  {available.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.08, 0.3) }}
                      className="relative flex items-center justify-between overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-white/[0.06] to-transparent p-4"
                    >
                      <div>
                        <p className="font-display text-lg font-bold">£{Number(r.amount).toFixed(2)} Off</p>
                        <p className="font-body text-xs text-white/40">
                          {r.source === 'referral_cashout' ? 'Referral cashout' : `Unlocked at Tier ${r.tier_number}`} · {r.code}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(r.code)}
                        className="font-body rounded-md bg-white px-4 py-2 text-xs font-semibold text-black transition-transform hover:scale-105"
                      >
                        {copiedCode === r.code ? 'Copied ✓' : 'Copy Code'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {used.length > 0 && (
                <div>
                  <h2 className="font-body mb-3 text-sm font-semibold text-white/40">Used</h2>
                  <div className="flex flex-col gap-2">
                    {used.map((r) => (
                      <div key={r.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] p-4 opacity-50">
                        <p className="font-body text-sm">£{Number(r.amount).toFixed(2)} Off — {r.code}</p>
                        <span className="font-body text-xs">Redeemed</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
