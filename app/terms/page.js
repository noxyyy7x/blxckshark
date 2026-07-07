import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

export default function TermsPage() {
  return (
    <>
      <NotificationBar />
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight">Terms & Conditions</h1>
          <p className="font-body mb-10 text-xs text-white/40">Last updated: July 2026</p>

          <div className="flex flex-col gap-8 font-body text-sm leading-relaxed text-white/60">
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">Orders</h2>
              <p>
                By placing an order on blxckshark.com, you confirm the information provided is accurate.
                We reserve the right to refuse or cancel any order at our discretion.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">Pricing</h2>
              <p>
                Prices are shown in your local currency (GBP, USD, or EUR) and may change without notice.
                International orders may be subject to customs duties, which are the customer&apos;s
                responsibility.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">Loyalty Program</h2>
              <p>
                XP, tiers, rewards, and referral commissions are provided at our discretion and may be
                adjusted or discontinued at any time. Attempts to abuse or manipulate the referral or
                rewards system may result in account suspension.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">Returns</h2>
              <p>See our Returns & Exchanges page for full details on our returns policy.</p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">Changes</h2>
              <p>These terms may be updated periodically. Continued use of the site constitutes acceptance of any changes.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
