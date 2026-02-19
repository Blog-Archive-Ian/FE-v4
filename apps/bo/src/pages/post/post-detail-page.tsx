import { Alert } from '@/shared/components/molecules/alert'
import { PostContent } from '@/shared/components/molecules/post-content'
import { PostPdfDownloadButton } from '@/shared/components/molecules/post-pdf-download-button'
import { TableOfContents } from '@/shared/components/molecules/toc'
import {
  useArchivePost,
  useDeletePost,
  usePinPost,
  usePostDetail,
  useUnArchivePost,
  useUnPinPost,
} from '@/shared/query-hook/post.query'
import { formatKoreanDate } from '@/shared/utils/format'
import { Badge, Button, Separator } from '@blog/ui'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Archive, Pencil, Pin, Trash2 } from 'lucide-react'
import { useState } from 'react'

export const PostDetailPage = () => {
  const { postSeq } = useParams({ from: '/(auth)/posts/$postSeq' })
  const navigate = useNavigate()
  const seq = Number(postSeq)

  const { data: post, isLoading, isError } = usePostDetail({ postSeq: seq })
  const { mutateAsync: deletePost } = useDeletePost()
  const { mutateAsync: pinPost } = usePinPost()
  const { mutateAsync: unpinPost } = useUnPinPost()
  const { mutateAsync: archivePost } = useArchivePost()
  const { mutateAsync: unarchivePost } = useUnArchivePost()

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

  const handleDeletePost = () => {
    deletePost({ postSeq: seq })
    setDeleteAlertOpen(false)
    navigate({ to: '/posts/list' })
  }

  if (!Number.isFinite(seq))
    return <div className="mx-auto max-w-200 px-6 py-10">잘못된 게시글 번호입니다.</div>

  if (isLoading) return <div className="mx-auto max-w-200 px-6 py-10">불러오는 중…</div>

  if (isError || !post)
    return <div className="mx-auto max-w-200 px-6 py-10">게시글을 찾을 수 없어요.</div>

  return (
    <div className="relative mx-auto w-full flex">
      {/* 중앙 콘텐츠 */}
      <div className="mx-auto w-full max-w-200" id="post-article">
        <article className="min-w-0 pb-20">
          <p className="text-md lg:text-lg font-semibold text-muted-foreground">{post.category}</p>

          <h1 className="mt-3 text-2xl lg:text-4xl font-semibold tracking-tight">{post.title}</h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="rounded-md px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{formatKoreanDate(post.createdAt)}</p>
            <div>
              <Button
                onClick={() => {
                  navigate({
                    to: '/posts/edit/$postSeq',
                    params: { postSeq },
                  })
                }}
                size="icon"
                variant="ghost"
                aria-label="Edit"
              >
                <Pencil className="size-4" />
              </Button>

              <Button
                onClick={() => {
                  setDeleteAlertOpen(true)
                }}
                size="icon"
                variant="ghost"
                aria-label="Delete"
              >
                <Trash2 className="size-4 text-red-500" />
              </Button>

              <Button
                size="icon"
                variant={post.pinned ? 'secondary' : 'ghost'}
                aria-label={post.pinned ? 'Unpin' : 'Pin'}
                className={post.pinned ? 'text-foreground' : 'text-muted-foreground'}
                onClick={() => {
                  post.pinned ? unpinPost({ postSeq: seq }) : pinPost({ postSeq: seq })
                }}
              >
                <Pin className={post.pinned ? 'size-4 fill-current' : 'size-4'} />
              </Button>

              <Button
                size="icon"
                variant={post.archived ? 'secondary' : 'ghost'}
                aria-label={post.archived ? 'Unarchive' : 'Archive'}
                className={post.archived ? 'text-foreground' : 'text-muted-foreground'}
                onClick={() =>
                  post.archived ? unarchivePost({ postSeq: seq }) : archivePost({ postSeq: seq })
                }
              >
                <Archive className={post.archived ? 'size-4 fill-current' : 'size-4'} />
              </Button>
              <PostPdfDownloadButton post={post} />
            </div>
          </div>
          <Separator className="mt-3 mb-6" />
          <PostContent post={post} />
        </article>
      </div>

      <aside className="hidden 2xl:block">
        <div className="sticky top-24 right-0 w-[320px]">
          <TableOfContents title={post.title} />
        </div>
      </aside>

      <Alert
        title="정말로 글을 삭제하시겠습니까?"
        description="삭제된 글은 복구할 수 없습니다."
        open={deleteAlertOpen}
        onChangeOpen={setDeleteAlertOpen}
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setDeleteAlertOpen(false)}>
              취소
            </Button>
            <Button type="button" onClick={() => handleDeletePost()}>
              확인
            </Button>
          </>
        }
      />
    </div>
  )
}
