'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'

export default function AdminDiscountsPage() {
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCode, setNewCode] = useState('')
  const [newPercent, setNewPercent] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
    loadCodes()
  }, [user])

  async function loadCodes() {
    const { data } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false })
    setCodes(data || [])
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    const code = newCode.trim().toUpperCase()
    const percent = parseInt(newPercent, 10)

    if (!code || !percent || percent < 1 || percent > 100) {
      setError('Enter a valid code and a percentage between 1–100.')
      return
    }

    setCreating(true)
    const { error: insertError } = await supabase
      .from('discount_codes')
      .insert({ code, percent_off: percent })

    if (insertError) {
      setError(insertError.code === '23505' ? 'That code already exists.' : insertError.message)
      setCreating(false)
      return
    }

    await logActivity(staffId, 'discount_code_created', { code, percent })
    setNewCode('')
    setNewPercent('')
    setCreating(false)
    loadCodes()
  }

  async function toggleActive(codeRow) {
    await supabase
      .from('discount_codes')
      .update({ active: !codeRow.active })
      .eq('id', codeRow.id)

    await logActivity(staffId, codeRow.active ? 'discount_code_deactivated' : 'discount_code_activated', {
      code: codeRow.code,
    })
    loadCodes()
  }

  if (loading) {
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-6 text-2xl font-bold uppercase tracking-tight">
        Discount Codes
      </h1>

      {/* Create new code */}
      <form onSubmit={handleCreate} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div>
          <label className="font-body mb-1 block text-xs text-white/40">Code</label>
          <input
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="e.g. LAUNCH20"
            className="font-body w-40 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm uppercase outline-none placeholder:normal-case placeholder:text-white/30"
          />
        </div>
        <div>
          <label className="font-body mb-1 block text-xs text-white/40">% Off</label>
          <input
            type="number"
            min="1"
            max="100"
            value={newPercent}
            onChange={(e) => setNewPercent(e.target.value)}
            placeholder="10"
            className="font-body w-24 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="font-body rounded-md bg-white px-5 py-2 text-sm font-semibold text-black disabled:opacity-60"
        >
          {creating ? 'Creating...' : 'Create Code'}
        </button>
        {error && <p className="font-body w-full text-xs text-red-400">{error}</p>}
      </form>

      {/* Codes list */}
      {codes.length === 0 ? (
        <p className="font-body text-sm text-white/40">No discount codes created yet.</p>
      ) : (
        <div className="divide-y divide-white/10 border-y border-white/10">
          {codes.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-body text-sm font-semibold">{c.code}</p>
                <p className="font-body text-xs text-white/40">
                  {c.percent_off}% off · Created {new Date(c.created_at).toLocaleDateString('en-GB')}
                </p>
              </div>
              <button
                onClick={() => toggleActive(c)}
                className={`font-body rounded-full px-3 py-1.5 text-xs font-semibold ${
                  c.active ? 'bg-white text-black' : 'border border-white/20 text-white/50'
                }`}
              >
                {c.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
