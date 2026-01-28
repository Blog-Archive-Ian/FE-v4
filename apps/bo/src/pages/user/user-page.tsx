import { Field } from '@/shared/components/molecules/field'
import { useUserInfo } from '@/shared/query-hook/user.query'
import { Button, Separator } from '@blog/ui'
import { Link } from '@tanstack/react-router'

export const UserPage = () => {
  const { data: user, isLoading, isError } = useUserInfo()

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  if (isError || !user) return <div className="p-6 text-sm text-destructive">Failed to load.</div>

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Public profile</h1>
          <p className="text-sm text-muted-foreground">프로필 정보 확인</p>
        </div>

        <Button asChild variant="outline">
          <Link to="/user/edit">Edit profile</Link>
        </Button>
      </div>
      <Separator className="my-8" />
      <div className="flex flex-col-reverse gap-10 lg:flex-row">
        {/* Left: info */}
        <main className="flex-1 space-y-7">
          <Field label="Name" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Bio" value={user.intro} />
          <Field label="GitHub" value={user.githubId} />
          <Field label="Instagram" value={user.instagramId} />
          <Field label="URL" value={user.personalUrl} />
        </main>

        {/* Right: profile picture */}
        <aside className="flex flex-col gap-3 lg:w-90">
          <p className="text-xs font-medium text-muted-foreground">Profile picture</p>
          <div className="mx-auto size-56 overflow-hidden rounded-full border bg-muted">
            <img src={user.profileImage} alt="profile" className="h-full w-full object-cover" />
          </div>
        </aside>
      </div>
    </div>
  )
}
