'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

const CRITERIA = [
  {
    title: 'Consistent Training',
    desc: 'You train regularly and show real dedication to your craft — lifting, running, whatever your discipline.',
  },
  {
    title: 'Content Creation',
    desc: 'You regularly post training content tagging @blxckshark.co (Instagram/TikTok/Threads) or @blxcksharkco (X), or using #blxckshark.',
  },
  {
    title: 'Community Impact',
    desc: "You inspire and motivate others — your presence makes a difference beyond just your own numbers.",
  },
]

const PERKS = [
  { title: '20% Commission', desc: 'On every sale generated through your custom code — 10% above standard referral rate.' },
  { title: 'Custom Vanity Code', desc: 'Your own branded code (e.g. YOURNAME20) instead of a random referral code.' },
  { title: 'Real Cash Payouts', desc: 'Cash out at £200 via direct bank transfer — just add your payout details once you\u2019re in.' },
  { title: 'Athlete Badge', desc: 'A distinct badge on your profile, visible across the BLXCKSHARK community.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}

export default function AthletesPage() {
  return (
    <>
      <NotificationBar />
      <Header />

      <main className="bg-[#0a0a0a] text-white">
        {/* Hero */}
        <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl"
              style={{ background: 'radial-gradient(circle, #fff, transparent 70%)' }}
            />
          </div>

          <motion.img
            src="/tiers/blxckshark-tier.png"
            alt=""
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 mb-8 h-28 w-28 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-body relative z-10 mb-3 text-xs font-semibold tracking-[0.35em] text-white/50"
          >
            INVITE ONLY
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display relative z-10 text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl"
          >
            Become an
            <br />
            Athlete
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="font-body relative z-10 mt-5 max-w-md text-sm text-white/60 sm:text-base"
          >
            The BLXCKSHARK Athlete program isn&apos;t an application — it&apos;s an invitation.
            We find you.
          </motion.p>
        </section>

        {/* What we look for */}
        <section className="border-t border-white/10 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <motion.p {...fadeUp} className="font-body mb-2 text-center text-xs font-semibold tracking-[0.3em] text-white/40">
              THE CRITERIA
            </motion.p>
            <motion.h2 {...fadeUp} className="font-display mb-14 text-center text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              What We Look For
            </motion.h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {CRITERIA.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <span className="font-display mb-4 block text-4xl font-bold text-white/10">
                    0{i + 1}
                  </span>
                  <h3 className="font-body mb-2 text-base font-semibold">{c.title}</h3>
                  <p className="font-body text-sm text-white/50">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="border-t border-white/10 bg-gradient-to-b from-[#0d0d0d] to-black px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.p {...fadeUp} className="font-body mb-2 text-center text-xs font-semibold tracking-[0.3em] text-white/40">
              THE REWARDS
            </motion.p>
            <motion.h2 {...fadeUp} className="font-display mb-14 text-center text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Athlete Perks
            </motion.h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PERKS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-5"
                >
                  <span className="font-display mt-0.5 text-xl text-white/30">🦈</span>
                  <div>
                    <p className="font-body text-sm font-semibold">{p.title}</p>
                    <p className="font-body mt-1 text-xs text-white/50">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 px-6 py-24 text-center">
          <motion.h2 {...fadeUp} className="font-display mb-4 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            Show Us What You&apos;ve Got
          </motion.h2>
          <motion.p {...fadeUp} className="font-body mx-auto mb-8 max-w-md text-sm text-white/50">
            Post your training. Tag <span className="text-white">@blxckshark.co</span> or use{' '}
            <span className="text-white">#blxckshark</span>. Stay consistent. We&apos;re always watching for
            the next athlete to join the movement.
          </motion.p>
          <motion.a
            {...fadeUp}
            href="https://instagram.com/blxckshark.co"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body inline-block rounded-md bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
          >
            Follow @blxckshark.co
          </motion.a>
        </section>
      </main>

      <Footer />
    </>
  )
}
