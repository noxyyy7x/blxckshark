import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

export default function ShippingPage() {
  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display mb-8 text-3xl font-bold uppercase tracking-tight">
            Shipping Info
          </h1>

          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-body mb-2 text-sm font-semibold">🇬🇧 United Kingdom</h2>
              <p className="font-body text-sm text-white/60">
                Tracked shipping via Evri. Free on orders over £50, otherwise a flat rate applies at checkout.
                You&apos;ll receive a tracking number by email and in your account once dispatched.
              </p>
            </div>

            <div>
              <h2 className="font-body mb-2 text-sm font-semibold">🇺🇸 United States</h2>
              <p className="font-body text-sm text-white/60">
                Untracked international shipping. Free on orders over $85, otherwise a flat rate applies.
                Delivery typically takes longer than UK shipping — exact timing shown at checkout.
              </p>
            </div>

            <div>
              <h2 className="font-body mb-2 text-sm font-semibold">🇪🇺 European Union</h2>
              <p className="font-body text-sm text-white/60">
                Untracked international shipping. Free on orders over €75, otherwise a flat rate applies.
              </p>
            </div>

            <div>
              <h2 className="font-body mb-2 text-sm font-semibold">Customs & Duties</h2>
              <p className="font-body text-sm text-white/60">
                International orders may be subject to import duties or taxes charged by your country&apos;s
                customs authority. These charges are the responsibility of the customer and are not included
                in our shipping fees.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
