'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'
import BrandLoader from '@/components/BrandLoader'
import { ChatBubbleIcon } from '@/components/Icons'
import { motion } from 'framer-motion'

const DURATIONS = [
  { label: '24 hours', hours: 24 },
  { label: '48 hours', hours: 48 },
  { label: '72 hours', hours: 72 },
  { label: '7 days', hours: 168 },
  { label: 'No expiry', hours: null },
]

export default function AdminMessagesPage() {
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [broadcasts, setBroadcasts] = useState([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [code, setCode] = useState('')
  const [durationHours, setDurationHours] = useState(48)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
    loadBroadcasts()
  }, [user])

  async function loadBroadcasts() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .is('user_id', null)
      .order('created_at', { ascending: false })
      .limit(20)
    setBroadcasts(data || [])
    setLoading(false)
  }

  async function handleSend(e) {
    e.preventDefault()
    setError('')

    if (!title.trim() || !body.trim()) {
      setError('Title and message are required.')
      return
    }

    setSending(true)

    const expiresAt = durationHours
      ? new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()
      : null

    const { error: insertError } = await supabase.from('messages').insert({
      user_id: null,
      title: title.trim(),
      body: body.trim(),
      code: code.trim() || null,
      expires_at: expiresAt,
    })

    if (insertError) {
      setError(insertError.message)
      setSending(false)
      return
    }

    await logActivity(staffId, 'broadcast_sent', { title: title.trim(), durationHours })
    setTitle('')
    setBody('')
    setCode('')
    setSending(false)
    loadBroadcasts()
  }

  const now = Date.now()

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><BrandLoader /></div>
  }

  return (
    <div className="p-8">
      <div className="mb-2 flex items-center gap-2.5">
        <ChatBubbleIcon className="h-5 w-5 text-white/50" />
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Broadcast Messages
        </h1>
      </div>
      <p className="font-body mb-8 text-sm text-white/50">
        Sends to every customer's inbox — sale announcements, shop-wide codes, updates.
      </p>

      <form onSubmit={handleSend} className="mb-10 flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <input
          type="text"
          placeholder="Title (e.g. 48hr Flash Sale)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
        />
        <textarea
          placeholder="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Discount code (optional)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm uppercase outline-none placeholder:text-white/30 placeholder:normal-case"
          />
          <select
            value={durationHours ?? ''}
            onChange={(e) => setDurationHours(e.target.value ? Number(e.target.value) : null)}
            className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none"
          >
            {DURATIONS.map((d) => (
              <option key={d.label} value={d.hours ?? ''}>{d.label}</option>
            ))}
          </select>
        </div>

        {error && <p className="font-body text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="font-body rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105 disabled:opacity-60"
        >
          {sending ? 'Sending...' : 'Send Broadcast'}
        </button>
        <p className="font-body text-xs text-white/30">
          Note: this references your discount_codes system separately — create the actual code
          under Discount Codes too if customers need to redeem it at checkout.
        </p>
      </form>

      <h2 className="font-body mb-3 text-sm font-semibold text-white/70">Recent Broadcasts</h2>
      {broadcasts.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <img src="/logo-icon.svg" alt="" className="mb-3 h-9 w-9 opacity-20" />
          <p className="font-body text-sm text-white/40">No broadcasts sent yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {broadcasts.map((b, i) => {
            const expired = b.expires_at && new Date(b.expires_at).getTime() < now
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]"
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-body text-sm font-semibold">{b.title}</p>
                  <span className={`font-body flex items-center gap-1.5 text-xs ${expired ? 'text-white/30' : 'text-green-400'}`}>
                    {!expired && <span className="h-1.5 w-1.5 rounded-full bg-green-400" />}
                    {expired ? 'Expired' : b.expires_at ? `Active until ${new Date(b.expires_at).toLocaleString('en-GB')}` : 'No expiry'}
                  </span>
                </div>
                <p className="font-body text-xs text-white/50">{b.body}</p>
                {b.code && <p className="font-body mt-1 text-xs text-white/70">Code: {b.code}</p>}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
