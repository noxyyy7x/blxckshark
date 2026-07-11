'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import BrandLoader from '@/components/BrandLoader'
import { useToast } from '@/context/ToastContext'

const XP_PER_FOLLOW = 50

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', href: 'https://instagram.com/blxckshark.co', column: 'followed_instagram' },
  { key: 'x', label: 'X', href: 'https://x.com/blxcksharkco', column: 'followed_x' },
  { key: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/@blxckshark.co', column: 'followed_tiktok' },
  { key: 'threads', label: 'Threads', href: 'https://threads.net/@blxckshark.co', column: 'followed_threads' },
]

export default function SocialRewardsPage() {
  const showToast = useToast()
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [readyToClaim, setReadyToClaim] = useState({})
  const [claiming, setClaiming] = useState(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('xp, followed_instagram, followed_x, followed_tiktok, followed_threads')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setProfile(data)
        setPageLoading(false)
      })
  }, [user])

  function startClaimTimer(platform) {
    // Small delay before the claim button activates — encourages actually
    // following rather than instantly claiming without visiting.
    setTimeout(() => {
      setReadyToClaim((prev) => ({ ...prev, [platform.key]: true }))
    }, 4000)
  }

  async function handleClaim(platform) {
    if (!user || claiming) return
    setClaiming(platform.key)

    const { data: { session } } = await supabase.auth.getSession()

    const res = await fetch('/api/claim-social-xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: session.access_token,
        column: platform.column,
        label: platform.label,
      }),
    })
    const data = await res.json()

    if (res.ok) {
      setProfile((prev) => ({ ...prev, [platform.column]: true, xp: data.newXp }))
    } else {
      showToast(data.error || 'Something went wrong claiming that reward.', 'error')
    }
    setClaiming(null)
  }

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-xl px-6 py-12">
          <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">Social Rewards</h1>
          <p className="font-body mb-8 text-sm text-white/50">
            Follow us and claim {XP_PER_FOLLOW} XP per platform — one-time bonus each.
          </p>

          {loading || pageLoading ? (
            <BrandLoader />
          ) : !user ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="font-body mb-4 text-sm text-white/60">Sign in to claim social rewards.</p>
              <a href="/login" className="font-body inline-block rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black">
                Sign In
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {PLATFORMS.map((platform) => {
                const alreadyClaimed = profile?.[platform.column]
                const isReady = readyToClaim[platform.key]

                return (
                  <div key={platform.key} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <div>
                      <p className="font-body text-sm font-semibold">{platform.label}</p>
                      <p className="font-body text-xs text-white/40">
                        {alreadyClaimed ? 'Claimed ✓' : `+${XP_PER_FOLLOW} XP`}
                      </p>
                    </div>

                    {alreadyClaimed ? (
                      <span className="font-body rounded-full bg-white/10 px-4 py-2 text-xs text-white/50">
                        Claimed
                      </span>
                    ) : isReady ? (
                      <button
                        onClick={() => handleClaim(platform)}
                        disabled={claiming === platform.key}
                        className="font-body rounded-md bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-60"
                      >
                        {claiming === platform.key ? 'Claiming...' : `Claim ${XP_PER_FOLLOW} XP`}
                      </button>
                    ) : (
                      <a
                        href={platform.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => startClaimTimer(platform)}
                        className="font-body rounded-md border border-white/20 px-4 py-2 text-xs font-semibold"
                      >
                        Follow
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
