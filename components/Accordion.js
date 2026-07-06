'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, i) => (
        <div key={item.title}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="font-body flex w-full items-center justify-between py-4 text-left text-sm font-medium"
          >
            {item.title}
            <span className={`transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="font-body pb-4 text-sm text-white/60">{item.content}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
