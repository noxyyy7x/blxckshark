import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import ChatWidget from '@/components/ChatWidget'

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
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
