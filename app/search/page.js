'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import ProductCard from '@/components/ProductCard'
import BrandLoader from '@/components/BrandLoader'
import { searchProducts } from '@/lib/products'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    searchProducts(query).then((data) => {
      setResults(data)
      setLoading(false)
    })
  }, [query])

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-display mb-2 text-2xl font-bold uppercase tracking-tight">
        Search Results
      </h1>
      <p className="font-body mb-8 text-sm text-white/50">
        {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
      </p>

      {!loading && results.length === 0 ? (
        <p className="font-body py-16 text-center text-sm text-white/40">
          No products found. Try a different search term.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <>
      <NotificationBar />
      <Header />
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <Suspense fallback={<BrandLoader />}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
