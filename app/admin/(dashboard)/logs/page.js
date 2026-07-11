'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import BrandLoader from '@/components/BrandLoader'
import { ListIcon } from '@/components/Icons'
import { motion } from 'framer-motion'

const ACTION_LABELS = {
  promoted_athlete: 'Promoted to Athlete',
  demoted_athlete: 'Removed Athlete Status',
  chat_claimed: 'Claimed a live chat',
  chat_closed: 'Closed a live chat',
  order_status_updated: 'Updated an order',
  discount_code_created: 'Created a discount code',
  discount_code_activated: 'Activated a discount code',
  discount_code_deactivated: 'Deactivated a discount code',
  cashout_approved: 'Approved a cashout (generated discount code)',
  cashout_approved_cash: 'Approved a cashout (cash payout)',
  cashout_rejected: 'Rejected a cashout request',
  staff_created: 'Created a staff account',
  staff_permissions_updated: 'Updated staff permissions',
  staff_removed: 'Removed a staff account',
  product_created: 'Created a product',
  product_updated: 'Updated a product',
  product_deleted: 'Deleted a product',
  broadcast_sent: 'Sent a broadcast message',
  review_approved: 'Approved a review',
  review_rejected: 'Rejected a review',
  notification_bar_updated: 'Updated the site notification bar',
  athlete_application_approved: 'Approved an athlete application',
  athlete_application_rejected: 'Rejected an athlete application',
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('activity_logs')
        .select('*, staff_users(name)')
        .order('created_at', { ascending: false })
        .limit(200)
      setLogs(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><BrandLoader /></div>
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-2.5">
        <ListIcon className="h-5 w-5 text-white/50" />
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Activity Logs
        </h1>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <img src="/logo-icon.svg" alt="" className="mb-3 h-9 w-9 opacity-20" />
          <p className="font-body text-sm text-white/40">No staff activity recorded yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/10 border-y border-white/10">
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.015, 0.3) }}
              className="flex items-center justify-between py-3 transition-colors hover:bg-white/[0.02]"
            >
              <div>
                <p className="font-body text-sm">
                  <span className="font-semibold">{log.staff_users?.name || 'Unknown'}</span>
                  {' '}
                  {ACTION_LABELS[log.action] || log.action}
                </p>
                {log.details && (
                  <p className="font-body text-xs text-white/40">
                    {JSON.stringify(log.details)}
                  </p>
                )}
              </div>
              <p className="font-body text-xs text-white/40">
                {new Date(log.created_at).toLocaleString('en-GB')}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
