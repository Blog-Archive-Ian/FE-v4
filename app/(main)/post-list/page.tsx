import { getRecentPostList } from '@/entities/post/post.api'
import { PostListParams } from '@/entities/post/post.api.type'
import { PostItem } from '@/features/post/post-list/ui/post-item'
import { PostPagination } from '@/features/post/post-list/ui/post-pagination'

export default async function PostListPage({
  searchParams,
}: {
  searchParams: Promise<PostListParams>
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
