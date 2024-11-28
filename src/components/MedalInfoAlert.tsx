import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface MedalInfo {
  label: string
  requirement: string
  description: string
}

const medalInfos: MedalInfo[] = [
  {
    label: '천상계',
    requirement: '10,000km 이상',
    description: '지구와 달 사이를 달리는 수준의 러너'
  },
  {
    label: '런마스터',
    requirement: '5,000km 이상',
    description: '한반도 종단을 여러 번 완주한 수준의 러너'
  },
  {
    label: '런고수',
    requirement: '3,000km ~ 5,000km',
    description: '울릉도에서 서울까지 왕복한 수준의 러너'
  },
  {
    label: '런중수',
    requirement: '1,000km ~ 3,000km',
    description: '서울에서 부산까지 왕복한 수준의 러너'
  },
  {
    label: '런초보',
    requirement: '500km ~ 1,000km',
    description: '서울에서 부산까지 달린 수준의 러너'
  },
  {
    label: '런린이',
    requirement: '1km ~ 500km',
    description: '러닝을 시작한 초보 러너'
  }
]

interface MedalInfoAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MedalInfoAlert({ open, onOpenChange }: MedalInfoAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <AlertDialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <AlertDialogTitle>🏃‍♂️ 러닝 등급 안내</AlertDialogTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDialogHeader>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className="overflow-y-auto flex-grow my-4 pr-2">
          <div className="grid grid-cols-2 gap-4">
            {medalInfos.map((info) => (
              <div key={info.label} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full 
                    border-[3px] ${getMedalStyle(info.label).border}
                    ${getMedalStyle(info.label).glow}
                    bg-white dark:bg-gray-800`}
                  />
                  <h3 className="font-bold text-foreground">{info.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground font-semibold">{info.requirement}</p>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </div>
            ))}
          </div>
        </div>

        <AlertDialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            닫기
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function getMedalStyle(label: string) {
  switch (label) {
    case '천상계':
      return {
        border: 'border-teal-300 dark:border-teal-300',
        glow: 'shadow-[0_0_20px_rgba(94,234,212,0.9)] dark:shadow-[0_0_20px_rgba(45,212,191,0.9)]'
      }
    case '런마스터':
      return {
        border: 'border-lime-400 dark:border-lime-400',
        glow: 'shadow-[0_0_20px_rgba(163,230,53,0.9)] dark:shadow-[0_0_20px_rgba(132,204,22,0.9)]'
      }
    case '런고수':
      return {
        border: 'border-yellow-200 dark:border-yellow-200',
        glow: 'shadow-[0_0_20px_rgba(250,204,21,0.9)] dark:shadow-[0_0_20px_rgba(234,179,8,0.9)]'
      }
    case '런중수':
      return {
        border: 'border-gray-300 dark:border-gray-500',
        glow: 'shadow-[0_0_20px_rgba(156,163,175,0.8)] dark:shadow-[0_0_20px_rgba(156,163,175,0.9)]'
      }
    case '런초보':
      return {
        border: 'border-stone-400 dark:border-stone-400',
        glow: 'shadow-[0_0_20px_rgba(168,162,158,0.9)] dark:shadow-[0_0_20px_rgba(120,113,108,0.9)]'
      }
    case '런린이':
      return {
        border: 'border-orange-400 dark:border-orange-400',
        glow: 'shadow-[0_0_20px_rgba(251,146,60,0.9)] dark:shadow-[0_0_20px_rgba(249,115,22,0.9)]'
      }
    default:
      return {
        border: 'border-purple-300 dark:border-purple-400',
        glow: 'shadow-[0_0_20px_rgba(216,180,254,0.8)] dark:shadow-[0_0_20px_rgba(192,132,252,0.9)]'
      }
  }
}
