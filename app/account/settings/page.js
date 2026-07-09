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

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const [addresses, setAddresses] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', name: '', line1: '', city: '', postcode: '' })
  const [addressSaving, setAddressSaving] = useState(false)

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
    supabase
      .from('saved_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .then(({ data }) => setAddresses(data || []))
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

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPasswordError('')

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)

    if (error) {
      setPasswordError(error.message)
      return
    }

    setNewPassword('')
    setConfirmPassword('')
    setPasswordSaved(true)
    setTimeout(() => setPasswordSaved(false), 2000)
  }

  async function handleAddAddress(e) {
    e.preventDefault()
    if (!newAddress.name || !newAddress.line1 || !newAddress.city || !newAddress.postcode) return

    setAddressSaving(true)
    const isFirst = addresses.length === 0

    const { data } = await supabase
      .from('saved_addresses')
      .insert({
        user_id: user.id,
        label: newAddress.label || 'Address',
        name: newAddress.name,
        line1: newAddress.line1,
        city: newAddress.city,
        postcode: newAddress.postcode,
        is_default: isFirst,
      })
      .select()
      .single()

    if (data) setAddresses((prev) => [...prev, data])
    setNewAddress({ label: '', name: '', line1: '', city: '', postcode: '' })
    setShowAddForm(false)
    setAddressSaving(false)
  }

  async function handleDeleteAddress(id) {
    await supabase.from('saved_addresses').delete().eq('id', id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleSetDefault(id) {
    await supabase.from('saved_addresses').update({ is_default: false }).eq('user_id', user.id)
    await supabase.from('saved_addresses').update({ is_default: true }).eq('id', id)
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })))
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

          {/* Password change */}
          <div className="mt-10 border-t border-white/10 pt-8">
            <h2 className="font-body mb-4 text-sm font-semibold">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
              {passwordError && <p className="font-body text-xs text-red-400">{passwordError}</p>}
              <button
                type="submit"
                disabled={passwordSaving}
                className="font-body rounded-md border border-white/20 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {passwordSaving ? 'Updating...' : passwordSaved ? 'Updated ✓' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Address book */}
          <div className="mt-10 border-t border-white/10 pt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-body text-sm font-semibold">Address Book</h2>
              <button
                onClick={() => setShowAddForm((v) => !v)}
                className="font-body text-xs text-white/50 underline hover:text-white"
              >
                {showAddForm ? 'Cancel' : '+ Add Address'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddAddress} className="mb-4 flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <input
                  type="text"
                  placeholder="Label (e.g. Home, Work)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="font-body w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                />
                <input
                  type="text"
                  placeholder="Full name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="font-body w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                />
                <input
                  type="text"
                  placeholder="Address line 1"
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                  className="font-body w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="font-body w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                  />
                  <input
                    type="text"
                    placeholder="Postcode"
                    value={newAddress.postcode}
                    onChange={(e) => setNewAddress({ ...newAddress, postcode: e.target.value })}
                    className="font-body w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addressSaving}
                  className="font-body rounded-md bg-white py-2 text-sm font-semibold text-black disabled:opacity-60"
                >
                  {addressSaving ? 'Saving...' : 'Save Address'}
                </button>
              </form>
            )}

            {addresses.length === 0 ? (
              <p className="font-body text-sm text-white/40">No saved addresses yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-body text-sm font-semibold">
                        {addr.label} {addr.is_default && <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px]">Default</span>}
                      </p>
                      <div className="flex gap-3">
                        {!addr.is_default && (
                          <button onClick={() => handleSetDefault(addr.id)} className="font-body text-xs text-white/40 underline hover:text-white">
                            Set Default
                          </button>
                        )}
                        <button onClick={() => handleDeleteAddress(addr.id)} className="font-body text-xs text-red-400/70 underline hover:text-red-400">
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="font-body text-xs text-white/50">
                      {addr.name}, {addr.line1}, {addr.city}, {addr.postcode}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
