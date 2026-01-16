'use client'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export default function ToggleButton() {
  const { setTheme } = useTheme()

  return (
    <div className="flex gap-3">
      <Button onClick={() => setTheme('light')}>라이트</Button>
      <Button onClick={() => setTheme('dark')}>다크</Button>
      <Button onClick={() => setTheme('system')}>시스템</Button>
    </div>
  )
}
