'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Custom dot + trailing ring cursor — desktop only, and only on
// customer-facing pages. Admin and the athlete signup subdomain keep the
// normal precise native cursor, since staff doing fast functional work
// don't benefit from a decorative lagging cursor.
export default function CustomCursor() {
  const pathname = usePathname()
  const excluded = pathname.startsWith('/admin') || pathname.startsWith('/athlete-signup')

  const [isDesktop, setIsDesktop] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { damping: 25, stiffness: 300, mass: 0.5 })
  const ringY = useSpring(dotY, { damping: 25, stiffness: 300, mass: 0.5 })

  useEffect(() => {
    if (excluded) {
      document.body.classList.remove('custom-cursor-active')
      return
    }

    const isFineMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setIsDesktop(isFineMouse)
    if (!isFineMouse) return

    document.body.classList.add('custom-cursor-active')

    function handleMove(e) {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    function handleOver(e) {
      const interactive = e.target.closest('a, button, input, select, textarea, [role="button"]')
      setHovering(!!interactive)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [excluded, dotX, dotY, visible])

  if (excluded || !isDesktop) return null

  return (
    <>
      {/* Dot — sits exactly at the cursor, no lag */}
      <motion.div
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />
      {/* Ring — trails slightly behind, grows on hover */}
      <motion.div
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        animate={{ scale: hovering ? 1.8 : 1 }}
        transition={{ scale: { duration: 0.2 } }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50"
      />
    </>
  )
}
