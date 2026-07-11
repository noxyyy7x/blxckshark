'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getTierProgress } from '@/lib/tiers'
import BrandLoader from '@/components/BrandLoader'
import {
  BoxIcon, GiftIcon, ChartIcon, ShareIcon, UsersIcon, BankIcon, GearIcon, ChatBubbleIcon,
} from '@/components/Icons'

export default function AccountPage() {
  const { user, loading, isEmailVerified, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [stats, setStats] = useState({ orderCount: 0, rewardCount: 0 })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setProfile(data)
        setProfileLoading(false)
      })

    Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('user_rewards').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('redeemed', false),
    ]).then(([orders, rewards]) => {
      setStats({ orderCount: orders.count || 0, rewardCount: rewards.count || 0 })
    })
  }, [user])

  if (loading || !user || profileLoading) {
    return (
      <>
        <NotificationBar />
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center bg-[#0a0a0a] text-white">
          <BrandLoader />
        </main>
        <Footer />
      </>
    )
  }

  const xp = profile?.xp ?? 0
  const { current, next, progress } = getTierProgress(xp)
  const isAthlete = profile?.role === 'athlete'

  const sections = [
    {
      heading: 'ACTIVITY',
      items: [
        { label: 'Orders', href: '/account/orders', Icon: BoxIcon, badge: stats.orderCount > 0 ? stats.orderCount : null },
        { label: 'Rewards', href: '/account/rewards', Icon: GiftIcon, badge: stats.rewardCount > 0 ? stats.rewardCount : null },
        { label: 'Points History', href: '/account/points', Icon: ChartIcon },
      ],
    },
    {
      heading: 'GROW',
      items: [
        { label: 'Refer a Friend', href: '/account/referral', Icon: ShareIcon },
        { label: 'Social Rewards', href: '/account/social', Icon: UsersIcon },
        ...(isAthlete ? [{ label: 'Payout Details', href: '/account/payout-details', Icon: BankIcon }] : []),
      ],
    },
    {
      heading: 'ACCOUNT',
      items: [
        { label: 'Settings', href: '/account/settings', Icon: GearIcon },
        { label: 'Support', href: '/contact', Icon: ChatBubbleIcon },
      ],
    },
  ]

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-3xl px-6 py-12">
          {!isEmailVerified && (
            <div className="mb-8 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
              <p className="font-body text-sm text-yellow-200">
                Please verify your email to unlock XP, rewards, and referral cashout.
              </p>
            </div>
          )}

          {/* Profile hero — tinted with the customer's actual current tier */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${current.gradient} p-6 sm:p-8`}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-black/40 font-display text-2xl">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  user.email.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <p className="font-body text-lg font-semibold">
                  {profile?.display_name || user.email}
                </p>
                {isAthlete && (
                  <p className="font-body text-xs font-semibold text-white/80">🦈 BLXCKSHARK Athlete</p>
                )}
                <a href="/tiers" className="font-body mt-1 flex items-center justify-center gap-1.5 text-sm text-white/70 underline hover:text-white sm:justify-start">
                  Tier {current.number} · {current.name}
                </a>
                <div className="mx-auto mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-black/40 sm:mx-0">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-white"
                  />
                </div>
                <p className="font-body mt-1.5 text-xs text-white/60">
                  {next ? `${xp.toLocaleString()} / ${next.xpRequired.toLocaleString()} XP to ${next.name}` : `${xp.toLocaleString()} XP · Max tier reached`}
                </p>
              </div>

              {current.icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.icon} alt="" className="hidden h-16 w-16 object-contain opacity-90 sm:block" />
              )}
            </div>
          </motion.div>

          {/* Sections */}
          {sections.map((section, sIdx) => (
            <div key={section.heading} className="mb-8">
              <p className="font-body mb-3 text-xs font-semibold tracking-[0.2em] text-white/40">
                {section.heading}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.items.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + sIdx * 0.08 + i * 0.04 }}
                    className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <item.Icon className="h-5 w-5 text-white/50 transition-colors group-hover:text-white" />
                      <span className="font-body text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge != null && (
                      <span className="font-body rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-black">
                        {item.badge}
                      </span>
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={async () => { await signOut(); router.push('/home') }}
            className="font-body mt-4 text-sm text-white/40 underline hover:text-white"
          >
            Log Out
          </button>
        </div>
      </main>

      <Footer />
    </>
  )
}
