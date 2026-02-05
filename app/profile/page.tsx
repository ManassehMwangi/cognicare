import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Header } from '@/components/layout/header'
import { ProfileClient } from './profile-client'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/profile')
  }

  return (
    <>
      <Header />
      <ProfileClient user={session.user} />
    </>
  )
}