import ProfileInfo from "../ProfileInfo";

import React from 'react'
import { useQueryError } from '@/hooks/useQueryError'
import { useGetStats } from '@/hooks/queries/useGetStats'
import { useUserStore } from '@/store/user'

import ActivityGrid from '@/components/ActivityGrid'

const ProfilePage = () => {

  const { onFailure } = useQueryError()
  const { user } = useUserStore()

  const { data: stats, isLoading: isStatsLoading } = useGetStats(user?.id, {
    ...onFailure
  })

  return (
    <div className="container mx-auto max-w-[600px] px-4 py-8 space-y-8">
        <ProfileInfo stats={stats} isStatsLoading={isStatsLoading} />
        <ActivityGrid
          totalDistance={stats?.all_run_totals.distance}
        />
      </div>
  )
}

export default ProfilePage