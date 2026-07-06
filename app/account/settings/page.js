'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [displayName, setDisplayName] = useState('')
  const [dob, setDob] = useState('')
  const [dobLocked, setDobLocked] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('display_name, dob, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || '')
          setDob(data.dob || '')
          setDobLocked(!!data.dob)
          setAvatarUrl(data.avatar_url || null)
        }
        setPageLoading(false)
      })
  }, [user])

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(path)
    const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}` // cache-bust

    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
    setAvatarUrl(publicUrl)
    setUploading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    const updates = { display_name: displayName.trim() }

    // DOB can only ever be set once — never overwritten after that
    if (!dobLocked && dob) {
      updates.dob = dob
    }

    await supabase.from('profiles').update(updates).eq('id', user.id)

    if (!dobLocked && dob) setDobLocked(true)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading || !user || pageLoading) return null

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-md px-6 py-12">
          <h1 className="font-display mb-8 text-2xl font-bold uppercase tracking-tight">Settings</h1>

          {/* Profile picture */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white/10 font-display text-xl">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                user.email.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="font-body rounded-md border border-white/20 px-4 py-2 text-xs font-semibold disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
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
            </div>

            <div>
              <label className="font-body mb-2 block text-xs font-semibold tracking-wide text-white/50">
                DATE OF BIRTH
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={dobLocked}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="font-body mt-1 text-xs text-white/40">
                {dobLocked
                  ? 'Your date of birth is locked and cannot be changed once set.'
                  : 'This can only be set once — double check before saving.'}
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
            Password change and address book coming soon.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
