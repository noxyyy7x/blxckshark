import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'

export default function NotFound() {
  return (
    <>
      <NotificationBar />
      <Header />
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
        <p className="font-display text-8xl font-bold text-white/10">404</p>
        <h1 className="font-display -mt-4 text-2xl font-bold uppercase tracking-tight">
          Nothing to see here
        </h1>
        <p className="font-body mt-3 max-w-sm text-sm text-white/50">
          The page you&apos;re looking for doesn&apos;t exist, or has moved.
        </p>
        <a
          href="/home"
          className="font-body mt-8 inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-black"
        >
          Back to Home
        </a>
      </main>
      <Footer />
    </>
  )
}
