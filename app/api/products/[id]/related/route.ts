import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // First get the product to find its category
    const product = await prisma.product.findUnique({
      where: { id },
      select: { categoryId: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: id }, // Exclude the current product
      },
      include: {
        category: true,
      },
      take: 8, // Get up to 8 related products
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(relatedProducts)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related products' },
      { status: 500 }
    )
  }
}