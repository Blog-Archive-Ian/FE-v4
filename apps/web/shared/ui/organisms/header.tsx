'use client'

import { ToggleButton } from '@/shared/ui/molecules/toggle-button'
import Link from 'next/link'

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 border-b border-border bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-full max-w-487.5 items-center justify-between px-13">
        <Link href="/" className="font-medium text-sm hover:opacity-80 transition">
          Archive | Ian&apos;s Tech Blog
        </Link>

        <ToggleButton />
      </div>
    </header>
  )
}
