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
import { ChartIcon } from '@/components/Icons'

export default function PointsHistoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    supabase
      .from('xp_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTransactions(data || [])
        setPageLoading(false)
      })
  }, [user])

  const totalXp = transactions.reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="mb-2 flex items-center gap-2.5">
            <ChartIcon className="h-5 w-5 text-white/50" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
              Points History
            </h1>
          </div>
          {!pageLoading && transactions.length > 0 && (
            <p className="font-body mb-8 text-sm text-white/50">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} · {totalXp.toLocaleString()} XP total earned
            </p>
          )}

          {loading || !user || pageLoading ? (
            <BrandLoader />
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No XP earned yet."
              subtitle="Make a purchase or follow us on social media to start earning."
              ctaLabel="Explore Products"
              ctaHref="/shop"
            />
          ) : (
            <div className="divide-y divide-white/10 border-y border-white/10">
              {transactions.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  className="flex items-center justify-between py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div>
                    <p className="font-body text-sm font-medium">{t.source}</p>
                    <p className="font-body text-xs text-white/40">
                      {new Date(t.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="font-body text-sm font-semibold text-green-400">
                    +{t.amount} XP
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
