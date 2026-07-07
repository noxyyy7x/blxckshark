import { notFound } from 'next/navigation'
import { getProductById, getRelatedProducts } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }) {
  const product = await getProductById(params.id)
  if (!product) notFound()

  const related = await getRelatedProducts(product)

  return <ProductDetailClient product={product} related={related} />
}
