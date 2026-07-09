import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import ChatWidgetGate from '@/components/ChatWidgetGate'
import CookieConsent from '@/components/CookieConsent'
import AnalyticsGate from '@/components/AnalyticsGate'

export const metadata = {
  title: 'BLXCKSHARK — Opening Soon',
  description: 'Premium performance apparel. Built for more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body bg-background text-white antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <ChatWidgetGate />
            <CookieConsent />
            <AnalyticsGate />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
