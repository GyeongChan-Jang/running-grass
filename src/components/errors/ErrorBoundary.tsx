'use client'

import { Component, ReactNode } from 'react'
import { Button } from '../ui/button'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      // 기본 fallback UI
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-semibold">문제가 발생했습니다</h2>
            <p className="text-gray-600">{this.state.error?.message}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              다시 시도
            </Button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
