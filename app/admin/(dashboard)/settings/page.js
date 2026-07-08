'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
    loadSettings()
  }, [user])

  async function loadSettings() {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'notification_bar')
      .maybeSingle()
    setMessage(data?.value || '')
    setLoading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    await supabase
      .from('site_settings')
      .update({ value: message, updated_at: new Date().toISOString() })
      .eq('key', 'notification_bar')

    await logActivity(staffId, 'notification_bar_updated', { message })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">Site Settings</h1>
      <p className="font-body mb-8 text-sm text-white/50">
        Changes here go live across the entire site immediately.
      </p>

      <form onSubmit={handleSave} className="max-w-xl rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <label className="font-body mb-2 block text-xs font-semibold tracking-wide text-white/50">
          NOTIFICATION BAR MESSAGE
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. FREE SHIPPING ON UK ORDERS OVER £50"
          className="font-body mb-2 w-full rounded-md border border-white/15 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/30"
        />
        <p className="font-body mb-4 text-xs text-white/40">
          Shown in the thin bar above the header on every page.
        </p>

        <button
          type="submit"
          disabled={saving}
          className="font-body rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
        >
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
