'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import HeroSlideshow from '@/components/HeroSlideshow'
import FeaturedSection from '@/components/FeaturedSection'
import CategoryShowcase from '@/components/CategoryShowcase'
import { QualityIcon, PerformanceIcon, ShieldIcon, GlobeIcon } from '@/components/Icons'

const features = [
  { title: 'Premium Quality', desc: 'Top tier materials', Icon: QualityIcon },
  { title: 'Performance Driven', desc: 'Built to perform', Icon: PerformanceIcon },
  { title: 'Built Different', desc: 'Stand out. Be you.', Icon: ShieldIcon },
  { title: 'Worldwide Shipping', desc: 'Delivering worldwide', Icon: GlobeIcon },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
}

export default function HomePage() {
  return (
    <>
      <NotificationBar />
      <Header />

      <main className="bg-[#0a0a0a] text-white">
        {/* Hero — full-bleed slideshow with text overlaid */}
        <section className="relative flex min-h-[85vh] w-full items-center overflow-hidden">
          <HeroSlideshow />

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-xs font-semibold tracking-[0.3em] text-white/50"
          >
            PREMIUM PERFORMANCE APPAREL
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl"
          >
            Built For
            <br />
            <span className="text-white/40">More.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-body max-w-md text-sm text-white/60 sm:text-base"
          >
            Engineered for those who push limits. Designed to stand out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-2 flex flex-wrap gap-3"
          >
            <a
              href="/shop"
              className="font-body flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Collections →
            </a>
            <a
              href="/athletes"
              className="font-body rounded-md border border-white/30 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Join The Movement
            </a>
          </motion.div>
          </div>
        </section>

        {/* Collection preview */}
        <section className="mx-auto max-w-7xl px-6 py-20 text-center">
          <motion.p {...fadeUp} className="font-body text-xs font-semibold tracking-[0.3em] text-white/40">
            SHOP BY CATEGORY
          </motion.p>
          <motion.h2 {...fadeUp} className="font-display mt-3 text-3xl font-bold uppercase tracking-tight sm:text-5xl">
            Explore The Range
          </motion.h2>
          <motion.p {...fadeUp} className="font-body mx-auto mt-3 max-w-md text-sm text-white/50">
            Performance. Style. Purpose. Everything you need. Nothing you don&apos;t.
          </motion.p>

          <CategoryShowcase />
        </section>

        <FeaturedSection />

        {/* Features row */}
        <section className="border-y border-white/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
            {features.map((f) => (
              <motion.div key={f.title} {...fadeUp} className="flex flex-col gap-2">
                <f.Icon className="mb-1 h-6 w-6 text-white/70" />
                <p className="font-body text-sm font-semibold">{f.title}</p>
                <p className="font-body text-xs text-white/50">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
