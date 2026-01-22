import { PostItem } from '@/features/post/post-list/ui/post-item'
import { PostPagination } from '@/features/post/post-list/ui/post-pagination'
import { getRecentPostList } from '@/shared/api/post.api'
import { PaginationQuery } from '@blog/contracts'

export default async function PostListPage({
  searchParams,
}: {
  searchParams: Promise<PaginationQuery>
}) {
  const page = Number((await searchParams).page ?? 1)
  const size = Number((await searchParams).size ?? 5)

  const posts = await getRecentPostList({ page, size })
  const totalPages = Math.ceil(posts.totalCount / size)

  return (
    <div className="max-w-250 flex flex-col gap-10">
      <h1 className="text-xl font-bold">고정글</h1>
      {posts.posts.map((post) => (
        <PostItem key={post.postSeq} post={post} />
      ))}
      <PostPagination page={page} size={size} totalPages={totalPages} />
    </div>
  )
}
