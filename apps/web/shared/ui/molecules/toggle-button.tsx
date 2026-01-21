'use client'

import { Button } from '@blog/ui'
import { Moon, RefreshCcw, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const ToggleButton = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleToggle = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const renderIcon = () => {
    if (theme === 'light') return <Sun className="h-5 w-5" />
    if (theme === 'dark') return <Moon className="h-5 w-5" />
    return <RefreshCcw className="h-5 w-5" />
  }

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleToggle}
      className="rounded-full"
      aria-label="Toggle Theme"
    >
      {renderIcon()}
    </Button>
  )
}
