'use client'

import { Button } from '@blog/ui'
import { ArrowDown } from 'lucide-react'
import { useEffect, useLayoutEffect, useState } from 'react'

interface Props {
  anchorSelector?: string
}

export const ScrollToBottomButton = ({ anchorSelector = '#post-article' }: Props) => {
  const [visible, setVisible] = useState(true)
  const [leftPx, setLeftPx] = useState<number | null>(null)

  // 스크롤 끝이면 숨김
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const isNearBottom = scrollTop + windowHeight >= docHeight - 80
      setVisible(!isNearBottom)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 본문 컨테이너 중심 좌표 계산
  useLayoutEffect(() => {
    const calc = () => {
      const el = document.querySelector(anchorSelector) as HTMLElement | null
      if (!el) {
        setLeftPx(null)
        return
      }
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      setLeftPx(centerX)
    }

    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [anchorSelector])

  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }

  if (!visible) return null

  return (
    <Button
      type="button"
      onClick={handleScrollToBottom}
      style={leftPx != null ? { left: `${leftPx}px`, transform: 'translateX(-50%)' } : undefined}
      className="fixed bottom-8 z-50 flex size-[60px] items-center justify-center rounded-full bg-background border border-border text-foreground shadow-lg backdrop-blur hover:bg-muted"
    >
      <ArrowDown className="size-5" />
    </Button>
  )
}
