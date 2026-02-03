'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductSidebar } from '@/components/products/product-sidebar'
import { Product, Category } from '@prisma/client'

type ProductWithCategory = Product & {
  category: Category
}

export default function ProductsClient() {
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sort = searchParams.get('sort')
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          ...(category && { category }),
          ...(search && { search }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
          ...(sort && { sort }),
        })
        
        const response = await fetch(`/api/products?${queryParams}`)
        const data = await response.json()
        
        setProducts(data.products)
        setTotalPages(Math.ceil(data.total / data.perPage))
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [category, search, minPrice, maxPrice, sort, currentPage])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <ProductSidebar />
        </aside>
        <main className="flex-1">
          <ProductGrid
            products={products}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </div>
  )
}