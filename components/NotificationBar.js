'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'

const DEFAULT_MESSAGE = 'FREE SHIPPING ON UK ORDERS OVER £50'

export default function NotificationBar() {
  const [visible, setVisible] = useState(true)
  const [message, setMessage] = useState(DEFAULT_MESSAGE)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'notification_bar')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setMessage(data.value)
      })
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full overflow-hidden bg-white text-black"
        >
          <div className="flex items-center justify-center px-8 py-2 text-center">
            <p className="font-body text-[11px] font-semibold tracking-wider sm:text-xs">
              {message}
            </p>
            <button
              onClick={() => setVisible(false)}
              aria-label="Dismiss notification"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
