import { Button } from '@blog/ui'
import { useBlocker } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Alert } from './alert'

/**
 * 폼 화면에서 화면 이탈, 새로고침 시 경고 Alert
 *
 * @param isDirty - 폼이 변경된 사항이 있는지 여부
 * @example <UnsavedChangesGuard isDirty={isDirty} />
 * @returns alert
 */
export const UnsavedChangesGuard = ({ isDirty }: { isDirty: boolean }) => {
  const [open, setOpen] = useState(false)

  const blocker = useBlocker({
    shouldBlockFn: () => isDirty,
    withResolver: true,
    enableBeforeUnload: isDirty,
  })

  // 폼 이탈 방지
  useEffect(() => {
    if (blocker.status === 'blocked') setOpen(true)
  }, [blocker.status])

  return (
    <Alert
      title="페이지 이동"
      description="작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?"
      open={open}
      onChangeOpen={setOpen}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => {
              blocker?.reset?.()
              setOpen(false)
            }}
          >
            취소
          </Button>
          <Button
            className="bg-red-500 text-white"
            onClick={() => {
              blocker?.proceed?.()
              setOpen(false)
            }}
          >
            나가기
          </Button>
        </>
      }
    />
  )
}
