'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setDisplayName(data?.display_name || ''))
  }, [user])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('profiles').update({ display_name: displayName.trim() }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading || !user) return null

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-md px-6 py-12">
          <h1 className="font-display mb-8 text-2xl font-bold uppercase tracking-tight">Settings</h1>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="font-body mb-2 block text-xs font-semibold tracking-wide text-white/50">
                DISPLAY NAME
              </label>
              <input
                type="text"
                maxLength={30}
                placeholder="Choose a username"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              <p className="font-body mt-1 text-xs text-white/40">
                This shows on your account instead of your email.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="font-body mt-2 rounded-md bg-white py-3 text-sm font-semibold text-black disabled:opacity-60"
            >
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
            </button>
          </form>

          <p className="font-body mt-8 text-xs text-white/30">
            Profile picture upload, password change, and address book coming soon.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
