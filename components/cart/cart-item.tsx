'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore, CartItem as CartItemType } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartStore()
  const [isUpdating, setIsUpdating] = useState(false)
  const [quantity, setQuantity] = useState(item.quantity)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return
    
    setIsUpdating(true)
    try {
      await updateQuantity(item.id, newQuantity)
      setQuantity(newQuantity)
      toast.success('Cart updated')
    } catch (error) {
      toast.error('Failed to update cart')
      console.error('Error updating quantity:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await removeFromCart(item.id)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
      console.error('Error removing item:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleInputChange = (value: string) => {
    const newQuantity = parseInt(value)
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= item.product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleInputBlur = () => {
    if (quantity !== item.quantity) {
      handleQuantityChange(quantity)
    }
  }

  const itemTotal = item.product.price * item.quantity

  return (
    <div className="flex gap-4 py-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
        <Image
          src={item.product.images[0] || '/placeholder.jpg'}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              href={`/products/${item.product.id}`}
              className="text-sm font-medium hover:underline line-clamp-2"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              ${item.product.price.toFixed(2)} each
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isUpdating}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isUpdating || quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <Input
              type="number"
              min="1"
              max={item.product.stock}
              value={quantity}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleInputBlur}
              disabled={isUpdating}
              className="h-8 w-16 text-center"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isUpdating || quantity >= item.product.stock}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-sm font-medium">
            ${itemTotal.toFixed(2)}
          </div>
        </div>

        {item.product.stock <= 5 && (
          <p className="text-xs text-orange-600">
            Only {item.product.stock} left in stock
          </p>
        )}
      </div>
    </div>
  )
}