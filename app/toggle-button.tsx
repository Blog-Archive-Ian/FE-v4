'use client'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export default function ToggleButton() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-3">
      <Button onClick={() => setTheme('light')}>라이트</Button>
      <Button onClick={() => setTheme('dark')}>다크</Button>
      <Button onClick={() => setTheme('system')}>시스템</Button>
    </div>
  )
}
