'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

function Stars({ rating, onSelect, size = 'text-lg' }) {
  return (
    <div className={`flex gap-1 ${size}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onSelect?.(n)}
          disabled={!onSelect}
          className={n <= rating ? 'text-white' : 'text-white/20'}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ProductReviews({ productId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [myReview, setMyReview] = useState(null)
  const [loading, setLoading] = useState(true)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: approved } = await supabase
        .from('reviews')
        .select('*, profiles(display_name, email)')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      setReviews(approved || [])

      if (user) {
        const { data: mine } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .eq('user_id', user.id)
          .maybeSingle()
        setMyReview(mine || null)
      }

      setLoading(false)
    }
    load()
  }, [productId, user])

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${crypto.randomUUID()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('reviews').upload(path, file)
    if (!uploadError) {
      const { data } = supabase.storage.from('reviews').getPublicUrl(path)
      setImage(data.publicUrl)
    }
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (rating === 0 || !comment.trim()) {
      setError('Please add a rating and a comment.')
      return
    }

    setSubmitting(true)
    const { data, error: insertError } = await supabase
      .from('reviews')
      .insert({ product_id: productId, user_id: user.id, rating, comment: comment.trim(), image_url: image })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    setMyReview(data)
    setSubmitting(false)
  }

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (loading) return null

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h2 className="font-display text-xl font-bold uppercase tracking-tight">Reviews</h2>
        {average && (
          <span className="font-body flex items-center gap-1 text-sm text-white/60">
            <Stars rating={Math.round(average)} size="text-sm" /> {average} ({reviews.length})
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="font-body mb-8 text-sm text-white/40">
          No reviews yet — be the first to review this product.
        </p>
      ) : (
        <div className="mb-8 flex flex-col gap-5">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-white/10 pb-5">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-body text-sm font-semibold">
                  {r.profiles?.display_name || 'Verified Customer'}
                </p>
                <p className="font-body text-xs text-white/30">
                  {new Date(r.created_at).toLocaleDateString('en-GB')}
                </p>
              </div>
              <Stars rating={r.rating} size="text-sm" />
              <p className="font-body mt-2 text-sm text-white/60">{r.comment}</p>
              {r.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image_url} alt="" className="mt-3 h-24 w-24 rounded-lg object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      {!user ? (
        <p className="font-body text-sm text-white/40">
          <a href="/login" className="underline hover:text-white">Sign in</a> to leave a review.
        </p>
      ) : myReview ? (
        <p className="font-body text-sm text-white/40">
          {myReview.status === 'pending'
            ? "You've submitted a review — it's pending approval."
            : myReview.status === 'approved'
            ? "You've already reviewed this product."
            : 'Your review was not approved.'}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <p className="font-body mb-3 text-sm font-semibold">Write a Review</p>
          <div className="mb-3">
            <Stars rating={rating} onSelect={setRating} />
          </div>
          <textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="font-body mb-3 w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} className="font-body mb-3 text-xs" />
          {uploading && <p className="font-body mb-2 text-xs text-white/40">Uploading image...</p>}
          {error && <p className="font-body mb-2 text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="font-body rounded-md bg-white px-5 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </div>
  )
}
