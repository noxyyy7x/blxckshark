'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

const MENS = [
  { intl: 'XS', uk: 'XS', eu: '44', us: 'XS' },
  { intl: 'S', uk: 'S', eu: '46', us: 'S' },
  { intl: 'M', uk: 'M', eu: '48\u201350', us: 'M' },
  { intl: 'L', uk: 'L', eu: '52', us: 'L' },
  { intl: 'XL', uk: 'XL', eu: '54', us: 'XL' },
  { intl: '2XL', uk: '2XL', eu: '56', us: '2XL' },
  { intl: '3XL', uk: '3XL', eu: '58', us: '3XL' },
]

const WOMENS = [
  { intl: 'XXS', uk: '4', eu: '32', us: '0' },
  { intl: 'XS', uk: '6', eu: '34', us: '2' },
  { intl: 'S', uk: '8', eu: '36', us: '4' },
  { intl: 'M', uk: '10', eu: '38', us: '6' },
  { intl: 'L', uk: '12', eu: '40', us: '8' },
  { intl: 'XL', uk: '14', eu: '42', us: '10' },
  { intl: 'XXL', uk: '16', eu: '44', us: '12' },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

function SizeTable({ rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03] text-left text-white/50">
            <th className="p-3 font-body text-xs font-semibold tracking-wide">INTERNATIONAL</th>
            <th className="p-3 font-body text-xs font-semibold tracking-wide">UK</th>
            <th className="p-3 font-body text-xs font-semibold tracking-wide">EU</th>
            <th className="p-3 font-body text-xs font-semibold tracking-wide">US</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.intl} className="border-b border-white/5 last:border-0">
              <td className="font-body p-3 font-semibold">{r.intl}</td>
              <td className="font-body p-3 text-white/70">{r.uk}</td>
              <td className="font-body p-3 text-white/70">{r.eu}</td>
              <td className="font-body p-3 text-white/70">{r.us}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SizeGuidePage() {
  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <motion.h1 {...fadeUp} className="font-display mb-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Size Guide
          </motion.h1>
          <motion.p {...fadeUp} className="font-body mb-12 text-sm text-white/50">
            All product pages show sizes as XXS\u20133XL. Use the tables below to convert to your
            usual UK, EU, or US size.
          </motion.p>

          <motion.h2 {...fadeUp} className="font-body mb-4 text-lg font-semibold">Men&apos;s Apparel</motion.h2>
          <motion.div {...fadeUp} className="mb-14">
            <SizeTable rows={MENS} />
          </motion.div>

          <motion.h2 {...fadeUp} className="font-body mb-4 text-lg font-semibold">Women&apos;s Apparel</motion.h2>
          <motion.div {...fadeUp} className="mb-14">
            <SizeTable rows={WOMENS} />
          </motion.div>

          <motion.h2 {...fadeUp} className="font-body mb-4 text-lg font-semibold">Accessories</motion.h2>
          <motion.div {...fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="font-body mb-1 text-sm font-semibold">Socks</p>
              <p className="font-body text-xs text-white/50">UK 3\u20135 &middot; UK 6\u20138 &middot; UK 9\u201311 &middot; UK 12\u201314</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="font-body mb-1 text-sm font-semibold">Caps</p>
              <p className="font-body text-xs text-white/50">One Size &middot; Adjustable</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="font-body mb-1 text-sm font-semibold">Bags & Backpacks</p>
              <p className="font-body text-xs text-white/50">One Size</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="font-body mb-1 text-sm font-semibold">Shaker Bottles</p>
              <p className="font-body text-xs text-white/50">700ml &middot; 1000ml</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:col-span-2">
              <p className="font-body mb-1 text-sm font-semibold">Water Bottles</p>
              <p className="font-body text-xs text-white/50">500ml &middot; 750ml &middot; 1000ml &middot; 2000ml</p>
            </div>
          </motion.div>

          <motion.p {...fadeUp} className="font-body mt-14 text-xs text-white/30">
            Still unsure? Reach out via live chat and we&apos;ll help you find the right fit.
          </motion.p>
        </div>
      </main>

      <Footer />
    </>
  )
}
