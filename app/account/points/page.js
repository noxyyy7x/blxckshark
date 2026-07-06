'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

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

  if (loading || !user || pageLoading) return null

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <h1 className="font-display mb-8 text-2xl font-bold uppercase tracking-tight">
            Points History
          </h1>

          {transactions.length === 0 ? (
            <p className="font-body text-sm text-white/40">
              No XP earned yet — make a purchase or follow us on social media to start earning.
            </p>
          ) : (
            <div className="divide-y divide-white/10 border-y border-white/10">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-body text-sm font-medium">{t.source}</p>
                    <p className="font-body text-xs text-white/40">
                      {new Date(t.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="font-body text-sm font-semibold text-white">
                    +{t.amount} XP
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
