import { notFound } from 'next/navigation'
import { getProductById, getRelatedProducts } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id)
  if (!product) return {}

  return {
    title: product.name,
    description: product.description || `${product.name} — premium performance apparel from BLXCKSHARK.`,
    openGraph: {
      title: product.name,
      description: product.description || `${product.name} — premium performance apparel from BLXCKSHARK.`,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  }
}

export default async function ProductPage({ params }) {
  const product = await getProductById(params.id)
  if (!product) notFound()

  const related = await getRelatedProducts(product)

  return <ProductDetailClient product={product} related={related} />
}
