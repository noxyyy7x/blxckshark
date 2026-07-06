'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { REGIONS } from '@/lib/shipping'
import { validateDiscountCode } from '@/lib/discountCodes'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [region, setRegion] = useState('UK')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState({ name: '', line1: '', city: '', postcode: '' })
  const [discountInput, setDiscountInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [discountError, setDiscountError] = useState('')
  const [wantsAccount, setWantsAccount] = useState(true)
  const [processing, setProcessing] = useState(false)

  const regionConfig = REGIONS[region]
  const freeShipping = subtotal >= regionConfig.freeShippingThreshold
  const shippingCost = freeShipping ? 0 : regionConfig.flatRate

  const discountAmount = appliedDiscount
    ? appliedDiscount.type === 'reward'
      ? Math.min(appliedDiscount.amountOff, subtotal)
      : (subtotal * appliedDiscount.percentOff) / 100
    : 0
  const total = Math.max(0, subtotal - discountAmount + shippingCost)

  async function handleApplyDiscount(e) {
    e.preventDefault()
    if (!discountInput.trim()) return
    const result = await validateDiscountCode(discountInput, user?.id)
    if (result.valid) {
      setAppliedDiscount(result)
      setDiscountError('')
    } else if (result.selfReferral) {
      setAppliedDiscount(null)
      setDiscountError("You can't use your own referral code.")
    } else if (result.alreadyRedeemed) {
      setAppliedDiscount(null)
      setDiscountError('This reward code has already been used.')
    } else {
      setAppliedDiscount(null)
      setDiscountError('Invalid or expired code.')
    }
  }

  async function handlePayNow(e) {
    e.preventDefault()
    if (!email || !address.name || !address.line1 || !address.city || !address.postcode) {
      alert('Please fill in all contact and shipping fields.')
      return
    }

    setProcessing(true)

    // MOCK PAYMENT — TODO: replace with real embedded Revolut Checkout.js.
    // On real integration: create a Revolut order via API, mount the
    // Checkout.js widget here, and only proceed to confirmation once the
    // webhook confirms payment success (not directly from the client).

    // Credit referrer commission first (independent of order creation)
    if (appliedDiscount?.referrerId) {
      try {
        await fetch('/api/credit-referral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referralCode: appliedDiscount.code,
            orderAmount: subtotal,
            referredEmail: email,
            buyerId: user?.id || null,
          }),
        })
      } catch {
        // Non-blocking
      }
    }

    // MOCK PAYMENT — TODO: replace with real embedded Revolut Checkout.js.
    // On real integration: create the Revolut order, mount Checkout.js, and
    // only call /api/complete-order once the Revolut webhook confirms
    // payment success server-side (not directly from the client like this).
    try {
      const res = await fetch('/api/complete-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items,
          subtotal,
          discountAmount,
          shippingCost,
          total,
          discountCode: appliedDiscount?.code || null,
          region,
          shippingAddress: address,
          buyerId: user?.id || null,
        }),
      })
      const data = await res.json()
      clearCart()
      router.push(`/order-confirmation/${data.orderRef || 'unknown'}`)
    } catch (err) {
      alert('Something went wrong placing your order. Please try again.')
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <NotificationBar />
        <Header />
        <main className="min-h-screen bg-[#0a0a0a] text-white">
          <div className="mx-auto max-w-xl px-6 py-24 text-center">
            <p className="font-body mb-4 text-sm text-white/50">Your cart is empty.</p>
            <a href="/shop" className="font-body inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-black">
              Continue Shopping
            </a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1.3fr_1fr]">
          {/* Left: form */}
          <form onSubmit={handlePayNow} className="flex flex-col gap-8">
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Checkout</h1>

            {/* Region selector */}
            <div>
              <label className="font-body mb-2 block text-xs font-semibold tracking-wide text-white/50">
                SHIPPING REGION
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none"
              >
                {Object.entries(REGIONS).map(([key, r]) => (
                  <option key={key} value={key}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Contact */}
            <div>
              <h2 className="font-body mb-3 text-sm font-semibold">Contact</h2>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
              />
            </div>

            {/* Shipping address */}
            <div>
              <h2 className="font-body mb-3 text-sm font-semibold">Shipping Address</h2>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                />
                <input
                  type="text"
                  required
                  placeholder="Address line 1"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Postcode"
                    value={address.postcode}
                    onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                    className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
                  />
                </div>
              </div>
            </div>

            {/* Shipping method */}
            <div>
              <h2 className="font-body mb-3 text-sm font-semibold">Shipping Method</h2>
              <div className="flex items-center justify-between rounded-md border border-white/15 bg-white/5 px-4 py-3">
                <span className="font-body text-sm">
                  {region === 'UK' ? 'Evri Tracked' : 'International Standard'}
                </span>
                <span className="font-body text-sm">
                  {freeShipping ? 'FREE' : `${regionConfig.symbol}${shippingCost.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Discount code */}
            <div>
              <h2 className="font-body mb-3 text-sm font-semibold">Discount Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  disabled={!!appliedDiscount}
                  className="font-body flex-1 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm uppercase outline-none placeholder:text-white/40 placeholder:normal-case disabled:opacity-50"
                />
                {appliedDiscount ? (
                  <button
                    type="button"
                    onClick={() => { setAppliedDiscount(null); setDiscountInput(''); setDiscountError('') }}
                    className="font-body rounded-md border border-white/20 px-4 py-3 text-sm"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="font-body rounded-md bg-white px-4 py-3 text-sm font-semibold text-black"
                  >
                    Apply
                  </button>
                )}
              </div>
              {discountError && <p className="font-body mt-2 text-xs text-red-400">{discountError}</p>}
              {appliedDiscount && (
                <p className="font-body mt-2 text-xs text-white/60">
                  &quot;{appliedDiscount.code}&quot; applied — {appliedDiscount.type === 'reward' ? `£${appliedDiscount.amountOff.toFixed(2)} off` : `${appliedDiscount.percentOff}% off`}
                </p>
              )}
            </div>

            {/* Guest signup incentive */}
            <label className="flex items-start gap-3 rounded-md border border-white/15 bg-white/5 px-4 py-3">
              <input
                type="checkbox"
                checked={wantsAccount}
                onChange={(e) => setWantsAccount(e.target.checked)}
                className="mt-1"
              />
              <span className="font-body text-sm text-white/70">
                Create an account to earn <strong className="text-white">150 XP</strong> and track this order.
              </span>
            </label>

            <button
              type="submit"
              disabled={processing}
              className="font-body rounded-md bg-white py-4 text-sm font-semibold text-black transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
            >
              {processing ? 'Processing...' : `Pay ${regionConfig.symbol}${total.toFixed(2)}`}
            </button>

            <p className="font-body text-center text-[11px] text-white/30">
              Mock payment — real Revolut Checkout will replace this button.
            </p>
          </form>

          {/* Right: order summary */}
          <div className="h-fit rounded-lg border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-display mb-4 text-lg font-bold uppercase tracking-tight">Order Summary</h2>
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                  <span className="font-body text-white/70">
                    {item.name} {item.size && `(${item.size})`} × {item.quantity}
                  </span>
                  <span className="font-body">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 py-4 text-sm">
              <div className="flex justify-between">
                <span className="font-body text-white/60">Subtotal</span>
                <span className="font-body">£{subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-white/60">
                  <span className="font-body">
                    Discount {appliedDiscount.type === 'reward' ? '' : `(${appliedDiscount.percentOff}%)`}
                  </span>
                  <span className="font-body">−£{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-body text-white/60">Shipping</span>
                <span className="font-body">
                  {freeShipping ? 'FREE' : `${regionConfig.symbol}${shippingCost.toFixed(2)}`}
                </span>
              </div>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-4 text-base font-semibold">
              <span className="font-body">Total</span>
              <span className="font-body">{regionConfig.symbol}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
