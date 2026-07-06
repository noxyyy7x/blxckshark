'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import MobileMenu from './MobileMenu'
import { useCart } from '@/context/CartContext'

const categories = ['Men', 'Women', 'Accessories']

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { itemCount } = useCart()

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Mobile: hamburger + search */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <button onClick={() => setSearchOpen((v) => !v)} aria-label="Search">
            <SearchIcon />
          </button>
        </div>

        {/* Desktop: left nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/shop/${cat.toLowerCase()}`}
              className="font-body text-sm font-medium tracking-wide text-white/80 transition-colors hover:text-white"
            >
              {cat}
            </a>
          ))}
        </nav>

        {/* Centre logo */}
        <a href="/home" className="absolute left-1/2 -translate-x-1/2">
          <img src="/wordmark.svg" alt="BLXCKSHARK" className="h-6 sm:h-7" />
        </a>

        {/* Desktop: right icons */}
        <div className="hidden items-center gap-6 md:flex">
          <button onClick={() => setSearchOpen((v) => !v)} aria-label="Search">
            <SearchIcon />
          </button>
          <a href="/wishlist" aria-label="Wishlist">
            <HeartIcon />
          </a>
          <a href="/cart" aria-label="Cart" className="relative">
            <CartIcon />
            {itemCount > 0 && <CartBadge count={itemCount} />}
          </a>
          <a href="/account" aria-label="Account">
            <UserIcon />
          </a>
        </div>

        {/* Mobile: right icons */}
        <div className="flex items-center gap-4 md:hidden">
          <a href="/messages" aria-label="Messages">
            <MessageIcon />
          </a>
          <a href="/account" aria-label="Account">
            <UserIcon />
          </a>
          <a href="/cart" aria-label="Cart" className="relative">
            <CartIcon />
            {itemCount > 0 && <CartBadge count={itemCount} />}
          </a>
        </div>
      </div>

      {/* Expandable search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10"
          >
            <form onSubmit={handleSearchSubmit} className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="font-body w-full border-b border-white/20 bg-transparent py-2 text-sm outline-none placeholder:text-white/40"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}

function CartBadge({ count }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
      {count > 9 ? '9+' : count}
    </span>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  )
}
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2.4 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c3.6 0 5.5 3.4 4 6.7C19.5 16.4 12 21 12 21Z" />
    </svg>
  )
}
function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  )
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  )
}
function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
    </svg>
  )
}
