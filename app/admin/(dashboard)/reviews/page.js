'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'
import BrandLoader from '@/components/BrandLoader'
import { StarIcon } from '@/components/Icons'

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
    return <div className="flex h-screen items-center justify-center"><BrandLoader /></div>
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-2.5">
        <StarIcon className="h-5 w-5 text-white/50" />
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Reviews</h1>
      </div>

      <div className="mb-6 flex gap-1">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-body rounded-full px-3 py-1.5 text-xs capitalize transition-colors ${
              filter === f ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <img src="/logo-icon.svg" alt="" className="mb-3 h-9 w-9 opacity-20" />
          <p className="font-body text-sm text-white/40">No {filter !== 'all' ? filter : ''} reviews.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05]"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-body text-sm font-semibold">{r.products?.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="font-body text-xs text-white/40">
                      {r.profiles?.display_name || r.profiles?.email}
                    </p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <StarIcon
                          key={idx}
                          className={`h-3 w-3 ${idx < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {r.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(r, 'rejected')}
                      className="font-body rounded-md border border-white/20 px-3 py-1.5 text-xs transition-colors hover:bg-white/10"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateStatus(r, 'approved')}
                      className="font-body rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-black transition-transform hover:scale-105"
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <span className={`font-body flex items-center gap-1.5 rounded-full px-3 py-1 text-xs capitalize ${
                    r.status === 'approved' ? 'bg-green-400/10 text-green-300' : 'bg-red-400/10 text-red-300'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${r.status === 'approved' ? 'bg-green-400' : 'bg-red-400'}`} />
                    {r.status}
                  </span>
                )}
              </div>
              <p className="font-body text-sm text-white/60">{r.comment}</p>
              {r.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image_url} alt="" className="mt-3 h-20 w-20 rounded-lg object-cover" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
