'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'
import { getStaffProfile, logActivity } from '@/lib/staff'

const STATUS_OPTIONS = ['processing', 'dispatched', 'delivered']

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [orders, setOrders] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [tracking, setTracking] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
  }, [user])

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const active = orders.find((o) => o.id === activeId)

  useEffect(() => {
    setTracking(active?.tracking_number || '')
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function updateStatus(orderId, status, trackingNumber) {
    const updates = { status }
    if (trackingNumber !== undefined) updates.tracking_number = trackingNumber

    await supabase.from('orders').update(updates).eq('id', orderId)

    const order = orders.find((o) => o.id === orderId)
    await logActivity(staffId, 'order_status_updated', {
      orderRef: order?.order_ref,
      status,
      trackingNumber: trackingNumber || undefined,
    })

    await loadOrders()
  }

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  if (loading) {
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="flex h-screen">
      {/* Order list */}
      <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-white/10">
        <div className="border-b border-white/10 p-5">
          <h1 className="font-display mb-3 text-lg font-bold uppercase tracking-tight">Orders</h1>
          <div className="flex flex-wrap gap-1">
            {['all', ...STATUS_OPTIONS].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-body rounded-full px-2.5 py-1 text-[11px] capitalize ${
                  filter === f ? 'bg-white text-black' : 'bg-white/10 text-white/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="font-body p-5 text-xs text-white/40">No orders here.</p>
        ) : (
          filteredOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setActiveId(order.id)}
              className={`font-body block w-full border-b border-white/5 px-5 py-3 text-left text-xs ${
                activeId === order.id ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{order.order_ref}</span>
                <span className="capitalize text-white/50">{order.status}</span>
              </div>
              <p className="mt-1 text-white/40">{order.email}</p>
              <p className="text-white/40">
                £{Number(order.total).toFixed(2)} · {order.region}
              </p>
            </button>
          ))
        )}
      </div>

      {/* Order detail */}
      <div className="flex-1 overflow-y-auto p-8">
        {!active ? (
          <p className="font-body text-sm text-white/30">Select an order to view details</p>
        ) : (
          <div className="max-w-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">
                {active.order_ref}
              </h2>
              <span className="font-body rounded-full bg-white/10 px-3 py-1 text-xs capitalize">
                {active.status}
              </span>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-body text-xs text-white/40">Customer</p>
                <p className="font-body">{active.email}</p>
              </div>
              <div>
                <p className="font-body text-xs text-white/40">Placed</p>
                <p className="font-body">
                  {new Date(active.created_at).toLocaleString('en-GB')}
                </p>
              </div>
              <div>
                <p className="font-body text-xs text-white/40">Region</p>
                <p className="font-body">{active.region}</p>
              </div>
              <div>
                <p className="font-body text-xs text-white/40">Total</p>
                <p className="font-body">£{Number(active.total).toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="font-body mb-2 text-xs text-white/40">Shipping Address</p>
              <div className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm">
                <p>{active.shipping_address?.name}</p>
                <p>{active.shipping_address?.line1}</p>
                <p>{active.shipping_address?.city}, {active.shipping_address?.postcode}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="font-body mb-2 text-xs text-white/40">Items</p>
              <div className="divide-y divide-white/10 rounded-md border border-white/10">
                {active.items.map((item, i) => (
                  <div key={i} className="flex justify-between px-3 py-2 text-sm">
                    <span>
                      {item.name} {item.size && `(${item.size})`} × {item.quantity}
                    </span>
                    <span>£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {active.discount_code && (
              <p className="font-body mb-6 text-xs text-white/50">
                Discount used: <span className="text-white">{active.discount_code}</span>
                {' '}(−£{Number(active.discount_amount).toFixed(2)})
              </p>
            )}

            {/* Dispatch controls */}
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <p className="font-body mb-3 text-sm font-semibold">Update Order</p>

              {active.region === 'UK' && (
                <div className="mb-3">
                  <label className="font-body mb-1 block text-xs text-white/40">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="Enter Evri tracking number"
                    className="font-body w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                  />
                </div>
              )}

              <div className="flex gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(active.id, status, active.region === 'UK' ? tracking : undefined)}
                    className={`font-body flex-1 rounded-md py-2 text-xs font-semibold capitalize ${
                      active.status === status
                        ? 'bg-white text-black'
                        : 'border border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              {/* TODO: trigger Resend dispatch email here once real emails are wired up */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
