'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'
import { useToast } from '@/context/ToastContext'
import BrandLoader from '@/components/BrandLoader'
import { BadgeCheckIcon } from '@/components/Icons'
import { motion } from 'framer-motion'

export default function AdminAthleteApplicationsPage() {
  const showToast = useToast()
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [applications, setApplications] = useState([])
  const [codeAvailability, setCodeAvailability] = useState({})
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
    loadApplications()
  }, [user])

  async function loadApplications() {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, display_name, pending_athlete_code, athlete_application_status, created_at')
      .not('athlete_application_status', 'is', null)
      .order('created_at', { ascending: false })
    setApplications(data || [])
    setLoading(false)

    // Check live availability for each pending code — time may have passed
    // since they applied, and someone else could've taken it since.
    const pending = (data || []).filter((a) => a.athlete_application_status === 'pending')
    const results = await Promise.all(
      pending.map(async (a) => {
        const res = await fetch(`/api/athlete-application?code=${encodeURIComponent(a.pending_athlete_code)}`)
        const json = await res.json()
        return [a.id, json.available]
      })
    )
    setCodeAvailability(Object.fromEntries(results))
  }

  async function handleApprove(application) {
    setProcessingId(application.id)

    // Re-check the code is still free at approval time, in case of a race
    // with another signup since they applied.
    const { data: codeTaken } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', application.pending_athlete_code)
      .neq('id', application.id)
      .maybeSingle()

    if (codeTaken) {
      showToast('That code has since been taken by another account. Reject and ask them to reapply with a different code.', 'error')
      setProcessingId(null)
      return
    }

    await supabase
      .from('profiles')
      .update({
        role: 'athlete',
        referral_code: application.pending_athlete_code,
        athlete_application_status: 'approved',
      })
      .eq('id', application.id)

    await logActivity(staffId, 'athlete_application_approved', {
      email: application.email,
      code: application.pending_athlete_code,
    })

    await supabase.from('messages').insert({
      user_id: application.id,
      title: "You're officially a BLXCKSHARK Athlete 🦈",
      body: `Your application has been approved. Your code "${application.pending_athlete_code}" is now live — start sharing it to earn 20% commission.`,
    })

    setProcessingId(null)
    loadApplications()
  }

  async function handleReject(application) {
    if (!confirm(`Reject ${application.email}'s athlete application?`)) return

    setProcessingId(application.id)
    await supabase
      .from('profiles')
      .update({ athlete_application_status: 'rejected' })
      .eq('id', application.id)

    await logActivity(staffId, 'athlete_application_rejected', { email: application.email })

    setProcessingId(null)
    loadApplications()
  }

  const filtered = applications.filter((a) => filter === 'all' || a.athlete_application_status === filter)

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><BrandLoader /></div>
  }

  return (
    <div className="p-8">
      <div className="mb-2 flex items-center gap-2.5">
        <BadgeCheckIcon className="h-5 w-5 text-white/50" />
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Athlete Applications
        </h1>
      </div>
      <p className="font-body mb-6 text-sm text-white/50">
        Submissions from athlete.blxckshark.com — approving activates their custom code immediately.
      </p>

      <div className="mb-6 flex gap-1">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-body rounded-full px-3 py-1.5 text-xs capitalize transition-colors ${
              filter === f ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <img src="/logo-icon.svg" alt="" className="mb-3 h-9 w-9 opacity-20" />
          <p className="font-body text-sm text-white/40">No {filter !== 'all' ? filter : ''} applications.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05]"
            >
              <div>
                <p className="font-body text-sm font-semibold">{a.display_name || a.email}</p>
                <p className="font-body text-xs text-white/40">
                  {a.email} · Code: <span className="text-white/70">{a.pending_athlete_code}</span>
                  {a.athlete_application_status === 'pending' && codeAvailability[a.id] !== undefined && (
                    <span className={codeAvailability[a.id] ? 'text-green-400' : 'text-red-400'}>
                      {' '}· {codeAvailability[a.id] ? 'Available ✓' : 'Taken since applied ✕'}
                    </span>
                  )}
                  {' '}· Applied {new Date(a.created_at).toLocaleDateString('en-GB')}
                </p>
              </div>

              {a.athlete_application_status === 'pending' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(a)}
                    disabled={processingId === a.id}
                    className="font-body rounded-md border border-white/20 px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(a)}
                    disabled={processingId === a.id}
                    className="font-body rounded-md bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-50"
                  >
                    {processingId === a.id ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              ) : (
                <span className={`font-body flex items-center gap-1.5 rounded-full px-3 py-1 text-xs capitalize ${
                  a.athlete_application_status === 'approved' ? 'bg-green-400/10 text-green-300' : 'bg-red-400/10 text-red-300'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${a.athlete_application_status === 'approved' ? 'bg-green-400' : 'bg-red-400'}`} />
                  {a.athlete_application_status}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
