import { getUserInfo } from '@/shared/api/user.api'
import { Button, cn, Separator } from '@blog/ui'
import { Code2, Github, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const Footer = async () => {
  const user = await getUserInfo()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30 mt-10">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="relative size-9 overflow-hidden rounded-md">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={`${user.name} profile`}
                    fill
                    className="object-cover"
                    priority
                    sizes="36px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    {user.name?.[0] ?? 'I'}
                  </div>
                )}
              </div>
              <p className="text-base font-semibold leading-none">Ian's Tech Blog</p>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/">메인</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/post-list">글 목록</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/about">About</Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" aria-label="GitHub">
              <a href="https://github.com/minijae011030" target="_blank" rel="noreferrer">
                <Github className="size-5" />
              </a>
            </Button>

            <Button asChild variant="ghost" size="icon" aria-label="Email">
              <a href="mailto:minijae011030@gmail.com">
                <Mail className="size-5" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Portfolio">
              <a href="https://portfolio.minjae-dev.com" target="_blank" rel="noreferrer">
                <Code2 className="size-5" />
              </a>
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {year} <span className="text-foreground">Ian’s Tech Blog. All rights reserved.</span>
          </p>

          <div className="flex items-center gap-3">
            <span className="inline-block size-2 rounded-full bg-point" />
            <a
              className={cn('underline-offset-4 hover:underline')}
              href="https://github.com/Blog-Archive-Ian"
              target="_blank"
              rel="noreferrer"
            >
              Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
