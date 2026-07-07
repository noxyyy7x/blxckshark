'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

const STATUS_LABELS = {
  processing: 'Processing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
}

export default function TrackOrderPage() {
  const [orderRef, setOrderRef] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setOrder(null)
    setLoading(true)

    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderRef, email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setOrder(data.order)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-md px-6 py-16">
          <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">Track Order</h1>
          <p className="font-body mb-8 text-sm text-white/50">
            Enter your order reference and email to check its status.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Order reference (e.g. BS-12345678)"
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              className="font-body rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
            />
            <input
              type="email"
              placeholder="Email used at checkout"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-body rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
            />
            {error && <p className="font-body text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="font-body rounded-md bg-white py-3 text-sm font-semibold text-black disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>

          {order && (
            <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-body text-sm font-semibold">{order.order_ref}</p>
                <span className="font-body rounded-full bg-white/10 px-3 py-1 text-xs">
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <p className="font-body mb-1 text-xs text-white/40">
                {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="font-body mb-3 text-xs text-white/50">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''} \u00b7 \u00a3{Number(order.total).toFixed(2)}
              </p>
              {order.tracking_number && (
                <p className="font-body text-xs text-white/60">
                  Tracking: <span className="text-white">{order.tracking_number}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
