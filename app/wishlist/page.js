'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import ProductCard from '@/components/ProductCard'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

export default function WishlistPage() {
  const { user, loading } = useAuth()
  const [products, setProducts] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function load() {
      const { data } = await supabase
        .from('wishlist_items')
        .select('product_id, products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setProducts((data || []).map((row) => row.products).filter(Boolean))
      setPageLoading(false)
    }
    load()
  }, [user])

  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="font-display mb-8 text-2xl font-bold uppercase tracking-tight">Wishlist</h1>

          {loading ? null : !user ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="font-body mb-4 text-sm text-white/60">Sign in to view your wishlist.</p>
              <a href="/login" className="font-body inline-block rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black">
                Sign In
              </a>
            </div>
          ) : pageLoading ? (
            <p className="font-body text-sm text-white/40">Loading...</p>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-body mb-4 text-sm text-white/40">Nothing saved yet.</p>
              <a href="/shop" className="font-body inline-block rounded-md bg-white px-6 py-3 text-sm font-semibold text-black">
                Explore Products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
