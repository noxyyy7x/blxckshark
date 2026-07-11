'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import EmptyState from '@/components/EmptyState'

const STATUS_LABELS = {
  processing: 'Processing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
}

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || [])
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
            Your Orders
          </h1>

          {orders.length === 0 ? (
            <EmptyState
              title="No orders yet."
              subtitle="When you place your first order, it'll show up right here."
              ctaLabel="Start Shopping"
              ctaHref="/shop"
            />
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-body text-sm font-semibold">{order.order_ref}</p>
                    <span className="font-body rounded-full bg-white/10 px-3 py-1 text-xs">
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <p className="font-body mb-1 text-xs text-white/40">
                    {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <p className="font-body mb-3 text-xs text-white/50">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} · £{Number(order.total).toFixed(2)}
                  </p>
                  {order.tracking_number && (
                    <p className="font-body text-xs text-white/60">
                      Tracking: <span className="text-white">{order.tracking_number}</span>
                    </p>
                  )}
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
