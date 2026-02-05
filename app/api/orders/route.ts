import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkoutSchema } from '@/lib/validations/checkout'
import { auth } from '@/auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// GET /api/orders - Fetch user orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}


// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { cartItems, formData, paymentIntentId } = body

    // Validate form data
    const validatedData = checkoutSchema.parse(formData)

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Verify payment intent with Stripe
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent required' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Calculate total and verify with payment amount
    let calculatedTotal = 0
    const orderItems = []

    for (const item of cartItems) {
      // Fetch current product data to ensure price and stock are up to date
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json({ 
          error: `Product ${item.productId} not found` 
        }, { status: 404 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}` 
        }, { status: 400 })
      }

      const itemTotal = product.price * item.quantity
      calculatedTotal += itemTotal

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })
    }

    // Add tax (8%)
    const tax = calculatedTotal * 0.08
    const totalWithTax = calculatedTotal + tax

    // Verify payment amount matches (convert to cents for Stripe)
    const expectedAmount = Math.round(totalWithTax * 100)
    if (paymentIntent.amount !== expectedAmount) {
      return NextResponse.json({ 
        error: 'Payment amount mismatch' 
      }, { status: 400 })
    }

    // Create a simple address record for digital products (no shipping needed)
    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        street: 'Digital Delivery',
        city: 'N/A',
        state: 'N/A',
        postalCode: '00000',
        country: 'US',
        isDefault: false,
      }
    })

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: 'PENDING', // Set to completed for digital products
        total: totalWithTax,
        stripePaymentId: paymentIntentId,
        addressId: address.id,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        shippingAddress: true
      }
    })

    // Update product stock (even for digital products to track sales)
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      order 
    })

  } catch (error) {
    console.error('Error creating order:', error)
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: error.message 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}