import { Link2, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { getUserInfo } from '@/entities/user/user.api'

export const MobileUserInfo = async () => {
  const user = await getUserInfo()

  return (
    <section className="p-10 border-b border-border">
      <div className="flex items-center gap-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
          {user.profileImage && (
            <Image
              src={user.profileImage}
              alt={`${user.name} profile`}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-col">
            <span className="text-base font-semibold">{user.name}</span>
            <span className="text-sm text-muted-foreground truncate">{user.intro}</span>
          </div>

          <div className="flex items-center gap-2 text-sm min-w-0">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{user.email}</span>
          </div>

          <div className="flex items-center gap-2 text-sm min-w-0">
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
                className="truncate transition-colors hover:text-primary"
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
