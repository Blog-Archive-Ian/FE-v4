import { UnsavedChangesGuard } from '@/shared/components/molecules/unsaved-changes-guard'
import {
  useEditUserInfo,
  useEditUserProfileImage,
  useUserInfo,
} from '@/shared/query-hook/user.query'
import { isValidUrlOrEmpty } from '@/shared/utils/format'
import { uploadImage } from '@/shared/utils/upload-image'
import { Button, Input, Label, Separator, toast } from '@blog/ui'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useWatch } from 'react-hook-form'
import { useEditUserForm } from './use-edit-user-form'

export const EditUserPage = () => {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const { data: user, isLoading } = useUserInfo()
  const { mutateAsync: editInfo, isPending: isSavingInfo } = useEditUserInfo({
    onSuccess: () => {
      toast.success('Profile updated successfully')
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })
  const { mutateAsync: editProfileImage, isPending: isSavingProfile } = useEditUserProfileImage({
    onSuccess: () => {
      toast.success('Profile image updated successfully')
    },
    onError: () => {
      toast.error('Failed to update profile image')
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty, isValid },
  } = useEditUserForm()

  useEffect(() => {
    if (!user) return
    reset({
      name: user.name ?? '',
      intro: user.intro ?? '',
      instagramId: user.instagramId ?? '',
      githubId: user.githubId ?? '',
      personalUrl: user.personalUrl ?? '',
    })
  }, [user, reset])

  const personalUrl = useWatch({ name: 'personalUrl', control })

  const onClickEditPhoto = () => {
    fileRef.current?.click()
  }

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const url = await uploadImage(file, 'thumbnail')
    await editProfileImage({ profileImage: url })
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name.trim(),
      intro: values.intro.trim(),
      instagramId: values.instagramId.trim(),
      githubId: values.githubId.trim(),
      personalUrl: values.personalUrl.trim() ?? '',
    }
    await editInfo(payload)
    reset(payload, { keepDefaultValues: false })
    navigate({ to: '/user/info', replace: true })
  })

  const canSave = isDirty && isValid && isValidUrlOrEmpty((personalUrl ?? '').trim())

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
        <form onSubmit={onSubmit} className="flex-1 space-y-7">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              {...register('name', { required: true, validate: (v) => !!v.trim() })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="intro">Bio</Label>
            <Input
              id="intro"
              placeholder="Introduce yourself"
              {...register('intro', { required: true, validate: (v) => !!v.trim() })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="githubId">GitHub</Label>
            <Input
              id="githubId"
              placeholder="github id"
              {...register('githubId', { required: true, validate: (v) => !!v.trim() })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="instagramId">Instagram</Label>
            <Input
              id="instagramId"
              placeholder="instagram id"
              {...register('instagramId', { required: true, validate: (v) => !!v.trim() })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="personalUrl">URL</Label>
            <Input
              id="personalUrl"
              placeholder="https://example.com"
              {...register('personalUrl', {
                required: true,
                validate: (v) => isValidUrlOrEmpty(v.trim()),
              })}
            />
            <p className="text-xs text-muted-foreground">
              URL은 <span className="font-medium">https://</span> 포함해서 넣어주세요.
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-40"
              disabled={!canSave || isSavingInfo}
            >
              {isSavingInfo ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>

        {/* Profile */}
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
      <UnsavedChangesGuard isDirty={isDirty} />
    </div>
  )
}
