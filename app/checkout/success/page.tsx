import { Suspense } from 'react'
import SuccessClient from './success-client'

export const dynamic = 'force-dynamic'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Suspense fallback={<SuccessLoading />}>
        <SuccessClient />
      </Suspense>
    </div>
  )
}

function SuccessLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
        <p>Loading order details...</p>
      </div>
    </div>
  )
}