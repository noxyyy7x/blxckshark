'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getCategoryPreviews } from '@/lib/products'

const CATEGORIES = [
  { key: 'Men', tagline: 'Engineered for performance' },
  { key: 'Women', tagline: 'Move without limits' },
  { key: 'Accessories', tagline: 'Finish the fit' },
]

export default function CategoryShowcase() {
  const [previews, setPreviews] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategoryPreviews().then((data) => {
      setPreviews(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {CATEGORIES.map((cat, i) => {
        const product = previews[cat.key]
        const image = product?.images?.[0]

        return (
          <motion.a
            key={cat.key}
            href={`/shop/${cat.key.toLowerCase()}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group flex flex-col gap-3"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent transition-transform group-hover:scale-[1.02]">
              {!loading && image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={cat.key} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-white/20">
                  {loading ? '' : 'Coming soon'}
                </div>
              )}
            </div>
            <div className="text-left">
              <p className="font-body text-sm font-semibold">{cat.key}</p>
              <p className="font-body text-xs text-white/50">{cat.tagline}</p>
            </div>
          </motion.a>
        )
      })}
    </div>
  )
}
