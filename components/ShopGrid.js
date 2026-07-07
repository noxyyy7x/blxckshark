'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { FIT_TAGS } from '@/lib/categories'
import { SIZE_SETS } from '@/lib/productSizes'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

export default function ShopGrid({ products, title }) {
  const [fitFilter, setFitFilter] = useState('')
  const [sizeFilter, setSizeFilter] = useState('')
  const [sort, setSort] = useState('newest')

  const filtered = useMemo(() => {
    let result = [...products]

    if (fitFilter) {
      result = result.filter((p) => p.fit_tags?.includes(fitFilter))
    }
    if (sizeFilter) {
      result = result.filter((p) => p.variants?.some((v) => v.size === sizeFilter))
    }
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price_gbp - b.price_gbp)
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price_gbp - a.price_gbp)
    }

    return result
  }, [products, fitFilter, sizeFilter, sort])

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display mb-8 text-3xl font-bold uppercase tracking-tight sm:text-4xl"
      >
        {title}
      </motion.h1>

      <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-white/10 pb-6">
        <select
          value={fitFilter}
          onChange={(e) => setFitFilter(e.target.value)}
          className="font-body rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs outline-none"
        >
          <option value="">All Fits</option>
          {FIT_TAGS.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="font-body rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs outline-none"
        >
          <option value="">All Sizes</option>
          {SIZE_SETS.apparel.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="font-body ml-auto rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="font-body py-20 text-center text-sm text-white/40">
          No products match those filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
