'use client'



import { ProfileErrorBoundary } from '@/components/errors/ProfileErrorBoundary'
import ProfilePage from '@/components/profile/ProfilePage'

export default function ProfileContent() {
  

  return (
    <ProfileErrorBoundary>
      <ProfilePage />
    </ProfileErrorBoundary>
  )
}
