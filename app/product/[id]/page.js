import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'

export default function ProductPage({ params }) {
  const product = getProductById(params.id)
  if (!product) notFound()

  return <ProductDetailClient product={product} />
}
