'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile } from '@/lib/staff'
import {
  BoxIcon, BankIcon, StarIcon, BadgeCheckIcon,
} from '@/components/Icons'

export default function AdminHomePage() {
  const { user } = useAuth()
  const [staffName, setStaffName] = useState('')
  const [stats, setStats] = useState({
    processingOrders: 0,
    pendingCashouts: 0,
    pendingApplications: 0,
    pendingReviews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    getStaffProfile(user.id).then((profile) => setStaffName(profile?.name || ''))

    Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
      supabase.from('cashout_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('athlete_application_status', 'pending'),
      supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]).then(([orders, cashouts, applications, reviews]) => {
      setStats({
        processingOrders: orders.count || 0,
        pendingCashouts: cashouts.count || 0,
        pendingApplications: applications.count || 0,
        pendingReviews: reviews.count || 0,
      })
      setLoading(false)
    })
  }, [user])

  const cards = [
    { label: 'Orders Awaiting Dispatch', count: stats.processingOrders, href: '/admin/orders', Icon: BoxIcon },
    { label: 'Pending Cashout Requests', count: stats.pendingCashouts, href: '/admin/cashouts', Icon: BankIcon },
    { label: 'Pending Athlete Applications', count: stats.pendingApplications, href: '/admin/athlete-applications', Icon: BadgeCheckIcon },
    { label: 'Pending Reviews', count: stats.pendingReviews, href: '/admin/reviews', Icon: StarIcon },
  ]

  const totalPending = stats.processingOrders + stats.pendingCashouts + stats.pendingApplications + stats.pendingReviews

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Welcome back{staffName ? `, ${staffName}` : ''}
        </h1>
        <p className="font-body mt-2 text-sm text-white/50">
          {loading
            ? 'Loading your dashboard...'
            : totalPending === 0
            ? 'All caught up — nothing needs attention right now.'
            : `${totalPending} thing${totalPending !== 1 ? 's' : ''} need${totalPending === 1 ? 's' : ''} your attention today.`}
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.a
            key={card.label}
            href={card.href}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06]"
          >
            <div className="mb-4 flex items-center justify-between">
              <card.Icon className="h-5 w-5 text-white/40 transition-colors group-hover:text-white" />
              {card.count > 0 && (
                <span className="font-body rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-black">
                  {card.count}
                </span>
              )}
            </div>
            <p className="font-body text-sm font-medium text-white/80">{card.label}</p>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-10 flex flex-wrap gap-3"
      >
        <a href="/admin/products" className="font-body rounded-md border border-white/15 px-4 py-2 text-xs text-white/60 hover:text-white">
          + Add Product
        </a>
        <a href="/admin/messages" className="font-body rounded-md border border-white/15 px-4 py-2 text-xs text-white/60 hover:text-white">
          Send Broadcast
        </a>
        <a href="/admin/leaderboard" className="font-body rounded-md border border-white/15 px-4 py-2 text-xs text-white/60 hover:text-white">
          View Leaderboard
        </a>
      </motion.div>
    </div>
  )
}
