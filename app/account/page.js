'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'

// TODO: replace with real data from Supabase "users" table once the
// loyalty/XP system tables exist (tier, xp, athlete role, etc.)
const mockProfile = {
  tierName: 'White Shark',
  tierNumber: 1,
  xp: 120,
  nextTierXp: 1000,
  isAthlete: false,
}

export default function AccountPage() {
  const { user, loading, isEmailVerified, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <>
        <NotificationBar />
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-[#0a0a0a] text-white">
          <p className="font-body text-sm text-white/40">Loading...</p>
        </main>
        <Footer />
      </>
    )
  }

  const progress = Math.min(100, (mockProfile.xp / mockProfile.nextTierXp) * 100)

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-3xl px-6 py-12">
          {/* Email verification banner */}
          {!isEmailVerified && (
            <div className="mb-8 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
              <p className="font-body text-sm text-yellow-200">
                Please verify your email to unlock XP, rewards, and referral cashout.
              </p>
            </div>
          )}

          {/* Profile header */}
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 font-display text-xl">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-body text-lg font-semibold">{user.email}</p>
              {mockProfile.isAthlete && (
                <p className="font-body text-xs font-semibold text-white/70">🦈 BLXCKSHARK Athlete</p>
              )}
              <p className="font-body text-sm text-white/50">
                Tier {mockProfile.tierNumber} · {mockProfile.tierName}
              </p>
              <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
              </div>
              <p className="font-body mt-1 text-xs text-white/40">
                {mockProfile.xp} / {mockProfile.nextTierXp} XP to next tier
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: 'Orders', href: '/account/orders' },
              { label: 'Rewards', href: '/account/rewards' },
              { label: 'Points History', href: '/account/points' },
              { label: 'Refer a Friend', href: '/account/referral' },
              { label: 'Settings', href: '/account/settings' },
              { label: 'Support', href: '/contact' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-body rounded-md border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-medium transition-colors hover:bg-white/[0.06]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={async () => { await signOut(); router.push('/home') }}
            className="font-body mt-10 text-sm text-white/40 underline hover:text-white"
          >
            Log Out
          </button>
        </div>
      </main>

      <Footer />
    </>
  )
}
