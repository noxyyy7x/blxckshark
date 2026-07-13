'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import TierUpCelebration from '@/components/TierUpCelebration'
import BrandLoader from '@/components/BrandLoader'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getTierProgress } from '@/lib/tiers'
import { checkAndMarkTierUp } from '@/lib/tierCheck'

export default function OrderConfirmationPage({ params }) {
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newTier, setNewTier] = useState(null)

  useEffect(() => {
    let attempts = 0
    let cancelled = false

    async function poll() {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('order_ref', params.orderId)
        .maybeSingle()

      if (cancelled) return

      if (data) {
        setOrder(data)
        // Once fulfillment has processed (or after a few tries), stop polling
        if (data.status !== 'pending_payment' || attempts >= 4) {
          setLoading(false)
          return
        }
      }

      attempts += 1
      if (attempts < 5) {
        setTimeout(poll, 1500)
      } else {
        setLoading(false)
      }
    }

    poll()
    return () => { cancelled = true }
  }, [params.orderId])

  useEffect(() => {
    if (!user || loading) return

    supabase
      .from('profiles')
      .select('xp')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setProfile(data))

    checkAndMarkTierUp(supabase, user.id).then((tier) => {
      if (tier) setNewTier(tier)
    })
  }, [user, loading])

  const tierInfo = profile ? getTierProgress(profile.xp) : null

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-lg px-6 py-20">
          {loading ? (
            <div className="flex flex-col items-center py-16 text-center">
              <BrandLoader />
              <p className="font-body text-sm text-white/40">Confirming your order...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                className="mb-6 text-5xl"
              >
                🦈
              </motion.div>
              <h1 className="font-display mb-3 text-3xl font-bold uppercase tracking-tight">
                Order Confirmed
              </h1>
              <p className="font-body mb-1 text-sm text-white/60">
                Thank you — your order is on its way to being built for more.
              </p>
              <p className="font-body mb-8 text-xs text-white/40">
                Order reference: <span className="text-white/70">{params.orderId}</span>
              </p>

              {order?.items && (
                <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.03] p-5 text-left">
                  <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt="" className="h-12 w-12 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/5">
                            <img src="/logo-icon.svg" alt="" className="h-4 w-4 opacity-20" />
                          </div>
                        )}
                        <div className="flex flex-1 items-center justify-between text-sm">
                          <span className="font-body text-white/70">
                            {item.name} {item.size && `(${item.size})`} × {item.quantity}
                          </span>
                          <span className="font-body">£{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4 text-sm font-semibold">
                    <span className="font-body">Total</span>
                    <span className="font-body">£{Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {tierInfo && (
                <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.03] p-5 text-left">
                  <p className="font-body mb-2 text-xs text-white/40">
                    TIER {tierInfo.current.number} · {tierInfo.current.name}
                  </p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/40">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tierInfo.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-white"
                    />
                  </div>
                  <p className="font-body mt-2 text-xs text-white/50">
                    {tierInfo.next
                      ? `${profile.xp.toLocaleString()} / ${tierInfo.next.xpRequired.toLocaleString()} XP to ${tierInfo.next.name}`
                      : `${profile.xp.toLocaleString()} XP · Max tier reached`}
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-left">
                <p className="font-body text-sm text-white/60">
                  A confirmation email is on its way. You can track this order and view your rewards
                  from your account once you&apos;re signed in.
                </p>
              </div>

              <a
                href="/shop"
                className="font-body mt-8 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
              >
                Continue Shopping
              </a>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      <TierUpCelebration tier={newTier} onClose={() => setNewTier(null)} />
    </>
  )
}
