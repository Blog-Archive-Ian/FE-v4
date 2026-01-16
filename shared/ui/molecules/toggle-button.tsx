'use client'
import { useTheme } from 'next-themes'

import { Button } from '@/shared/ui/atoms/button'

export const ToggleButton = () => {
  const { setTheme } = useTheme()

  return (
    <div className="flex gap-3">
      <Button onClick={() => setTheme('light')}>라이트</Button>
      <Button onClick={() => setTheme('dark')}>다크</Button>
      <Button onClick={() => setTheme('system')}>시스템</Button>
    </div>
  )
}
