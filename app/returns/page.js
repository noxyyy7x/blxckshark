import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

export default function ReturnsPage() {
  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display mb-8 text-3xl font-bold uppercase tracking-tight">
            Returns & Exchanges
          </h1>

          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-body mb-2 text-sm font-semibold">🇬🇧 UK Returns</h2>
              <p className="font-body text-sm text-white/60">
                You have 14 days from delivery to return an item for a refund or exchange. Items must be
                unworn, unwashed, and in their original condition with tags attached.
              </p>
            </div>

            <div>
              <h2 className="font-body mb-2 text-sm font-semibold">🌍 International Returns</h2>
              <p className="font-body text-sm text-white/60">
                International orders are also eligible for return, with the customer covering return postage
                costs. Contact us via live chat to start a return.
              </p>
            </div>

            <div>
              <h2 className="font-body mb-2 text-sm font-semibold">Size Exchanges</h2>
              <p className="font-body text-sm text-white/60">
                Need a different size? We offer exchanges rather than refund-only — get in touch via live
                chat and we&apos;ll sort the swap once your return is received.
              </p>
            </div>

            <div>
              <h2 className="font-body mb-2 text-sm font-semibold">How to Start a Return</h2>
              <p className="font-body text-sm text-white/60">
                Reach out via live chat or email support@blxckshark.com with your order number, and we&apos;ll
                guide you through the process.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
