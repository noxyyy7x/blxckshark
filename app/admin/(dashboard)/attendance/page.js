'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile } from '@/lib/staff'

function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}

export default function AttendancePage() {
  const { user } = useAuth()
  const [myStaff, setMyStaff] = useState(null)
  const [myActiveShift, setMyActiveShift] = useState(null)
  const [allStaff, setAllStaff] = useState([])
  const [activeShifts, setActiveShifts] = useState([])
  const [now, setNow] = useState(Date.now())
  const [loading, setLoading] = useState(true)

  // Live-updating clock for shift durations
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000 * 30)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!user) return

    async function load() {
      const profile = await getStaffProfile(user.id)
      setMyStaff(profile)

      const { data: staffList } = await supabase.from('staff_users').select('*')
      setAllStaff(staffList || [])

      const { data: active } = await supabase
        .from('staff_shifts')
        .select('*')
        .is('clock_out', null)
      setActiveShifts(active || [])

      const mine = (active || []).find((s) => s.staff_id === profile?.id)
      setMyActiveShift(mine || null)

      setLoading(false)
    }
    load()

    const channel = supabase
      .channel('staff-shifts-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staff_shifts' }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  async function handleClockIn() {
    const { data } = await supabase
      .from('staff_shifts')
      .insert({ staff_id: myStaff.id })
      .select()
      .single()
    setMyActiveShift(data)
  }

  async function handleClockOut() {
    if (!myActiveShift) return
    await supabase
      .from('staff_shifts')
      .update({ clock_out: new Date().toISOString() })
      .eq('id', myActiveShift.id)
    setMyActiveShift(null)
  }

  if (loading) {
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-6 text-2xl font-bold uppercase tracking-tight">
        Staff Attendance
      </h1>

      {/* Clock in/out for yourself */}
      <div className="mb-8 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div>
          <p className="font-body text-sm font-semibold">{myStaff?.name}</p>
          <p className="font-body text-xs text-white/40">
            {myActiveShift
              ? `Clocked in — ${formatDuration(now - new Date(myActiveShift.clock_in).getTime())}`
              : 'Not clocked in'}
          </p>
        </div>
        {myActiveShift ? (
          <button
            onClick={handleClockOut}
            className="font-body rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold"
          >
            Clock Out
          </button>
        ) : (
          <button
            onClick={handleClockIn}
            className="font-body rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black"
          >
            Clock In
          </button>
        )}
      </div>

      {/* Live team status */}
      <h2 className="font-body mb-3 text-sm font-semibold text-white/70">Team Status</h2>
      <div className="divide-y divide-white/10 border-y border-white/10">
        {allStaff.map((s) => {
          const shift = activeShifts.find((a) => a.staff_id === s.id)
          return (
            <div key={s.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${shift ? 'bg-green-400' : 'bg-white/20'}`}
                />
                <span className="font-body text-sm">{s.name}</span>
                {s.is_owner && (
                  <span className="font-body rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50">
                    Owner
                  </span>
                )}
              </div>
              <span className="font-body text-xs text-white/40">
                {shift
                  ? `Active — ${formatDuration(now - new Date(shift.clock_in).getTime())}`
                  : 'Off'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
