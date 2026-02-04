import { Suspense } from 'react'
import SignUpClient from './signup-client'

export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/auth/signin" className="font-medium text-primary hover:text-primary/80">
              sign in to your existing account
            </a>
          </p>
        </div>
        <Suspense fallback={<SignUpLoading />}>
          <SignUpClient />
        </Suspense>
      </div>
    </div>
  )
}

function SignUpLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}