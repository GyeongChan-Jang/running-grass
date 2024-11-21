import { useToast } from './use-toast'

export function useQueryError() {
  const { toast } = useToast()

  const handleError = {
    onFailure: (error: Error) => {
      if (error.message.includes('401')) {
        toast({
          title: '인증이 필요합니다',
          description: '다시 로그인해 주세요',
          variant: 'destructive'
        })
        window.location.href = '/login'
      } else {
        toast({
          title: '오류가 발생했습니다',
          description: error.message,
          variant: 'destructive'
        })
      }
    }
  }

  return handleError
}
