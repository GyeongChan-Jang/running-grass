'use client'

import { Button } from '@/components/ui/button'
import { ErrorBoundary } from 'react-error-boundary'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { logout } from '@/app/auth'

function ProfileErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  // 에러 메시지에서 줄바꿈 처리
  const errorMessages = error.message.split('\n')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-semibold text-foreground">데이터를 불러올 수 없습니다</h2>
          <div className="text-muted-foreground text-center space-y-1">
            {errorMessages.map((message, index) => (
              <p className="whitespace-nowrap" key={index}>
                {message}
              </p>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              className="bg-background text-foreground hover:bg-accent border border-border"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <Button
              onClick={logout}
              variant="default"
              className="bg-[#FC4C02] hover:bg-[#E34402] text-white border-[#FC4C02] 
                dark:bg-[#FC4C02] dark:hover:bg-[#E34402] dark:text-white dark:border-[#FC4C02]"
            >
              다시 로그인하기
            </Button>
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
