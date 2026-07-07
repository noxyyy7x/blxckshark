'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { getFeaturedProducts } from '@/lib/products'

export default function FeaturedSection() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedProducts().then((data) => {
      setFeaturedProducts(data)
      setLoading(false)
    })
  }, [])

  if (!loading && featuredProducts.length === 0) return null

  return (
    <section className="border-t border-white/10 bg-[#0d0d0d] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-body text-xs font-semibold tracking-[0.3em] text-white/40"
            >
              HAND-PICKED
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl"
            >
              Featured
            </motion.h2>
          </div>
          <a href="/shop" className="font-body hidden text-sm text-white/60 hover:text-white sm:block">
            View all →
          </a>
        </div>

        {loading ? (
          <p className="font-body text-sm text-white/30">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featuredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        <a href="/shop" className="font-body mt-8 block text-center text-sm text-white/60 hover:text-white sm:hidden">
          View all →
        </a>
      </div>
    </section>
  )
}
