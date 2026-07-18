'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

export default function NotFound() {
  return (
    <>
      <NotificationBar />
      <Header />
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-display text-8xl font-bold text-white/10"
        >
          404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="font-display -mt-4 text-2xl font-bold uppercase tracking-tight"
        >
          Nothing to see here
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="font-body mt-3 max-w-sm text-sm text-white/50"
        >
          The page you&apos;re looking for doesn&apos;t exist, or has moved.
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          href="/home"
          className="font-body mt-8 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        >
          Back to Home
        </motion.a>
      </main>
      <Footer />
    </>
  )
}
