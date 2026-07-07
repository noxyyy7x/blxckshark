'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

const VALUES = [
  { title: 'Built Different', desc: 'We don\u2019t follow the template. Every piece is designed to stand out, not blend in.' },
  { title: 'No Compromise', desc: 'Performance and style shouldn\u2019t be a trade-off. We refuse to pick one.' },
  { title: 'Community First', desc: 'This brand is built with the people who wear it \u2014 athletes, lifters, and everyone pushing limits.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}

export default function AboutPage() {
  return (
    <>
      <NotificationBar />
      <Header />

      <main className="bg-[#0a0a0a] text-white">
        {/* Hero statement */}
        <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-3xl"
              style={{ background: 'radial-gradient(circle, #fff, transparent 70%)' }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body relative z-10 mb-4 text-xs font-semibold tracking-[0.35em] text-white/50"
          >
            OUR STORY
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-display relative z-10 max-w-3xl text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl"
          >
            Built for those who refuse to blend in.
          </motion.h1>
        </section>

        {/* Story */}
        <section className="border-t border-white/10 px-6 py-24">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 sm:grid-cols-2">
            <motion.div {...fadeUp}>
              <p className="font-body mb-3 text-xs font-semibold tracking-[0.3em] text-white/40">
                WHERE IT STARTED
              </p>
              <h2 className="font-display mb-4 text-2xl font-bold uppercase tracking-tight">
                More Than Apparel
              </h2>
              <p className="font-body text-sm leading-relaxed text-white/60">
                BLXCKSHARK was built on a simple frustration: performance apparel that either looked
                good or performed well, but rarely both. We set out to close that gap \u2014 gear engineered
                for real training, designed with the same care as anything you'd wear outside the gym.
              </p>
            </motion.div>
            <motion.div {...fadeUp}>
              <p className="font-body mb-3 text-xs font-semibold tracking-[0.3em] text-white/40">
                THE PHILOSOPHY
              </p>
              <h2 className="font-display mb-4 text-2xl font-bold uppercase tracking-tight">
                Built For More
              </h2>
              <p className="font-body text-sm leading-relaxed text-white/60">
                More reps. More reasons. More than just a workout. &quot;Built For More&quot; isn&apos;t
                a tagline \u2014 it&apos;s the standard every piece is held to before it ever reaches you.
                We&apos;re not here to make average gymwear. We&apos;re here to make gear that keeps up
                with people who never settle.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-white/10 bg-gradient-to-b from-[#0d0d0d] to-black px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <motion.h2 {...fadeUp} className="font-display mb-14 text-center text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              What We Stand For
            </motion.h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <span className="font-display mb-4 block text-4xl font-bold text-white/10">
                    0{i + 1}
                  </span>
                  <h3 className="font-body mb-2 text-base font-semibold">{v.title}</h3>
                  <p className="font-body text-sm text-white/50">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing statement */}
        <section className="border-t border-white/10 px-6 py-24 text-center">
          <motion.h2
            {...fadeUp}
            className="font-display mx-auto max-w-2xl text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl"
          >
            Built for more. Worn by those who push limits.
          </motion.h2>
          <motion.div {...fadeUp} className="mt-8">
            <a
              href="/shop"
              className="font-body inline-block rounded-md bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              Explore The Collection
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  )
}
