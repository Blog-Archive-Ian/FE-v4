import { CustomEditor } from '@/shared/components/molecules/editor'
import { UnsavedChangesGuard } from '@/shared/components/molecules/unsaved-changes-guard'
import { useCreatePost } from '@/shared/query-hook/post.query'
import { useCategories } from '@/shared/query-hook/user.query'
import { Button, cn, Input, Label, toast } from '@blog/ui'
import { useNavigate } from '@tanstack/react-router'
import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useWatch } from 'react-hook-form'
import { useCreateForm } from './use-post-form'

export const CreatePostPage = () => {
  const navigate = useNavigate()

  const { data: categories } = useCategories()
  const { mutateAsync: createPost } = useCreatePost({
    onSuccess: () => {
      toast.success('글이 성공적으로 작성되었습니다.')
    },
    onError: () => {
      toast.error('글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.')
    },
  })

  const methods = useCreateForm()
  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    control,
  } = methods

  const category = useWatch({ control, name: 'category' })
  const tags = useWatch({ control, name: 'tags' })

  const [tagInput, setTagInput] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const addTag = (raw: string) => {
    const v = raw.trim()
    if (!v) return
    if (tags.includes(v)) return
    setValue('tags', [...tags, v], { shouldDirty: true, shouldValidate: true })
    setTagInput('')
  }

  const removeTag = (t: string) => {
    setValue(
      'tags',
      tags.filter((x) => x !== t),
      { shouldDirty: true, shouldValidate: true },
    )
  }

  const onTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return

    if ((e.key === 'Enter' || e.key === ' ') && tagInput.trim() !== '') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    const res = await createPost(values)
    navigate({ to: '/posts/$postSeq', params: { postSeq: String(res.postSeq) } })
  })

  useEffect(() => {
    console.log(isDirty)
  }, [isDirty])

  return (
    <div>
      <FormProvider {...methods}>
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          {/* header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">New Post</h1>
              <p className="text-sm text-muted-foreground">새 글 작성</p>
            </div>

            <Button
              type="button"
              className="rounded-full px-6"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              Posting
            </Button>
          </div>

          <section className="mt-10">
            <Label htmlFor="title" className="sr-only">
              Title
            </Label>

            <Input
              id="title"
              placeholder="제목을 입력하세요"
              className="h-auto border-0 bg-transparent px-0 text-3xl! font-semibold shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
              {...register('title')}
            />
            <div className="mt-2 h-px w-full bg-border" />
          </section>

          <section className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {categories && (
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">Category</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const active = c.name === category
                    return (
                      <button
                        key={c.categoryId}
                        type="button"
                        onClick={() => setValue('category', c.name, { shouldDirty: true })}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-medium transition',
                          active
                            ? 'bg-foreground text-background'
                            : 'border border-border bg-background hover:bg-muted/40',
                        )}
                        title={`posts: ${c.postCount}`}
                      >
                        {c.name}
                        <span className="ml-2 text-[10px] opacity-70">{c.postCount}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Tags</p>

              <div className="mt-3 flex items-center gap-2">
                <Input
                  value={tagInput}
                  className="shadow-none"
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="엔터/스페이스로 태그 추가"
                  onKeyDown={onTagKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => addTag(tagInput)}
                  aria-label="add tag"
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {tags.length !== 0 &&
                  tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="rounded-full p-1 hover:bg-background/60"
                        aria-label={`remove ${t}`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold">Content</p>
              </div>
            </div>

            <CustomEditor />
          </section>
        </div>
      </FormProvider>
      <UnsavedChangesGuard isDirty={isDirty} />
    </div>
  )
}
