import { Comments } from '@/features/post/post-detail/ui/comments'
import { PostContent } from '@/features/post/post-detail/ui/post-content'
import { ScrollToBottomButton } from '@/features/post/post-detail/ui/scroll-to-bottom-button'
import { TableOfContents } from '@/features/post/post-detail/ui/toc'
import { getPostDetail } from '@/shared/api/post.api'
import { formatKoreanDate } from '@/shared/lib/format'
import { GetPostDetailParams } from '@blog/contracts'
import { Badge, Separator } from '@blog/ui'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function PostPage({ params }: { params: Promise<GetPostDetailParams> }) {
  const { postSeq } = await params
  const post = await getPostDetail({ postSeq })

  if (!post) notFound()

  return (
    <div className="relative mx-auto w-full flex">
      {/* 중앙 콘텐츠 */}
      <div className="mx-auto w-full max-w-200" id="post-article">
        <article className="min-w-0 pb-20">
          <Link href={`/post-list/category/${post.category}`}>
            <p className="text-md lg:text-lg font-semibold text-muted-foreground">
              {post.category}
            </p>
          </Link>

          <h1 className="mt-3 text-2xl lg:text-4xl font-semibold tracking-tight">{post.title}</h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/post-list/tag/${tag}`}>
                <Badge key={tag} variant="outline" className="rounded-md px-3 py-1">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{formatKoreanDate(post.createdAt)}</p>
          <Separator className="my-6" />
          <PostContent post={post} />
        </article>

        <Comments post={post} />
        <ScrollToBottomButton />
      </div>

      <aside className="hidden 2xl:block">
        <div className="sticky top-24 right-0 w-[320px]">
          <TableOfContents title={post.title} />
        </div>
      </aside>
    </div>
  )
}
