'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import TierCard from '@/components/TierCard'
import { TIERS } from '@/lib/tiers'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

export default function TiersPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [userXp, setUserXp] = useState(null)
  const scrollRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('xp')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setUserXp(data.xp)
      })
  }, [user])

  function scrollToIndex(index) {
    const container = scrollRef.current
    if (!container) return
    const card = container.children[index]
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    setActiveIndex(index)
  }

  function handleScroll() {
    const container = scrollRef.current
    if (!container) return
    const scrollLeft = container.scrollLeft
    const cardWidth = container.children[0]?.offsetWidth || 1
    const gap = 20
    const index = Math.round(scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(TIERS.length - 1, Math.max(0, index)))
  }

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] pb-16 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body mb-2 text-xs font-semibold tracking-[0.3em] text-white/40"
          >
            LOYALTY PROGRAM
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display mb-3 text-3xl font-bold uppercase tracking-tight sm:text-5xl"
          >
            Choose Your Tier
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-body mx-auto max-w-md text-sm text-white/50"
          >
            Earn XP with every purchase, follow, and referral. Climb the ranks and unlock more the
            further you go.
          </motion.p>
        </div>

        {/* Card carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto px-[6vw] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-12"
        >
          {TIERS.map((tier) => {
            const isCurrent = userXp !== null && tier.number === [...TIERS].reverse().find((t) => userXp >= t.xpRequired)?.number
            return <TierCard key={tier.number} tier={tier} isCurrent={isCurrent} />
          })}
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {TIERS.map((tier, i) => (
            <button
              key={tier.number}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${tier.name}`}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
