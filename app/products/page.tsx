import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import ProductsClient from './products-client'

export default function ProductsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="py-16 text-center">Loading products…</div>}>
        <ProductsClient />
      </Suspense>
    </>
  )
}