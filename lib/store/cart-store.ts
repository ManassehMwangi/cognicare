import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    images: string[]
    stock: number
  }
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

interface CartStore {
  cart: Cart | null
  isLoading: boolean
  isOpen: boolean
  
  // Actions
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Computed values
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isOpen: false,

      fetchCart: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/cart')
          if (response.ok) {
            const cart = await response.json()
            set({ cart, isLoading: false })
          } else {
            console.error('Failed to fetch cart')
            set({ isLoading: false })
          }
        } catch (error) {
          console.error('Error fetching cart:', error)
          set({ isLoading: false })
        }
      },

      addToCart: async (productId: string, quantity = 1) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
          })

          if (response.ok) {
            const cart = await response.json()
            set({ cart, isLoading: false })
          } else {
            const error = await response.json()
            console.error('Failed to add to cart:', error.error)
            set({ isLoading: false })
            throw new Error(error.error)
          }
        } catch (error) {
          console.error('Error adding to cart:', error)
          set({ isLoading: false })
          throw error
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        set({ isLoading: true })
        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
          })

          if (response.ok) {
            const cart = await response.json()
            set({ cart, isLoading: false })
          } else {
            const error = await response.json()
            console.error('Failed to update quantity:', error.error)
            set({ isLoading: false })
            throw new Error(error.error)
          }
        } catch (error) {
          console.error('Error updating quantity:', error)
          set({ isLoading: false })
          throw error
        }
      },

      removeFromCart: async (itemId: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            const cart = await response.json()
            set({ cart, isLoading: false })
          } else {
            const error = await response.json()
            console.error('Failed to remove from cart:', error.error)
            set({ isLoading: false })
            throw new Error(error.error)
          }
        } catch (error) {
          console.error('Error removing from cart:', error)
          set({ isLoading: false })
          throw error
        }
      },

      clearCart: () => {
        set({ cart: null })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      getTotalItems: () => {
        const { cart } = get()
        if (!cart) return 0
        return cart.items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        const { cart } = get()
        if (!cart) return 0
        return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
)