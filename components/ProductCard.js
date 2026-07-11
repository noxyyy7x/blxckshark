'use client'

import { motion } from 'framer-motion'
import { isInStock } from '@/lib/products'

export default function ProductCard({ product, index = 0 }) {
  const inStock = isInStock(product)
  const image = product.images?.[0]

  return (
    <motion.a
      href={`/product/${product.id}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-transform group-hover:scale-[1.02]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-white/[0.03] to-transparent">
            <img src="/logo-icon.svg" alt="" className="h-8 w-8 opacity-10" />
            <span className="font-body text-[10px] text-white/20">Image coming soon</span>
          </div>
        )}
        {!inStock && (
          <span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-1 text-[10px] font-semibold tracking-wide text-white/70">
            OUT OF STOCK
          </span>
        )}
      </div>
      <div>
        <p className="font-body text-sm font-medium">{product.name}</p>
        {product.fit_tags?.length > 0 && (
          <p className="font-body text-xs text-white/40">{product.fit_tags.join(' · ')}</p>
        )}
        <p className="font-body mt-1 text-sm text-white/70">£{Number(product.price_gbp).toFixed(2)}</p>
      </div>
    </motion.a>
  )
}
