import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import ShopGrid from '@/components/ShopGrid'
import { getAllProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const products = await getAllProducts()

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
