'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'blxckshark_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const cartIconRef = useRef(null)
  const [flyingItem, setFlyingItem] = useState(null)

  // Load cart from localStorage on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true)
  }, [])

  // Persist cart on every change (after initial load)
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, loaded])

  function addItem({ productId, name, price, size, color, quantity = 1, image }) {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === productId && i.size === size && i.color === color
      )
      if (existingIndex > -1) {
        const next = [...prev]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        }
        return next
      }
      return [...prev, { productId, name, price, size, color, quantity, image }]
    })
  }

  function removeItem(productId, size, color) {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size && i.color === color)))
  }

  function updateQuantity(productId, size, color, quantity) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity: Math.max(1, quantity) }
          : i
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  // Kicks off the fly-to-cart animation — needs the image URL and the DOM
  // element it should visually fly FROM (the cart icon target is read from
  // cartIconRef, registered by Header on mount).
  function triggerFly(imageUrl, fromElement) {
    if (!imageUrl || !fromElement || !cartIconRef.current) return
    const fromRect = fromElement.getBoundingClientRect()
    const toRect = cartIconRef.current.getBoundingClientRect()
    setFlyingItem({
      id: Date.now(),
      imageUrl,
      from: { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 },
      to: { x: toRect.left + toRect.width / 2, y: toRect.top + toRect.height / 2 },
    })
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount,
        cartIconRef, flyingItem, setFlyingItem, triggerFly,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
