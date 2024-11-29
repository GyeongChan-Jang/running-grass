'use client'

import { ProfileErrorBoundary } from '@/components/errors/ProfileErrorBoundary'
import ProfilePage from '@/components/pages/profile/ProfilePage'

export default function ProfileContent() {
  return (
    <ProfileErrorBoundary>
      <ProfilePage />
    </ProfileErrorBoundary>
  )
}
