import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import ShopGrid from '@/components/ShopGrid'
import { getProductsByCategory } from '@/lib/products'
import { GENDERS } from '@/lib/categories'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const categoryParam = params?.category
  const matchedCategory = GENDERS.find((c) => c.toLowerCase() === categoryParam?.toLowerCase())
  if (!matchedCategory) return {}

  return {
    title: matchedCategory,
    description: `Shop ${matchedCategory}'s performance apparel at BLXCKSHARK — engineered for those who push limits.`,
  }
}

export default async function CategoryPage({ params }) {
  const categoryParam = params?.category
  if (!categoryParam) notFound()

  const matchedCategory = GENDERS.find(
    (c) => c.toLowerCase() === categoryParam.toLowerCase()
  )

  if (!matchedCategory) notFound()

  const products = await getProductsByCategory(matchedCategory)

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
