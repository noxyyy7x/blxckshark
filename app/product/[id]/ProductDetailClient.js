'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import ProductCard from '@/components/ProductCard'
import SizeGuideModal from '@/components/SizeGuideModal'
import Accordion from '@/components/Accordion'
import { HeartIconOutline } from '@/components/Icons'
import { useCart } from '@/context/CartContext'
import { getRelatedProducts } from '@/lib/products'

const FREE_SHIPPING_THRESHOLD_GBP = 50

export default function ProductDetailClient({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedMessage, setAddedMessage] = useState(false)

  const { addItem } = useCart()
  const related = getRelatedProducts(product)

  function handleAddToCart() {
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size first.')
      return
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price.gbp,
      size: selectedSize,
      color: selectedColor,
      quantity,
      image: null,
    })
    setAddedMessage(true)
    setTimeout(() => setAddedMessage(false), 2000)
  }

  const accordionItems = [
    { title: 'Description', content: product.description },
    { title: 'Fabric', content: product.fabric },
    { title: 'Care Instructions', content: product.care },
  ]

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2 lg:gap-16">
          {/* Image gallery */}
          <div>
            <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="flex h-full w-full items-center justify-center text-xs text-white/20">
                Product image coming soon
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-6">
            <div>
              {!product.inStock && (
                <span className="mb-2 inline-block rounded bg-white/10 px-2 py-1 text-[11px] font-semibold tracking-wide text-white/60">
                  OUT OF STOCK
                </span>
              )}
              <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                {product.name}
              </h1>
              {product.fitTags.length > 0 && (
                <p className="font-body mt-1 text-sm text-white/40">{product.fitTags.join(' · ')}</p>
              )}
              <p className="font-body mt-3 text-2xl font-semibold">£{product.price.gbp.toFixed(2)}</p>
            </div>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div>
                <p className="font-body mb-2 text-xs font-semibold tracking-wide text-white/50">COLOR</p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`font-body rounded-md border px-4 py-2 text-xs transition-colors ${
                        selectedColor === color
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 text-white/70 hover:border-white/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-body text-xs font-semibold tracking-wide text-white/50">SIZE</p>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="font-body text-xs text-white/50 underline hover:text-white"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`font-body h-10 w-10 rounded-md border text-xs transition-colors ${
                        selectedSize === size
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 text-white/70 hover:border-white/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-md border border-white/20">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-body w-8 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="font-body flex-1 rounded-md bg-white py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {product.inStock ? (addedMessage ? 'Added ✓' : 'Add to Cart') : 'Out of Stock'}
              </button>

              <button
                onClick={() => setWishlisted((w) => !w)}
                aria-label="Add to wishlist"
                className="rounded-md border border-white/20 p-3 transition-colors hover:border-white/50"
              >
                <HeartIconOutline filled={wishlisted} className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping reminder */}
            <p className="font-body text-xs text-white/40">
              Free UK shipping on orders over £{FREE_SHIPPING_THRESHOLD_GBP}
            </p>

            {/* Description accordion */}
            <Accordion items={accordionItems} />
          </div>
        </div>

        {/* Reviews placeholder */}
        <section className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="font-display mb-4 text-xl font-bold uppercase tracking-tight">Reviews</h2>
          <p className="font-body text-sm text-white/40">
            No reviews yet — be the first to review this product once it&apos;s live.
          </p>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mx-auto max-w-7xl border-t border-white/10 px-6 py-14">
            <h2 className="font-display mb-6 text-xl font-bold uppercase tracking-tight">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  )
}
