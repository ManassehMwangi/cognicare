import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type tParams = Promise<{ id: string }>

interface RouteProps {
  params: tParams
}

// GET /api/orders/[id] - Get single order
export async function GET(request: NextRequest, props: RouteProps) {
  try {
    const { id } = await props.params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              }
            }
          }
        },
        shippingAddress: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}