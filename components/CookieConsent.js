'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'blxckshark_cookie_consent'

export default function CookieConsent() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  const hideOnThisPage = pathname.startsWith('/admin') || pathname.startsWith('/staff')

  useEffect(() => {
    if (hideOnThisPage) return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) setVisible(true)
  }, [hideOnThisPage])

  function handleChoice(choice) {
    localStorage.setItem(STORAGE_KEY, choice)
    setVisible(false)
  }

  if (hideOnThisPage) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0d0d0d]/95 backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 py-4 sm:flex-row sm:justify-between sm:gap-6">
            <p className="font-body text-center text-xs text-white/60 sm:text-left">
              We use cookies to improve your experience.{' '}
              <a href="/cookies" className="underline hover:text-white">Learn more</a>
            </p>
            <div className="flex w-full gap-3 sm:w-auto">
              <button
                onClick={() => handleChoice('rejected')}
                className="font-body flex-1 rounded-md border border-white/20 px-5 py-2 text-xs font-semibold text-white sm:flex-none"
              >
                Reject
              </button>
              <button
                onClick={() => handleChoice('accepted')}
                className="font-body flex-1 rounded-md bg-white px-5 py-2 text-xs font-semibold text-black sm:flex-none"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
