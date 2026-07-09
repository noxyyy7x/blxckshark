import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

export const metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <>
      <NotificationBar />
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight">Privacy Policy</h1>
          <p className="font-body mb-10 text-xs text-white/40">Last updated: July 2026</p>

          <div className="flex flex-col gap-8 font-body text-sm leading-relaxed text-white/60">
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">What We Collect</h2>
              <p>
                When you create an account, place an order, or contact us, we collect information such as
                your name, email address, shipping address, and order history. We use Google Analytics to
                understand site traffic and improve the shopping experience.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">How We Use It</h2>
              <p>
                Your information is used to process orders, manage your account, loyalty rewards, and
                referrals, communicate with you about your orders, and improve our site and products. We
                never sell your personal data to third parties.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">Payment Information</h2>
              <p>
                Payments are processed securely through Revolut. We do not store your full card details on
                our servers.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">Your Rights</h2>
              <p>
                You can access, update, or request deletion of your personal data at any time by contacting
                us at support@blxckshark.com.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">Contact</h2>
              <p>Questions about this policy? Reach us at support@blxckshark.com.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
