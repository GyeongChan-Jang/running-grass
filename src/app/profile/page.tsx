'use client'

import ProfileInfo from '@/components/ProfileInfo'
import ActivityGrid from '@/components/ActivityGrid'
import { useGetActivities } from '@/hooks/queries/useGetActivities'
import { useQueryError } from '@/hooks/useQueryError'

export default function ProfileContent() {
  const { onFailure } = useQueryError()
  const {
    data: activities,
    isLoading,
    isError
  } = useGetActivities({
    ...onFailure
  })

  if (isError) {
    return (
      <div className="container mx-auto max-w-[600px] px-4 py-8 space-y-8">
        <div className="text-center text-red-500">데이터를 불러오는데 실패했습니다.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-[600px] px-4 py-8 space-y-8">
      <ProfileInfo />
      <ActivityGrid activities={activities || []} isLoading={isLoading} />
    </div>
  )
}
