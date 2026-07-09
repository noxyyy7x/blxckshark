import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

export const metadata = {
  title: 'Support',
  description: 'Get in touch with the BLXCKSHARK team — live chat, email support, shipping info, and returns.',
}

export default function ContactPage() {
  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-xl px-6 py-16 text-center">
          <h1 className="font-display mb-4 text-3xl font-bold uppercase tracking-tight">
            Support
          </h1>
          <p className="font-body mb-10 text-sm text-white/50">
            Got a question about an order, sizing, or anything else? We're happy to help.
          </p>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <p className="font-body mb-2 text-sm font-semibold">Live Chat</p>
              <p className="font-body mb-4 text-sm text-white/50">
                The fastest way to reach us — click the chat icon in the bottom corner of any page.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
              <p className="font-body mb-2 text-sm font-semibold">Email</p>
              <a
                href="mailto:support@blxckshark.com"
                className="font-body text-sm text-white/70 underline hover:text-white"
              >
                support@blxckshark.com
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
            <a href="/faqs" className="font-body text-white/50 underline hover:text-white">FAQs</a>
            <a href="/shipping" className="font-body text-white/50 underline hover:text-white">Shipping Info</a>
            <a href="/returns" className="font-body text-white/50 underline hover:text-white">Returns & Exchanges</a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
