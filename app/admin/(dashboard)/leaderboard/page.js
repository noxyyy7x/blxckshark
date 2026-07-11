'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { getTierForXp } from '@/lib/tiers'
import BrandLoader from '@/components/BrandLoader'

const PODIUM_STYLES = {
  1: { height: 'h-64', accent: '#FFD700', label: '1ST', order: 'order-2' },
  2: { height: 'h-52', accent: '#C0C0C0', label: '2ND', order: 'order-1' },
  3: { height: 'h-44', accent: '#CD7F32', label: '3RD', order: 'order-3' },
}

export default function AdminLeaderboardPage() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(20)
      setProfiles(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><BrandLoader /></div>
  }

  const top3 = profiles.slice(0, 3)
  const rest = profiles.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-black p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 text-center">
          <p className="font-body text-xs font-semibold tracking-[0.3em] text-white/40">
            BLXCKSHARK
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold uppercase tracking-tight text-white">
            XP Leaderboard
          </h1>
          <p className="font-body mt-2 text-sm text-white/40">
            Top earners across the whole movement
          </p>
        </div>

        {/* Podium — top 3 */}
        {top3.length > 0 && (
          <div className="mt-14 mb-16 flex items-end justify-center gap-4">
            {top3.map((profile, i) => {
              const rank = i + 1
              const tier = getTierForXp(profile.xp)
              const style = PODIUM_STYLES[rank]
              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex w-36 flex-col items-center ${style.order}`}
                >
                  <div className="mb-3 flex flex-col items-center">
                    {tier.icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tier.icon} alt="" className="mb-2 h-16 w-16 object-contain drop-shadow-lg" />
                    )}
                    <p className="font-body max-w-[130px] truncate text-sm font-semibold text-white">
                      {profile.display_name || profile.email.split('@')[0]}
                    </p>
                    <p className="font-display text-lg font-bold" style={{ color: style.accent }}>
                      {profile.xp.toLocaleString()} XP
                    </p>
                  </div>
                  <div
                    className={`flex w-full ${style.height} flex-col items-center justify-start rounded-t-lg pt-3`}
                    style={{
                      background: `linear-gradient(to bottom, ${style.accent}33, ${style.accent}11)`,
                      borderTop: `3px solid ${style.accent}`,
                    }}
                  >
                    <span
                      className="font-display text-3xl font-bold"
                      style={{ color: style.accent }}
                    >
                      {style.label}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Rest of the leaderboard */}
        {rest.length > 0 && (
          <div className="divide-y divide-white/10 rounded-lg border border-white/10 bg-white/[0.02]">
            {rest.map((profile, i) => {
              const rank = i + 4
              const tier = getTierForXp(profile.xp)
              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + Math.min(i * 0.03, 0.4) }}
                  className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="font-display w-6 text-sm font-bold text-white/40">
                    {rank}
                  </span>
                  {tier.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tier.icon} alt="" className="h-8 w-8 object-contain" />
                  )}
                  <span className="font-body flex-1 truncate text-sm text-white">
                    {profile.display_name || profile.email.split('@')[0]}
                  </span>
                  <span className="font-body text-xs text-white/40">{tier.name}</span>
                  <span className="font-display w-20 text-right text-sm font-bold text-white">
                    {profile.xp.toLocaleString()} XP
                  </span>
                </motion.div>
              )
            })}
          </div>
        )}

        {profiles.length === 0 && (
          <p className="font-body text-center text-sm text-white/40">No customers yet.</p>
        )}
      </div>
    </div>
  )
}
