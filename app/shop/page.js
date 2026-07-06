import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import ShopGrid from '@/components/ShopGrid'
import { getAllProducts } from '@/lib/products'

export default function ShopPage() {
  const products = getAllProducts()

  return (
    <>
      <NotificationBar />
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <ShopGrid products={products} title="All Products" />
      </main>
      <Footer />
    </>
  )
}
