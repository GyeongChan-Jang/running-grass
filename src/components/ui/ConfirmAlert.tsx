import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { ReactNode } from 'react'

interface ConfirmAlertProps {
  title: string
  description: string
  trigger: ReactNode
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
}

export function ConfirmAlert({
  title,
  description,
  trigger,
  onConfirm,
  confirmText = '확인',
  cancelText = '취소'
}: ConfirmAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="w-[90%] rounded-lg md:w-[400px]">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-lg font-semibold text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm text-gray-500">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center gap-2">
          <AlertDialogCancel className="mt-0 w-24">{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="w-24 bg-slate-700 text-white hover:bg-slate-600">
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
