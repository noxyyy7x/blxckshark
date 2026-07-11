'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useCart } from '@/context/CartContext'
import EmptyState from '@/components/EmptyState'

const FREE_SHIPPING_THRESHOLD_GBP = 50

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_GBP - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_GBP) * 100)

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="font-display mb-8 text-3xl font-bold uppercase tracking-tight">
            Your Cart
          </h1>

          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty."
              subtitle="Built for more starts with something to build with."
              ctaLabel="Continue Shopping"
              ctaHref="/shop"
            />
          ) : (
            <>
              {/* Free shipping progress */}
              <div className="mb-8 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                {remaining > 0 ? (
                  <p className="font-body mb-2 text-xs text-white/60">
                    Add £{remaining.toFixed(2)} more for free UK shipping
                  </p>
                ) : (
                  <p className="font-body mb-2 text-xs text-white/80">
                    You&apos;ve unlocked free UK shipping 🎉
                  </p>
                )}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Line items */}
              <div className="divide-y divide-white/10 border-y border-white/10">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4 py-4">
                    <div className="h-20 w-16 flex-shrink-0 rounded border border-white/10 bg-white/[0.03]" />
                    <div className="flex-1">
                      <p className="font-body text-sm font-medium">{item.name}</p>
                      <p className="font-body text-xs text-white/40">
                        {[item.color, item.size].filter(Boolean).join(' · ')}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="font-body mt-1 text-xs text-white/40 underline hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center rounded-md border border-white/20">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="px-2 py-1 text-sm"
                      >
                        −
                      </button>
                      <span className="font-body w-6 text-center text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="px-2 py-1 text-sm"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-body w-16 text-right text-sm">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Subtotal + checkout */}
              <div className="mt-6 flex items-center justify-between">
                <p className="font-body text-sm text-white/60">Subtotal</p>
                <p className="font-body text-lg font-semibold">£{subtotal.toFixed(2)}</p>
              </div>
              <a
                href="/checkout"
                className="font-body mt-4 block w-full rounded-md bg-white py-3 text-center text-sm font-semibold text-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
              >
                Proceed to Checkout
              </a>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
