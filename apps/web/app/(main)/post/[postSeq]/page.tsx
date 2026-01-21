import { Badge, Separator } from '@blog/ui'
import { notFound } from 'next/navigation'

import { getPostDetail } from '@/entities/post/post.api'
import { PostSeq } from '@/entities/post/post.entity'
import { Comments } from '@/features/post/post-detail/ui/comments'
import { PostContent } from '@/features/post/post-detail/ui/post-content'
import { TableOfContents } from '@/features/post/post-detail/ui/toc'
import { formatKoreanDate } from '@/shared/lib/format'

export default async function PostPage({ params }: { params: Promise<PostSeq> }) {
  const { postSeq } = await params
  const post = await getPostDetail({ postSeq })

  if (!post) notFound()

  return (
    <div className="relative mx-auto w-full  flex">
      {/* 중앙 콘텐츠 */}
      <div className="mx-auto w-full max-w-200">
        <article className="min-w-0 pb-20">
          <p className="text-md lg:text-lg font-semibold text-muted-foreground">{post.category}</p>

          <h1 className="mt-3 text-2xl lg:text-4xl font-semibold tracking-tight">{post.title}</h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-md px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">{formatKoreanDate(post.createdAt)}</p>

          <Separator className="my-6" />

          <PostContent post={post} />
        </article>

        <Comments post={post} />
      </div>

      <aside className="hidden 2xl:block">
        <div className="sticky top-24 right-0 w-[320px]">
          <TableOfContents title={post.title} />
        </div>
      </aside>
    </div>
  )
}
