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
import { BoxIcon } from '@/components/Icons'

const STATUS_STYLES = {
  pending_payment: { dot: 'bg-yellow-400', text: 'text-yellow-300', label: 'Pending' },
  processing: { dot: 'bg-sky-400', text: 'text-sky-300', label: 'Processing' },
  dispatched: { dot: 'bg-purple-400', text: 'text-purple-300', label: 'Dispatched' },
  delivered: { dot: 'bg-green-400', text: 'text-green-300', label: 'Delivered' },
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

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="mb-8 flex items-center gap-2.5">
            <BoxIcon className="h-5 w-5 text-white/50" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
              Your Orders
            </h1>
          </div>

          {loading || !user || pageLoading ? (
            <BrandLoader />
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders yet."
              subtitle="When you place your first order, it'll show up right here."
              ctaLabel="Start Shopping"
              ctaHref="/shop"
            />
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order, i) => {
                const style = STATUS_STYLES[order.status] || STATUS_STYLES.processing
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.06, 0.3) }}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-body text-sm font-semibold">{order.order_ref}</p>
                      <span className={`font-body flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs ${style.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                    </div>

                    {/* Product thumbnails */}
                    {order.items?.length > 0 && (
                      <div className="mb-3 flex -space-x-2">
                        {order.items.slice(0, 4).map((item, idx) => (
                          item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={idx}
                              src={item.image}
                              alt=""
                              className="h-10 w-10 rounded-md border-2 border-[#0a0a0a] object-cover"
                            />
                          ) : (
                            <div key={idx} className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-[#0a0a0a] bg-white/10">
                              <img src="/logo-icon.svg" alt="" className="h-3.5 w-3.5 opacity-30" />
                            </div>
                          )
                        ))}
                        {order.items.length > 4 && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-[#0a0a0a] bg-white/10 font-body text-[10px] text-white/60">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                    )}

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
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
