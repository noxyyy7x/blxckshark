'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity, ADMIN_SECTIONS } from '@/lib/staff'

// Every section a staff member could be granted, excluding Staff
// Management itself (always owner-only, never assignable).
const ASSIGNABLE_SECTIONS = ADMIN_SECTIONS.filter((s) => !s.ownerOnly)

export default function AdminStaffPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [me, setMe] = useState(null)
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [permissions, setPermissions] = useState({})
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    getStaffProfile(user.id).then((profile) => {
      if (!profile?.is_owner) {
        router.push('/admin')
        return
      }
      setMe(profile)
      loadStaff()
    })
  }, [user, router])

  async function loadStaff() {
    const { data } = await supabase
      .from('staff_users')
      .select('*')
      .order('created_at', { ascending: true })
    setStaffList(data || [])
    setLoading(false)
  }

  function togglePermission(key) {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }

    setCreating(true)
    const { error: insertError } = await supabase.from('staff_users').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      permissions,
      is_owner: false,
    })

    if (insertError) {
      setError(insertError.code === '23505' ? 'A staff account with that email already exists.' : insertError.message)
      setCreating(false)
      return
    }

    await logActivity(me.id, 'staff_created', { email: email.trim().toLowerCase() })
    setName('')
    setEmail('')
    setPermissions({})
    setCreating(false)
    loadStaff()
  }

  async function updateStaffPermission(staffMember, key, value) {
    const newPermissions = { ...staffMember.permissions, [key]: value }
    await supabase
      .from('staff_users')
      .update({ permissions: newPermissions })
      .eq('id', staffMember.id)
    await logActivity(me.id, 'staff_permissions_updated', { email: staffMember.email, key, value })
    loadStaff()
  }

  async function removeStaff(staffMember) {
    if (!confirm(`Remove staff access for ${staffMember.name}? They will lose access to the admin panel.`)) return
    await supabase.from('staff_users').delete().eq('id', staffMember.id)
    await logActivity(me.id, 'staff_removed', { email: staffMember.email })
    loadStaff()
  }

  if (loading || !me) {
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">
        Staff Management
      </h1>
      <p className="font-body mb-8 text-sm text-white/50">
        Owner-only. Create staff accounts and control exactly what each person can access.
      </p>

      {/* Create new staff */}
      <form onSubmit={handleCreate} className="mb-10 rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <p className="font-body mb-4 text-sm font-semibold">Add Staff Member</p>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-body flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
          />
          <input
            type="email"
            placeholder="Email (must match their signup email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-body flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
          />
        </div>

        <p className="font-body mb-2 text-xs text-white/40">PERMISSIONS</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {ASSIGNABLE_SECTIONS.map((s) => (
            <label
              key={s.key}
              className={`font-body flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                permissions[s.key] ? 'border-white bg-white text-black' : 'border-white/20 text-white/60'
              }`}
            >
              <input
                type="checkbox"
                checked={!!permissions[s.key]}
                onChange={() => togglePermission(s.key)}
                className="hidden"
              />
              {s.label}
            </label>
          ))}
        </div>

        {error && <p className="font-body mb-3 text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={creating}
          className="font-body rounded-md bg-white px-5 py-2 text-sm font-semibold text-black disabled:opacity-60"
        >
          {creating ? 'Creating...' : 'Create Staff Account'}
        </button>
        <p className="font-body mt-2 text-xs text-white/30">
          They'll need to sign up at /signup using this exact email — access links automatically.
        </p>
      </form>

      {/* Staff list */}
      <div className="flex flex-col gap-4">
        {staffList.map((s) => (
          <div key={s.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-semibold">
                  {s.name} {s.is_owner && <span className="ml-2 rounded bg-white/10 px-2 py-0.5 text-[10px]">OWNER</span>}
                </p>
                <p className="font-body text-xs text-white/40">
                  {s.email} · {s.auth_id ? 'Active' : 'Pending sign-up'}
                </p>
              </div>
              {!s.is_owner && (
                <button
                  onClick={() => removeStaff(s)}
                  className="font-body text-xs text-red-400/70 underline hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>

            {!s.is_owner && (
              <div className="flex flex-wrap gap-2">
                {ASSIGNABLE_SECTIONS.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => updateStaffPermission(s, section.key, !s.permissions?.[section.key])}
                    className={`font-body rounded-full border px-3 py-1.5 text-xs ${
                      s.permissions?.[section.key]
                        ? 'border-white bg-white text-black'
                        : 'border-white/20 text-white/50'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
