import { Suspense } from 'react'
import ErrorClient from './error-client'

export const dynamic = 'force-dynamic'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Suspense fallback={<ErrorLoading />}>
          <ErrorClient />
        </Suspense>
      </div>
    </div>
  )
}

function ErrorLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}