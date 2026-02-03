'use client'

import { ProductCard } from '@/components/products/product-card'
import { Product, Category, Review } from '@prisma/client'

type ProductWithRelations = Product & {
    category: Category
    reviews?: Review[]
}

interface LatestProductsProps {
    products: ProductWithRelations[]
}

export function LatestProducts({ products }: LatestProductsProps) {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Latest Study Materials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}