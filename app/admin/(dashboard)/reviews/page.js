'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'

export default function AdminReviewsPage() {
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
    loadReviews()
  }, [user])

  async function loadReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(display_name, email), products(name)')
      .order('created_at', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }

  async function updateStatus(review, status) {
    await supabase.from('reviews').update({ status }).eq('id', review.id)
    await logActivity(staffId, status === 'approved' ? 'review_approved' : 'review_rejected', {
      product: review.products?.name,
      reviewer: review.profiles?.email,
    })
    loadReviews()
  }

  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter)

  if (loading) {
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-6 text-2xl font-bold uppercase tracking-tight">Reviews</h1>

      <div className="mb-6 flex gap-1">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
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
        <p className="font-body text-sm text-white/40">No {filter !== 'all' ? filter : ''} reviews.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-semibold">{r.products?.name}</p>
                  <p className="font-body text-xs text-white/40">
                    {r.profiles?.display_name || r.profiles?.email} · {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </p>
                </div>
                {r.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(r, 'rejected')}
                      className="font-body rounded-md border border-white/20 px-3 py-1.5 text-xs"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateStatus(r, 'approved')}
                      className="font-body rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black"
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <span className={`font-body rounded-full px-3 py-1 text-xs capitalize ${
                    r.status === 'approved' ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
                  }`}>
                    {r.status}
                  </span>
                )}
              </div>
              <p className="font-body text-sm text-white/60">{r.comment}</p>
              {r.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image_url} alt="" className="mt-3 h-20 w-20 rounded-lg object-cover" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
