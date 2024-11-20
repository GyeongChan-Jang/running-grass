'use client'

import ActivityGrid from '@/components/ActivityGrid'
import ProfileInfo from '@/components/ProfileInfo'

export default function ProfilePage() {
  return (
    <div className="py-8">
      <ProfileInfo />
      <ActivityGrid />
    </div>
  )
}
