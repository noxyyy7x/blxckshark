import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import ChatWidgetGate from '@/components/ChatWidgetGate'
import CookieConsent from '@/components/CookieConsent'
import AnalyticsGate from '@/components/AnalyticsGate'

export const metadata = {
  title: {
    default: 'BLXCKSHARK — Opening Soon',
    template: '%s | BLXCKSHARK',
  },
  description: 'Premium performance apparel engineered for those who push limits. Built for more.',
  metadataBase: new URL('https://blxckshark.com'),
  openGraph: {
    siteName: 'BLXCKSHARK',
    type: 'website',
    images: ['/wordmark-email.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body bg-background text-white antialiased">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
              <ChatWidgetGate />
              <CookieConsent />
              <AnalyticsGate />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
