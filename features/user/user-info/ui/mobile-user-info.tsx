import { Link2, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { getUserInfo } from '@/entities/user/user.api'

export const MobileUserInfo = async () => {
  const user = await getUserInfo()

  return (
    <section className="border-b border-border p-10  mx-auto">
      <div className="flex items-center gap-10">
        {/* Profile Image */}
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full">
          {user.profileImage && (
            <Image
              src={user.profileImage}
              alt={`${user.name} profile`}
              fill
              className="object-cover"
              priority
              sizes="20"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-col gap-2">
          {/* Name / Intro */}
          <div className="flex flex-col">
            <span className="text-base font-semibold">{user.name}</span>
            <span className="truncate text-sm text-muted-foreground">{user.intro}</span>
          </div>

          {/* Email */}
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{user.email}</span>
          </div>

          {/* GitHub */}
          {user.githubId && (
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <Image
                src="/icon/github.png"
                alt="GitHub"
                className="block dark:hidden"
                width={15}
                height={15}
              />
              <Image
                src="/icon/github-white.png"
                alt="GitHub"
                className="hidden dark:block"
                width={15}
                height={15}
              />
              <Link
                href={`https://github.com/${user.githubId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate transition-colors"
              >
                {user.githubId}
              </Link>
            </div>
          )}

          {/* Personal URL */}
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <Link2 className="size-4 shrink-0 text-muted-foreground" />
            {user.personalUrl ? (
              <Link
                href={
                  user.personalUrl.startsWith('http')
                    ? user.personalUrl
                    : `https://${user.personalUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="truncate transition-colors"
              >
                {user.personalUrl.replace(/^https?:\/\//, '').split('/')[0]}
              </Link>
            ) : (
              <span className="text-muted-foreground">등록된 링크가 없습니다</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
