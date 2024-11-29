'use client'

import { ErrorBoundary } from 'react-error-boundary'
import { AlertCircle } from 'lucide-react'

function ProfileErrorFallback({
  error
}: // resetErrorBoundary
{
  error: Error
  resetErrorBoundary: () => void
}) {
  // const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-semibold">데이터를 불러올 수 없습니다</h2>
          <p className="text-muted-foreground text-center">{error.message}</p>
          <div className="flex gap-4 justify-center">
            {/* 잠시 후 다시 시도해주세요 🥲 */}
            <h3>잠시 후 다시 시도해주세요 🥲</h3>
            {/* <Button onClick={resetErrorBoundary} variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <Button onClick={() => router.push('/')} variant="default">
              메인으로 돌아가기
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfileErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ProfileErrorFallback}
      onReset={() => {
        window.location.reload()
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
