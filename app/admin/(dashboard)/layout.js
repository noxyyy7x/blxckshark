'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { getStaffProfile, ADMIN_SECTIONS } from '@/lib/staff'
import { supabase } from '@/lib/supabaseClient'
import BrandLoader from '@/components/BrandLoader'
import {
  BoxIcon, TagIcon, StarIcon, ChatBubbleIcon, UsersIcon, BadgeCheckIcon,
  PercentIcon, BankIcon, SearchIcon, TrophyIcon, ClockIcon, ListIcon, GearIcon,
} from '@/components/Icons'

const SECTION_ICONS = {
  orders: BoxIcon,
  products: TagIcon,
  reviews: StarIcon,
  messages: ChatBubbleIcon,
  athletes: UsersIcon,
  athleteApplications: BadgeCheckIcon,
  discounts: PercentIcon,
  cashouts: BankIcon,
  referralReview: SearchIcon,
  leaderboard: TrophyIcon,
  chat: ChatBubbleIcon,
  attendance: ClockIcon,
  logs: ListIcon,
  staff: UsersIcon,
  settings: GearIcon,
}

const GROUPS = [
  { heading: 'COMMERCE', keys: ['orders', 'products', 'discounts', 'reviews'] },
  { heading: 'COMMUNITY', keys: ['messages', 'athletes', 'athleteApplications', 'referralReview', 'cashouts', 'leaderboard', 'chat'] },
  { heading: 'OPERATIONS', keys: ['attendance', 'logs', 'staff', 'settings'] },
]

export default function AdminLayout({ children }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [staff, setStaff] = useState(null)
  const [checked, setChecked] = useState(false)
  const [badges, setBadges] = useState({})

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/admin/login')
      return
    }
    getStaffProfile(user.id).then((profile) => {
      if (!profile) {
        router.push('/home')
        return
      }
      setStaff(profile)
      setChecked(true)
    })
  }, [user, loading, router])

  useEffect(() => {
    if (!checked) return
    Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
      supabase.from('cashout_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('athlete_application_status', 'pending'),
      supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]).then(([orders, cashouts, applications, reviews]) => {
      setBadges({
        orders: orders.count || 0,
        cashouts: cashouts.count || 0,
        athleteApplications: applications.count || 0,
        reviews: reviews.count || 0,
      })
    })
  }, [checked])

  if (loading || !checked || !staff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <BrandLoader />
      </div>
    )
  }

  const visibleSections = ADMIN_SECTIONS.filter((s) =>
    s.ownerOnly ? staff.is_owner : staff.is_owner || staff.permissions?.[s.key]
  )
  const visibleKeys = new Set(visibleSections.map((s) => s.key))
  const sectionByKey = Object.fromEntries(visibleSections.map((s) => [s.key, s]))
  const initials = (staff.name || '?').charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-white/10">
        <div className="border-b border-white/10 px-5 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wordmark-email.png" alt="BLXCKSHARK" className="h-4 w-auto" />
          <p className="font-body mt-1.5 text-[11px] font-semibold tracking-[0.2em] text-white/40">ADMIN PANEL</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {GROUPS.map((group) => {
            const items = group.keys.filter((k) => visibleKeys.has(k))
            if (items.length === 0) return null

            return (
              <div key={group.heading} className="mb-5 px-3">
                <p className="font-body mb-1.5 px-2 text-[10px] font-semibold tracking-[0.15em] text-white/30">
                  {group.heading}
                </p>
                {items.map((key) => {
                  const section = sectionByKey[key]
                  const Icon = SECTION_ICONS[key]
                  const isActive = pathname === section.href
                  const badgeCount = badges[key]

                  return (
                    <a
                      key={key}
                      href={section.href}
                      className="relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="admin-active-nav"
                          className="absolute inset-0 rounded-md bg-white/10"
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                        />
                      )}
                      <Icon className={`relative z-10 h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/40'}`} />
                      <span className={`font-body relative z-10 flex-1 ${isActive ? 'text-white' : 'text-white/60'}`}>
                        {section.label}
                      </span>
                      {badgeCount > 0 && (
                        <span className="font-body relative z-10 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold leading-none text-black">
                          {badgeCount}
                        </span>
                      )}
                    </a>
                  )
                })}
              </div>
            )
          })}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-xs">
              {initials}
            </div>
            <div>
              <p className="font-body text-xs font-medium text-white/80">{staff.name}</p>
              <p className="font-body text-[10px] text-white/40">
                {staff.is_owner ? 'Owner' : 'Staff'}
              </p>
            </div>
          </div>
          <button
            onClick={async () => { await signOut(); router.push('/home') }}
            className="font-body text-xs text-white/40 underline hover:text-white"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
