import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import ProductDetailClient from './product-detail-client'


type PageProps = {
    params: Promise<{ id: string }>
}

async function getProduct(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        })

        if (!product) {
            return null
        }

        return product
    } catch (error) {
        console.error('Error fetching product:', error)
        return null
    }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
    try {
        return await prisma.product.findMany({
            where: {
                categoryId,
                id: { not: currentProductId },
            },
            include: {
                category: true,
            },
            take: 4,
            orderBy: {
                createdAt: 'desc',
            },
        })
    } catch (error) {
        console.error('Error fetching related products:', error)
        return []
    }
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params

    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

    return (
        <Suspense fallback={<div className="py-16 text-center">Loading product details...</div>}>
            <ProductDetailClient
                product={product}
                relatedProducts={relatedProducts}
            />
        </Suspense>
    )
}