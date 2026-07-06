'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'

export default function AdminAthletesPage() {
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [promotingId, setPromotingId] = useState(null)
  const [customCode, setCustomCode] = useState('')

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
    loadProfiles()
  }, [user])

  async function loadProfiles() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setProfiles(data || [])
    setLoading(false)
  }

  async function handlePromote(profileId) {
    if (!customCode.trim()) return
    const code = customCode.trim().toUpperCase()

    await supabase
      .from('profiles')
      .update({ role: 'athlete', referral_code: code })
      .eq('id', profileId)

    await logActivity(staffId, 'promoted_athlete', { profileId, code })

    setPromotingId(null)
    setCustomCode('')
    loadProfiles()
  }

  async function handleDemote(profileId) {
    if (!confirm('Remove athlete status from this account?')) return

    await supabase.from('profiles').update({ role: 'customer' }).eq('id', profileId)
    await logActivity(staffId, 'demoted_athlete', { profileId })
    loadProfiles()
  }

  const filtered = profiles.filter((p) => {
    if (filter === 'athletes' && p.role !== 'athlete') return false
    if (filter === 'customers' && p.role !== 'customer') return false
    if (search && !p.email?.toLowerCase().includes(search.toLowerCase()) && !p.display_name?.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

  if (loading) {
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-6 text-2xl font-bold uppercase tracking-tight">
        Athletes Management
      </h1>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="font-body rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40"
        />
        <div className="flex gap-1">
          {['all', 'athletes', 'customers'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-body rounded-full px-3 py-1.5 text-xs capitalize ${
                filter === f ? 'bg-white text-black' : 'bg-white/10 text-white/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/10 border-y border-white/10">
        {filtered.map((profile) => (
          <div key={profile.id} className="flex items-center justify-between py-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-body text-sm font-semibold">
                  {profile.display_name || profile.email}
                </p>
                {profile.role === 'athlete' && (
                  <span className="font-body rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold">
                    🦈 ATHLETE
                  </span>
                )}
              </div>
              <p className="font-body text-xs text-white/40">
                {profile.email} · {profile.xp} XP · Code: {profile.referral_code} · Balance: £{Number(profile.referral_balance).toFixed(2)}
              </p>
            </div>

            {profile.role === 'athlete' ? (
              <button
                onClick={() => handleDemote(profile.id)}
                className="font-body rounded-md border border-white/20 px-4 py-2 text-xs font-semibold"
              >
                Remove Athlete
              </button>
            ) : promotingId === profile.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Custom code"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="font-body w-32 rounded-md border border-white/15 bg-black/30 px-2 py-1.5 text-xs uppercase outline-none placeholder:normal-case"
                />
                <button
                  onClick={() => handlePromote(profile.id)}
                  className="font-body rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black"
                >
                  Confirm
                </button>
                <button
                  onClick={() => { setPromotingId(null); setCustomCode('') }}
                  className="font-body text-xs text-white/40"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPromotingId(profile.id)}
                className="font-body rounded-md bg-white px-4 py-2 text-xs font-semibold text-black"
              >
                Promote to Athlete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
