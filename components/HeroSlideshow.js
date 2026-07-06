'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// TODO: pull from admin panel (Supabase "site_content" table, key: hero_slides)
// so this can be updated without a code change. Placeholder data for now —
// swap `image` for real product photography once available.
const slides = [
  { id: 1, image: null, label: 'Slide 1 — add product photo' },
  { id: 2, image: null, label: 'Slide 2 — add product photo' },
  { id: 3, image: null, label: 'Slide 3 — add product photo' },
]

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center bg-white/[0.03]"
        >
          {slides[index].image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slides[index].image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-body px-6 text-center text-xs text-white/15">
              {slides[index].label}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay so hero text stays readable over any image */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
