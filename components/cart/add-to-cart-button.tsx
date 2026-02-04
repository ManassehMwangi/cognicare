'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart-store'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface AddToCartButtonProps {
  productId: string
  stock: number
  price: number
  className?: string
}

export function AddToCartButton({ 
  productId, 
  stock, 
  price, 
  className 
}: AddToCartButtonProps) {
  const { data: session } = useSession()
  const { addToCart, openCart, isLoading } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!session?.user) {
      toast.error('Please sign in to add items to cart')
      return
    }

    setIsAdding(true)
    try {
      await addToCart(productId, quantity)
      toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`)
      openCart()
    } catch (error) {
      toast.error('Failed to add item to cart')
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity)
    }
  }

  if (stock === 0) {
    return (
      <div className={className}>
        <Button disabled className="w-full">
          Out of Stock
        </Button>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className={className}>
        <Button asChild className="w-full">
          <Link href="/auth/signin">
            Sign In to Purchase
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="quantity" className="text-sm font-medium">
            Quantity:
          </Label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <Input
              id="quantity"
              type="number"
              min="1"
              max={stock}
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (!isNaN(value)) {
                  handleQuantityChange(value)
                }
              }}
              className="h-8 w-16 text-center"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= stock}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {stock} available
        </div>
      </div>

      <div className="flex items-center gap-2 text-lg font-semibold">
        <span>Total: ${(price * quantity).toFixed(2)}</span>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isAdding || isLoading}
        className="w-full"
        size="lg"
      >
        {isAdding ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Adding to Cart...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>

      {stock <= 5 && (
        <p className="text-sm text-orange-600">
          Only {stock} left in stock - order soon!
        </p>
      )}
    </div>
  )
}