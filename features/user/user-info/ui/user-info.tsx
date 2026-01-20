import { Link2, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { getUserInfo } from '@/entities/user/user.api'

export const UserInfo = async () => {
  const user = await getUserInfo()

  return (
    <section className="flex w-62.5 flex-col items-start justify-center mx-auto">
      {/* Profile Image */}
      <div className="relative mb-7.5 flex w-full justify-center">
        <div className="relative size-62.5 overflow-hidden rounded-full">
          {user.profileImage && (
            <Image
              src={user.profileImage}
              alt={`${user.name} profile`}
              fill
              className="object-cover"
              priority
              sizes="62.5"
            />
          )}
        </div>
      </div>

      {/* Name & Intro */}
      <div className="w-full mb-5 flex flex-col items-start gap-1 text-left">
        <p className="text-lg font-bold">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.intro}</p>
      </div>

      {/* Email */}
      <div className="flex w-62.5 items-center py-2.5 gap-1">
        <Mail className="mr-2.5 size-3.5 text-muted-foreground" />
        <p className="text-sm">{user.email}</p>
      </div>

      <div className="my-1 h-px w-62.5 bg-border" />

      {/* Social Info */}
      <div className="flex w-62.5 flex-col gap-2 py-2.5">
        {/* GitHub */}
        {user.githubId && (
          <div className="flex items-center gap-3">
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
              className="text-sm transition-colors"
            >
              {user.githubId}
            </Link>
          </div>
        )}

        {/* Instagram */}
        {user.instagramId && (
          <div className="flex items-center gap-3">
            <Image src="/icon/instagram.webp" alt="Instagram" width={15} height={15} />
            <Link
              href={`https://instagram.com/${user.instagramId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors"
            >
              {user.instagramId}
            </Link>
          </div>
        )}
      </div>

      <div className="my-1 h-px w-62.5 bg-border" />

      {/* Personal URL */}
      <div className="flex w-62.5 items-center py-2.5">
        <Link2 className="mr-2.5 size-3.5 shrink-0 text-muted-foreground" />

        {user.personalUrl ? (
          <Link
            href={
              user.personalUrl.startsWith('http') ? user.personalUrl : `https://${user.personalUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors"
          >
            {user.personalUrl.replace(/^https?:\/\//, '').split('/')[0]}
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">등록된 링크가 없습니다</p>
        )}
      </div>
    </section>
  )
}
