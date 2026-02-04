'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart-store'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'

export function CartButton() {
  const { data: session } = useSession()
  const { cart, openCart, fetchCart, getTotalItems } = useCartStore()

  useEffect(() => {
    if (session?.user && !cart) {
      fetchCart()
    }
  }, [session, cart, fetchCart])

  const totalItems = getTotalItems()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={openCart}
      className="relative"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
      <span className="sr-only">
        Shopping cart with {totalItems} items
      </span>
    </Button>
  )
}