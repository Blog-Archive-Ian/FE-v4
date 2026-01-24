export const dynamic = 'force-dynamic'
export const revalidate = 0

import { PostItem } from '@/features/post/post-list/ui/post-item'
import { PostPagination } from '@/features/post/post-list/ui/post-pagination'
import { getPostList } from '@/shared/api/post.api'
import { PaginationQuery } from '@blog/contracts'
import { redirect } from 'next/navigation'

export default async function PostListPage({
  searchParams,
}: {
  searchParams: Promise<PaginationQuery>
}) {
  const sp = await searchParams

  const pageRaw = Number(sp.page ?? 1)
  const sizeRaw = Number(sp.size ?? 5)

  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? pageRaw : 1
  const size = Number.isFinite(sizeRaw) && sizeRaw >= 1 && sizeRaw <= 100 ? sizeRaw : 5

  const posts = await getPostList({ page, size })
  const totalPages = posts.totalCount > 0 ? Math.ceil(posts.totalCount / size) : 0

  if (posts.totalCount > 0 && page > totalPages) {
    redirect(`/post-list?page=${totalPages}&size=${size}`)
  }

  return (
    <div className="max-w-250 flex flex-col gap-10">
      <h1 className="text-xl font-bold">최신글</h1>
      {posts.posts.map((post) => (
        <PostItem key={post.postSeq} post={post} />
      ))}
      <PostPagination page={page} size={size} totalPages={totalPages} />
    </div>
  )
}
