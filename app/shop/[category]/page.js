import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import ShopGrid from '@/components/ShopGrid'
import { getProductsByCategory, CATEGORIES } from '@/lib/products'

export default function CategoryPage({ params }) {
  const categoryParam = params.category
  const matchedCategory = CATEGORIES.find(
    (c) => c.toLowerCase() === categoryParam.toLowerCase()
  )

  if (!matchedCategory) notFound()

  const products = getProductsByCategory(matchedCategory)

  return (
    <>
      <NotificationBar />
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <ShopGrid products={products} title={matchedCategory} />
      </main>
      <Footer />
    </>
  )
}
