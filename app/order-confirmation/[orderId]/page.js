import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

export default function OrderConfirmationPage({ params }) {
  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <div className="mb-6 text-4xl">🦈</div>
          <h1 className="font-display mb-3 text-3xl font-bold uppercase tracking-tight">
            Order Confirmed
          </h1>
          <p className="font-body mb-1 text-sm text-white/60">
            Thank you — your order is on its way to being built for more.
          </p>
          <p className="font-body mb-8 text-xs text-white/40">
            Order reference: <span className="text-white/70">{params.orderId}</span>
          </p>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-left">
            <p className="font-body text-sm text-white/60">
              A confirmation email is on its way. You can track this order and view your rewards
              from your account once you&apos;re signed in.
            </p>
          </div>

          <a
            href="/shop"
            className="font-body mt-8 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-black"
          >
            Continue Shopping
          </a>
        </div>
      </main>

      <Footer />
    </>
  )
}
