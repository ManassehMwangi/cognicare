import { z } from 'zod'

export const customerInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
})

export const checkoutSchema = z.object({
  customerInfo: customerInfoSchema,
  paymentMethod: z.enum(['card']).default('card'),
})

export type CustomerInfo = z.infer<typeof customerInfoSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>