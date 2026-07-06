'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const ACTION_LABELS = {
  promoted_athlete: 'Promoted to Athlete',
  demoted_athlete: 'Removed Athlete Status',
  chat_claimed: 'Claimed a live chat',
  chat_closed: 'Closed a live chat',
  order_status_updated: 'Updated an order',
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
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-6 text-2xl font-bold uppercase tracking-tight">
        Activity Logs
      </h1>

      {logs.length === 0 ? (
        <p className="font-body text-sm text-white/40">No staff activity recorded yet.</p>
      ) : (
        <div className="divide-y divide-white/10 border-y border-white/10">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-3">
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
