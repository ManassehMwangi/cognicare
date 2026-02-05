'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { checkoutSchema, CheckoutFormData } from '@/lib/validations/checkout'
import { CustomerForm } from '@/components/checkout/customer-form'
import { PaymentForm } from '@/components/checkout/payment-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

export function CheckoutClient() {
  const router = useRouter()
  const { cart, clearCart, getTotalPrice, getTotalItems } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'info' | 'payment'>('info')

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerInfo: {
        firstName: '',
        lastName: '',
        email: '',
      },
      paymentMethod: 'card',
    },
  })

  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + tax

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleCustomerInfoSubmit = async (data: CheckoutFormData) => {
    // Validate customer info step
    const isValid = await form.trigger(['customerInfo'])
    if (isValid) {
      setCurrentStep('payment')
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsProcessing(true)
    try {
      const formData = form.getValues()
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cart.items,
          formData,
          paymentIntentId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order')
      }

      // Clear cart and redirect to success page
      clearCart()
      toast.success('Order placed successfully!')
      router.push(`/checkout/success?orderId=${result.orderId}`)
    } catch (error) {
      console.error('Order creation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create order')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentError = (error: string) => {
    toast.error(error)
    setIsProcessing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center space-x-4 mb-6">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === 'info' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className={currentStep === 'info' ? 'font-medium' : 'text-muted-foreground'}>
                Customer Info
              </span>
              <div className="flex-1 h-px bg-border" />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className={currentStep === 'payment' ? 'font-medium' : 'text-muted-foreground'}>
                Payment
              </span>
            </div>

            {currentStep === 'info' ? (
              <form onSubmit={form.handleSubmit(handleCustomerInfoSubmit)} className="space-y-6">
                <CustomerForm form={form} />
                <Button type="submit" className="w-full" size="lg">
                  Continue to Payment
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('info')}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Customer Info
                </Button>
                
                <PaymentForm
                  amount={finalTotal}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  isProcessing={isProcessing}
                />
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary ({totalItems} items)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                        <Image
                          src={item.product.images[0] || '/placeholder.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-2">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>• Digital products will be delivered to your email</p>
                  <p>• No shipping required for ebooks</p>
                  <p>• Secure payment processing by Stripe</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}