'use client'

import Link from 'next/link'

import { ToggleButton } from '@/shared/ui/molecules/toggle-button'

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 border-b border-border bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-medium text-sm hover:opacity-80 transition">
          Archive | Ian&apos;s Tech Blog
        </Link>

        <ToggleButton />
      </div>
    </header>
  )
}
