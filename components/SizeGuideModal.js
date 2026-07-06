'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function SizeGuideModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/70"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 z-[100] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#111] p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Size Guide</h3>
              <button onClick={onClose} aria-label="Close" className="text-xl leading-none">✕</button>
            </div>
            <p className="font-body text-sm text-white/60">
              Full size charts are coming soon once measurements are finalized for each product line.
              In the meantime, reach out via live chat and we&apos;ll help you find the right fit.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
