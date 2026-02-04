'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormData } from '@/lib/validations/checkout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CustomerFormProps {
  form: UseFormReturn<CheckoutFormData>
}

export function CustomerForm({ form }: CustomerFormProps) {
  const { register, formState: { errors } } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register('customerInfo.firstName')}
              className={errors.customerInfo?.firstName ? 'border-red-500' : ''}
            />
            {errors.customerInfo?.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.customerInfo.firstName.message}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register('customerInfo.lastName')}
              className={errors.customerInfo?.lastName ? 'border-red-500' : ''}
            />
            {errors.customerInfo?.lastName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.customerInfo.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register('customerInfo.email')}
            className={errors.customerInfo?.email ? 'border-red-500' : ''}
          />
          {errors.customerInfo?.email && (
            <p className="text-sm text-red-500 mt-1">
              {errors.customerInfo.email.message}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Your ebooks will be delivered to this email address
          </p>
        </div>
      </CardContent>
    </Card>
  )
}