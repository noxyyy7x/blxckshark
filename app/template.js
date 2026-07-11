'use client'

import { motion } from 'framer-motion'

// template.js re-mounts on every navigation (unlike layout.js), giving a
// clean, lightweight fade on each page change site-wide.
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
