'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

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

  if (loading || !user || pageLoading) return null

  const available = rewards.filter((r) => !r.redeemed)
  const used = rewards.filter((r) => r.redeemed)

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">Rewards</h1>
          <p className="font-body mb-8 text-sm text-white/50">
            Unlocked automatically as you reach new tiers. Apply at checkout as a discount code.
          </p>

          {rewards.length === 0 ? (
            <p className="font-body text-sm text-white/40">
              No rewards yet — keep earning XP to unlock your first tier reward.
            </p>
          ) : (
            <>
              {available.length > 0 && (
                <div className="mb-8 flex flex-col gap-3">
                  <h2 className="font-body text-sm font-semibold text-white/70">Available</h2>
                  {available.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-lg border border-white/15 bg-white/[0.03] p-4"
                    >
                      <div>
                        <p className="font-display text-lg font-bold">£{Number(r.amount).toFixed(2)} Off</p>
                        <p className="font-body text-xs text-white/40">
                          Unlocked at Tier {r.tier_number} · {r.code}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(r.code)}
                        className="font-body rounded-md bg-white px-4 py-2 text-xs font-semibold text-black"
                      >
                        {copiedCode === r.code ? 'Copied ✓' : 'Copy Code'}
                      </button>
                    </div>
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
