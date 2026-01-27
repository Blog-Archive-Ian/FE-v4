import {
  useEditUserInfo,
  useEditUserProfileImage,
  useUserInfo,
} from '@/shared/query-hook/user.query'
import { isValidUrlOrEmpty } from '@/shared/utils/format'
import { uploadImage } from '@/shared/utils/upload-image'
import type { EditUserBody } from '@blog/contracts'
import { Button, Input, Label, Separator } from '@blog/ui'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'

export function EditUserPage() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState<EditUserBody>({
    name: '',
    intro: '',
    instagramId: '',
    githubId: '',
    personalUrl: '',
  })
  const [error, setError] = useState<string>('')

  const { data: user, isLoading } = useUserInfo()
  const { mutateAsync: editInfo, isPending: isSavingInfo } = useEditUserInfo({
    onError: (e) => setError(e.message),
  })
  const { mutateAsync: editProfile, isPending: isSavingProfile } = useEditUserProfileImage({
    onError: (e) => setError(e.message),
  })

  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name ?? '',
      intro: user.intro ?? '',
      instagramId: user.instagramId ?? '',
      githubId: user.githubId ?? '',
      personalUrl: user.personalUrl ?? '',
    })
  }, [user])

  const canSave = useMemo(() => {
    if (!form.name.trim()) return false
    if (!form.intro.trim()) return false
    if (!form.instagramId.trim()) return false
    if (!form.githubId.trim()) return false
    if (!isValidUrlOrEmpty(form.personalUrl.trim())) return false
    return true
  }, [form])

  const onClickEditPhoto = () => {
    setError('')
    fileRef.current?.click()
  }

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    try {
      setError('')
      const url = await uploadImage(file, 'thumbnail')
      await editProfile({ profileImage: url })
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드 실패')
    }
  }

  const onSave = async () => {
    setError('')

    if (!canSave) {
      setError('입력값을 확인해주세요. (URL 포함)')
      return
    }

    await editInfo({
      name: form.name.trim(),
      intro: form.intro.trim(),
      instagramId: form.instagramId.trim(),
      githubId: form.githubId.trim(),
      personalUrl: form.personalUrl.trim(),
    })

    navigate({ to: '/user/info' })
  }

  if (isLoading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  if (!user) return <div className="p-6 text-sm text-destructive">No user.</div>

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Public profile</h1>
          <p className="text-sm text-muted-foreground">프로필 정보 수정</p>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col-reverse gap-10 lg:flex-row">
        <main className="flex-1 space-y-7">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="intro">Bio</Label>
            <Input
              id="intro"
              value={form.intro}
              onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))}
              placeholder="Introduce yourself"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="githubId">GitHub</Label>
            <Input
              id="githubId"
              value={form.githubId}
              onChange={(e) => setForm((p) => ({ ...p, githubId: e.target.value }))}
              placeholder="github id"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instagramId">Instagram</Label>
            <Input
              id="instagramId"
              value={form.instagramId}
              onChange={(e) => setForm((p) => ({ ...p, instagramId: e.target.value }))}
              placeholder="instagram id"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="personalUrl">URL</Label>
            <Input
              id="personalUrl"
              value={form.personalUrl}
              onChange={(e) => setForm((p) => ({ ...p, personalUrl: e.target.value }))}
              placeholder="https://example.com"
            />
            <p className="text-xs text-muted-foreground">
              URL은 <span className="font-medium">https://</span> 포함해서 넣어주세요.
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <div className="min-h-5" />
          )}

          <div className="pt-2 ">
            <Button
              type="button"
              size="lg"
              className="w-full md:w-40"
              onClick={onSave}
              disabled={!canSave || isSavingInfo}
            >
              {isSavingInfo ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </main>

        <aside className="flex flex-col gap-3 lg:w-90">
          <p className="text-xs font-medium text-muted-foreground">Profile picture</p>

          <div className="mx-auto size-56 overflow-hidden rounded-full border bg-muted">
            <img src={user.profileImage} alt="profile" className="h-full w-full object-cover" />
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
          />

          <Button
            type="button"
            variant="outline"
            className="mx-auto"
            onClick={onClickEditPhoto}
            disabled={isSavingProfile}
          >
            {isSavingProfile ? 'Uploading...' : 'Edit'}
          </Button>
        </aside>
      </div>
    </div>
  )
}
