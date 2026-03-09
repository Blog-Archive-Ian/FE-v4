'use client'

import { usePostTitleContext } from '@/shared/providers/post-title-provider'
import { ToggleButton } from '@/shared/ui/molecules/toggle-button'
import { cn } from '@blog/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Header = () => {
  const pathname = usePathname()
  // 헤더에 표시할 현재 게시글 제목 상태
  const { currentPostTitle } = usePostTitleContext()

  const isPostDetailPage = pathname?.startsWith('/post/')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 border-b border-border bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-full max-w-487.5 items-center justify-between px-4 md:px-13">
        <div className="flex min-w-0 flex-1 items-center gap-1 mr-[5px]">
          <Link href="/" className="shrink-0 font-medium text-sm hover:opacity-80 transition">
            Archive
          </Link>

          {isPostDetailPage && currentPostTitle ? (
            <>
              <span className="text-sm text-muted-foreground">|</span>
              <span
                className="truncate text-xs mr-4 sm:text-sm text-muted-foreground"
                title={currentPostTitle}
              >
                {currentPostTitle}
              </span>
            </>
          ) : (
            <span className="truncate text-xs sm:text-sm text-muted-foreground">Tech Blog</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className={cn(
              'text-sm transition',
              pathname === '/about'
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            About
          </Link>

          <ToggleButton />
        </div>
      </div>
    </header>
  )
}
