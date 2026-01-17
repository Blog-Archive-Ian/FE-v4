import Image from 'next/image'

import { getUserInfo } from '@/entities/user/user.api'

export const UserInfo = async () => {
  const user = await getUserInfo()

  return (
    <section className="flex items-center gap-4">
      <Image
        src={user.profileImage}
        alt={`${user.name} profile`}
        className="h-12 w-12 rounded-full object-cover"
        width={48}
        height={48}
      />

      <div className="flex flex-col">
        <span className="text-sm font-semibold">{user.name}</span>
        <span className="text-xs text-muted-foreground">{user.email}</span>
        <span className="text-xs">{user.intro}</span>
      </div>
    </section>
  )
}
