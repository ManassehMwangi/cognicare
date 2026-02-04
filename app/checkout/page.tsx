import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { CheckoutClient } from './checkout-client'

export default async function CheckoutPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/checkout')
  }

  return <CheckoutClient />
}