import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

export default function CookiesPage() {
  return (
    <>
      <NotificationBar />
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-tight">Cookie Policy</h1>
          <p className="font-body mb-10 text-xs text-white/40">Last updated: July 2026</p>

          <div className="flex flex-col gap-8 font-body text-sm leading-relaxed text-white/60">
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">What Are Cookies</h2>
              <p>
                Cookies are small files stored on your device that help websites function properly and
                remember your preferences.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">How We Use Them</h2>
              <p>
                We use essential cookies to keep you logged in and remember your cart. With your consent,
                we also use Google Analytics to understand how visitors use our site, helping us improve it.
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-base font-semibold text-white">Your Choice</h2>
              <p>
                You can accept or reject non-essential cookies at any time via the banner shown when you
                first visit. Essential cookies required for the site to function (like staying logged in)
                cannot be disabled.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
