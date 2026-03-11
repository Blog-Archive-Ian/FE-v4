import { Alert } from '@/shared/components/molecules/alert'
import { CustomEditor } from '@/shared/components/molecules/editor'
import { UnsavedChangesGuard } from '@/shared/components/molecules/unsaved-changes-guard'
import { getDraftById } from '@/shared/api/ai.api'
import { useCreatePost } from '@/shared/query-hook/post.query'
import { useCategories } from '@/shared/query-hook/user.query'
import { Button, cn, Input, Label, toast } from '@blog/ui'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Plus, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useWatch } from 'react-hook-form'
import { useCreateForm } from './use-post-form'

export const CreatePostPage = () => {
  const navigate = useNavigate()
  const search = useSearch({ from: '/(auth)/posts/new' }) as { draftId?: string }

  const { data: categories } = useCategories()
  const { mutateAsync: createPost } = useCreatePost()

  const { form: methods } = useCreateForm()
  const { register, setValue, handleSubmit, control, formState, getValues } = methods
  const { isSubmitting, isDirty } = formState

  const [postingAlertOpen, setPostingAlertOpen] = useState(false)
  const [categoryInput, setCategoryInput] = useState('')

  const categoryOptions = useMemo(() => (categories ?? []).map((c) => c.name), [categories])
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

  const onClickPosting = handleSubmit(() => {
    setPostingAlertOpen(true)
  })

  const handlePosting = async () => {
    const values = getValues()
    const res = await createPost(values)

    methods.reset(values)

    setPostingAlertOpen(false)

    navigate({
      to: '/posts/$postSeq',
      params: { postSeq: String(res.postSeq) },
    })
  }

  const onSelectCategory = (name: string) => {
    setValue('category', name, { shouldDirty: true, shouldValidate: true })
  }

  const onCategoryChange = (v: string) => {
    setCategoryInput(v)
    setValue('category', v, { shouldDirty: true, shouldValidate: true })
  }

  const onCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onCategoryChange('')
    }
  }

  useEffect(() => {
    setCategoryInput(category ?? '')
  }, [category])

  useEffect(() => {
    if (!search?.draftId) return
    ;(async () => {
      try {
        const draft = await getDraftById(search.draftId!)
        if (!draft) {
          toast.error('AI 초안을 찾을 수 없습니다.')
          return
        }

        methods.reset(
          {
            title: draft.title,
            content: draft.content,
            tags: draft.tags ?? [],
            category: '',
          },
          {
            keepDefaultValues: false,
          },
        )
      } catch (err) {
        toast.error((err as Error)?.message ?? 'AI 초안 불러오기 중 오류가 발생했습니다.')
      }
    })()
  }, [methods, search?.draftId])

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
              onClick={onClickPosting}
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

                {/* ✅ 입력 + 자동완성 */}
                <div className="mt-3">
                  <Input
                    value={categoryInput}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    onKeyDown={onCategoryKeyDown}
                    placeholder="카테고리를 선택하거나 직접 입력하세요"
                    className="shadow-none"
                  />
                  <datalist id="category-options">
                    {categoryOptions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const active = c.name === category
                    return (
                      <button
                        key={c.categoryId}
                        type="button"
                        onClick={() => onSelectCategory(c.name)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-xs font-medium transition',
                          active
                            ? 'bg-foreground text-background'
                            : 'border bg-background hover:bg-muted/40',
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
      <Alert
        title="글을 포스팅하시겠습니까?"
        description="포스팅 이후에 수정 가능합니다."
        open={postingAlertOpen}
        onChangeOpen={setPostingAlertOpen}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setPostingAlertOpen(false)}>
              취소
            </Button>
            <Button type="button" onClick={handlePosting} disabled={isSubmitting}>
              확인
            </Button>
          </>
        }
      />
      <UnsavedChangesGuard isDirty={isDirty && !postingAlertOpen && !isSubmitting} />
    </div>
  )
}
