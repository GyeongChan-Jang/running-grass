import { AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'

export function ProfileError() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-semibold">프로필을 불러올 수 없습니다</h3>
        <p className="text-gray-600 text-center">잠시 후 다시 시도해 주세요</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          새로고침
        </Button>
      </div>
    </div>
  )
}
