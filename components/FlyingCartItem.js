'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

// Renders once globally — animates a cloned product thumbnail flying from
// wherever "Add to Cart" was clicked into the header's cart icon.
export default function FlyingCartItem() {
  const { flyingItem, setFlyingItem, cartIconRef } = useCart()

  return (
    <AnimatePresence onExitComplete={() => {
      // Small bounce on the cart icon when the item "lands"
      if (cartIconRef.current) {
        cartIconRef.current.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
          { duration: 320, easing: 'ease-out' }
        )
      }
    }}>
      {flyingItem && (
        <motion.img
          key={flyingItem.id}
          src={flyingItem.imageUrl}
          alt=""
          initial={{
            position: 'fixed',
            left: flyingItem.from.x,
            top: flyingItem.from.y,
            width: 64,
            height: 64,
            x: '-50%',
            y: '-50%',
            opacity: 1,
            scale: 1,
            borderRadius: 8,
          }}
          animate={{
            left: flyingItem.to.x,
            top: flyingItem.to.y,
            width: 20,
            height: 20,
            opacity: 0.4,
            scale: 0.6,
          }}
          transition={{ duration: 0.7, ease: [0.32, 0, 0.67, 0] }}
          onAnimationComplete={() => setFlyingItem(null)}
          className="pointer-events-none z-[9998] object-cover"
        />
      )}
    </AnimatePresence>
  )
}
