'use client'

import { motion } from 'framer-motion'

// TODO: pull from admin panel (Supabase "products" table, filtered by is_featured=true)
// Placeholder items for now so the layout/pipeline can be reviewed before real products exist.
const featuredProducts = [
  { id: 1, name: 'Product Name', price: '£30.00', image: null },
  { id: 2, name: 'Product Name', price: '£35.00', image: null },
  { id: 3, name: 'Product Name', price: '£28.00', image: null },
  { id: 4, name: 'Product Name', price: '£42.00', image: null },
]

export default function FeaturedSection() {
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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featuredProducts.map((p, i) => (
            <motion.a
              key={p.id}
              href={`/product/${p.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex flex-col gap-3"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-transform group-hover:scale-[1.02]">
                <div className="flex h-full w-full items-center justify-center text-xs text-white/20">
                  Image coming soon
                </div>
              </div>
              <div>
                <p className="font-body text-sm font-medium">{p.name}</p>
                <p className="font-body text-sm text-white/50">{p.price}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <a href="/shop" className="font-body mt-8 block text-center text-sm text-white/60 hover:text-white sm:hidden">
          View all →
        </a>
      </div>
    </section>
  )
}
