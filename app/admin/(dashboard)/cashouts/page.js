'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'

export default function AdminCashoutsPage() {
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const [generatedCode, setGeneratedCode] = useState(null)
  const [cashConfirm, setCashConfirm] = useState(null)

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
    loadRequests()
  }, [user])

  async function loadRequests() {
    const { data } = await supabase
      .from('cashout_requests')
      .select('*, profiles(email, display_name, referral_balance, role)')
      .order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  function generateCashoutCode() {
    return `BSCASH${Math.floor(100000 + Math.random() * 900000)}`
  }

  async function deductBalance(request) {
    const currentBalance = Number(request.profiles?.referral_balance || 0)
    const newBalance = Math.max(0, currentBalance - Number(request.amount))
    await supabase.from('profiles').update({ referral_balance: newBalance }).eq('id', request.user_id)
  }

  // Customers: balance converts to a discount code (existing flow)
  async function handleApproveCode(request) {
    setProcessingId(request.id)
    const code = generateCashoutCode()

    await supabase.from('user_rewards').insert({
      user_id: request.user_id,
      tier_number: null,
      code,
      amount: request.amount,
      source: 'referral_cashout',
    })

    await supabase.from('cashout_requests').update({ status: 'paid' }).eq('id', request.id)
    await deductBalance(request)

    await logActivity(staffId, 'cashout_approved', {
      userEmail: request.profiles?.email,
      amount: request.amount,
      code,
    })

    await supabase.from('messages').insert({
      user_id: request.user_id,
      title: 'Your redemption is ready',
      body: `Your £${Number(request.amount).toFixed(2)} referral balance has been converted into a discount code.`,
      code,
    })

    setGeneratedCode({ email: request.profiles?.email, code, amount: request.amount })
    setProcessingId(null)
    loadRequests()
  }

  // Athletes: real cash payout via bank transfer, done manually outside the
  // site — this just confirms it's been sent and updates records/balance.
  async function handleApproveCash(request) {
    setProcessingId(request.id)

    await supabase.from('cashout_requests').update({ status: 'paid' }).eq('id', request.id)
    await deductBalance(request)

    await logActivity(staffId, 'cashout_approved_cash', {
      userEmail: request.profiles?.email,
      amount: request.amount,
    })

    await supabase.from('messages').insert({
      user_id: request.user_id,
      title: 'Your cashout has been sent',
      body: `Your £${Number(request.amount).toFixed(2)} athlete cashout has been processed via bank transfer.`,
    })

    setCashConfirm(null)
    setProcessingId(null)
    loadRequests()
  }

  async function handleReject(request) {
    if (!confirm('Reject this cashout request? The balance will remain untouched.')) return

    setProcessingId(request.id)
    await supabase.from('cashout_requests').update({ status: 'rejected' }).eq('id', request.id)
    await logActivity(staffId, 'cashout_rejected', {
      userEmail: request.profiles?.email,
      amount: request.amount,
    })
    setProcessingId(null)
    loadRequests()
  }

  const filtered = requests.filter((r) => filter === 'all' || r.status === filter)

  if (loading) {
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">
        Cashout Requests
      </h1>
      <p className="font-body mb-6 text-sm text-white/50">
        Customers redeem their balance as a discount code. Athletes receive a real bank transfer —
        always review their referral history before approving.
      </p>

      {generatedCode && (
        <div className="mb-6 rounded-lg border border-white/20 bg-white/[0.05] p-4">
          <p className="font-body text-sm">
            Code <span className="font-semibold">{generatedCode.code}</span> generated for{' '}
            <span className="font-semibold">{generatedCode.email}</span> — £{Number(generatedCode.amount).toFixed(2)}
          </p>
          <p className="font-body mt-1 text-xs text-white/50">
            It now also appears on their Rewards page automatically.
          </p>
          <button onClick={() => setGeneratedCode(null)} className="font-body mt-2 text-xs text-white/40 underline">
            Dismiss
          </button>
        </div>
      )}

      {cashConfirm && (
        <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="font-body mb-3 text-sm text-yellow-100">
            Confirm you have <strong>already sent £{Number(cashConfirm.amount).toFixed(2)}</strong> to{' '}
            {cashConfirm.profiles?.display_name || cashConfirm.profiles?.email} via bank transfer.
            This only updates records — it does not send money.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCashConfirm(null)}
              className="font-body rounded-md border border-white/20 px-4 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleApproveCash(cashConfirm)}
              disabled={processingId === cashConfirm.id}
              className="font-body rounded-md bg-yellow-400 px-4 py-2 text-xs font-semibold text-black disabled:opacity-60"
            >
              {processingId === cashConfirm.id ? 'Confirming...' : 'Confirm Sent'}
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex gap-1">
        {['pending', 'paid', 'rejected', 'all'].map((f) => (
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

      {filtered.length === 0 ? (
        <p className="font-body text-sm text-white/40">No {filter !== 'all' ? filter : ''} cashout requests.</p>
      ) : (
        <div className="divide-y divide-white/10 border-y border-white/10">
          {filtered.map((r) => {
            const isAthlete = r.profiles?.role === 'athlete'
            return (
              <div key={r.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-body text-sm font-semibold">
                    {r.profiles?.display_name || r.profiles?.email}
                    {isAthlete && (
                      <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-normal text-white/60">
                        ATHLETE
                      </span>
                    )}
                  </p>
                  <p className="font-body text-xs text-white/40">
                    £{Number(r.amount).toFixed(2)} · Requested {new Date(r.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>

                {r.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={`/admin/referral-review?email=${encodeURIComponent(r.profiles?.email || '')}`}
                      className="font-body rounded-md border border-white/20 px-3 py-2 text-xs"
                    >
                      Review History
                    </a>
                    <button
                      onClick={() => handleReject(r)}
                      disabled={processingId === r.id}
                      className="font-body rounded-md border border-white/20 px-4 py-2 text-xs font-semibold disabled:opacity-50"
                    >
                      Reject
                    </button>
                    {isAthlete ? (
                      <button
                        onClick={() => setCashConfirm(r)}
                        disabled={processingId === r.id}
                        className="font-body rounded-md bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-50"
                      >
                        Approve Cash Payout
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproveCode(r)}
                        disabled={processingId === r.id}
                        className="font-body rounded-md bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-50"
                      >
                        {processingId === r.id ? 'Generating code...' : 'Approve & Generate Code'}
                      </button>
                    )}
                  </div>
                ) : (
                  <span className={`font-body rounded-full px-3 py-1 text-xs capitalize ${
                    r.status === 'paid' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
                  }`}>
                    {r.status}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
