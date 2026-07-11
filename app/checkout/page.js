'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { REGIONS } from '@/lib/shipping'
import { validateDiscountCode } from '@/lib/discountCodes'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/context/ToastContext'
import EmptyState from '@/components/EmptyState'
import { MailIcon, LockIcon, BoxIcon, PercentIcon } from '@/components/Icons'
import { motion } from 'framer-motion'

const REVOLUT_MODE = process.env.NEXT_PUBLIC_REVOLUT_MODE || 'prod'

export default function CheckoutPage() {
  const showToast = useToast()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const widgetRef = useRef(null)
  const pendingOrderRefRef = useRef(null)

  const [region, setRegion] = useState('UK')
  const [regionAutoDetected, setRegionAutoDetected] = useState(false)

  useEffect(() => {
    fetch('/api/detect-region')
      .then((res) => res.json())
      .then((data) => {
        setRegion(data.region)
        setRegionAutoDetected(true)
      })
      .catch(() => {})
  }, [])

  const [email, setEmail] = useState('')
  const [address, setAddress] = useState({ name: '', line1: '', city: '', postcode: '' })
  const [discountInput, setDiscountInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [discountError, setDiscountError] = useState('')
  const [wantsAccount, setWantsAccount] = useState(true)
  const [guestPassword, setGuestPassword] = useState('')
  const [guestSignupError, setGuestSignupError] = useState('')
  const [paymentStarted, setPaymentStarted] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [widgetLoading, setWidgetLoading] = useState(false)

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

  function validateFields() {
    return email && address.name && address.line1 && address.city && address.postcode
  }

  async function handleContinueToPayment(e) {
    e.preventDefault()
    if (!validateFields()) {
      showToast('Please fill in all contact and shipping fields.', 'error')
      return
    }

    setGuestSignupError('')
    let effectiveBuyerId = user?.id || null
    let isGuestSignupBonus = false

    // If a guest wants an account, create it now — before payment — so the
    // order is directly linked to a real account from the start.
    if (!user && wantsAccount) {
      if (guestPassword.length < 6) {
        setGuestSignupError('Please choose a password (at least 6 characters) to create your account.')
        return
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: guestPassword,
      })

      if (signUpError) {
        setGuestSignupError(signUpError.message)
        return
      }

      effectiveBuyerId = signUpData.user?.id || null
      isGuestSignupBonus = true
    }

    setPaymentStarted(true)
    setPaymentError('')
    setWidgetLoading(true)

    const { default: RevolutCheckout } = await import('@revolut/checkout')

    try {
      await RevolutCheckout.embeddedCheckout({
        publicToken: process.env.NEXT_PUBLIC_REVOLUT_PUBLIC_KEY,
        mode: REVOLUT_MODE,
        locale: 'auto',
        target: widgetRef.current,
        email,
        createOrder: async () => {
          const res = await fetch('/api/create-payment-order', {
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
              referrerId: appliedDiscount?.referrerId || null,
              region,
              shippingAddress: address,
              buyerId: effectiveBuyerId,
              guestSignupBonus: isGuestSignupBonus,
            }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Could not start payment')
          pendingOrderRefRef.current = data.orderRef
          return { publicId: data.token }
        },
        onSuccess: () => {
          clearCart()
          router.push(`/order-confirmation/${pendingOrderRefRef.current}`)
        },
        onError: (payload) => {
          setPaymentError(payload?.error?.message || 'Payment failed. Please try again.')
        },
        onCancel: () => {
          // Let them try again without losing their form details
        },
      })
      setWidgetLoading(false)
    } catch (err) {
      setPaymentError(err.message)
      setWidgetLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <NotificationBar />
        <Header />
        <main className="min-h-screen bg-[#0a0a0a] text-white">
          <div className="mx-auto max-w-xl px-6 py-16">
            <EmptyState
              title="Your cart is empty."
              subtitle="Add something first to check out."
              ctaLabel="Continue Shopping"
              ctaHref="/shop"
            />
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
          <form onSubmit={handleContinueToPayment} className="flex flex-col gap-8">
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Checkout</h1>

            {/* Region selector */}
            <div>
              <label className="font-body mb-2 block text-xs font-semibold tracking-wide text-white/50">
                SHIPPING REGION
              </label>
              <select
                value={region}
                onChange={(e) => { setRegion(e.target.value); setRegionAutoDetected(false) }}
                disabled={paymentStarted}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none disabled:opacity-50"
              >
                {Object.entries(REGIONS).map(([key, r]) => (
                  <option key={key} value={key}>{r.label}</option>
                ))}
              </select>
              {regionAutoDetected && (
                <p className="font-body mt-1 text-xs text-white/30">Auto-detected based on your location</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <h2 className="font-body mb-3 flex items-center gap-2 text-sm font-semibold">
                <MailIcon className="h-4 w-4 text-white/40" />
                Contact
              </h2>
              <input
                type="email"
                required
                disabled={paymentStarted}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40 disabled:opacity-50"
              />
            </div>

            {/* Shipping address */}
            <div>
              <h2 className="font-body mb-3 text-sm font-semibold">Shipping Address</h2>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  required
                  disabled={paymentStarted}
                  placeholder="Full name"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40 disabled:opacity-50"
                />
                <input
                  type="text"
                  required
                  disabled={paymentStarted}
                  placeholder="Address line 1"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40 disabled:opacity-50"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    disabled={paymentStarted}
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40 disabled:opacity-50"
                  />
                  <input
                    type="text"
                    required
                    disabled={paymentStarted}
                    placeholder="Postcode"
                    value={address.postcode}
                    onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                    className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Shipping method */}
            <div>
              <h2 className="font-body mb-3 flex items-center gap-2 text-sm font-semibold">
                <BoxIcon className="h-4 w-4 text-white/40" />
                Shipping Method
              </h2>
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
              <h2 className="font-body mb-3 flex items-center gap-2 text-sm font-semibold">
                <PercentIcon className="h-4 w-4 text-white/40" />
                Discount Code
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  disabled={!!appliedDiscount || paymentStarted}
                  className="font-body flex-1 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm uppercase outline-none placeholder:text-white/40 placeholder:normal-case disabled:opacity-50"
                />
                {appliedDiscount ? (
                  <button
                    type="button"
                    disabled={paymentStarted}
                    onClick={() => { setAppliedDiscount(null); setDiscountInput(''); setDiscountError('') }}
                    className="font-body rounded-md border border-white/20 px-4 py-3 text-sm disabled:opacity-50"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={paymentStarted}
                    onClick={handleApplyDiscount}
                    className="font-body rounded-md bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
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

            {!user && (
              <div>
                <label className="flex items-start gap-3 rounded-md border border-white/15 bg-white/5 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={wantsAccount}
                    onChange={(e) => setWantsAccount(e.target.checked)}
                    disabled={paymentStarted}
                    className="mt-1"
                  />
                  <span className="font-body text-sm text-white/70">
                    Create an account to earn <strong className="text-white">150 XP</strong> and track this order.
                  </span>
                </label>
                {wantsAccount && (
                  <div className="mt-3">
                    <input
                      type="password"
                      placeholder="Choose a password"
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
                      disabled={paymentStarted}
                      className="font-body w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/40 focus:border-white/40 disabled:opacity-50"
                    />
                    {guestSignupError && (
                      <p className="font-body mt-2 text-xs text-red-400">{guestSignupError}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {!paymentStarted ? (
              <div>
                <button
                  type="submit"
                  className="font-body w-full rounded-md bg-white py-4 text-sm font-semibold text-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
                >
                  Continue to Payment
                </button>
                <p className="font-body mt-3 flex items-center justify-center gap-1.5 text-xs text-white/30">
                  <LockIcon className="h-3.5 w-3.5" />
                  Secure checkout — your payment details never touch our servers
                </p>
              </div>
            ) : (
              <div>
                <p className="font-body mb-3 text-sm font-semibold">
                  Pay {regionConfig.symbol}{total.toFixed(2)}
                </p>
                {widgetLoading && (
                  <p className="font-body mb-2 text-xs text-white/40">Loading payment form...</p>
                )}
                {paymentError && (
                  <p className="font-body mb-2 text-xs text-red-400">{paymentError}</p>
                )}
                {/* Revolut's embedded card/wallet payment form mounts here */}
                <div ref={widgetRef} />
              </div>
            )}
          </form>

          {/* Right: order summary */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="h-fit rounded-lg border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="font-display mb-4 text-lg font-bold uppercase tracking-tight">Order Summary</h2>
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="h-12 w-12 flex-shrink-0 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-white/5">
                      <img src="/logo-icon.svg" alt="" className="h-4 w-4 opacity-20" />
                    </div>
                  )}
                  <div className="flex flex-1 items-center justify-between text-sm">
                    <span className="font-body text-white/70">
                      {item.name} {item.size && `(${item.size})`} × {item.quantity}
                    </span>
                    <span className="font-body">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
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
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  )
}
