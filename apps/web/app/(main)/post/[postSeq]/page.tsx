import { Comments } from '@/section/post/post-detail/comments'
import { PostContent } from '@/section/post/post-detail/post-content'
import { PostHeaderTitleTracker } from '@/section/post/post-detail/post-header-title-tracker'
import { ScrollToBottomButton } from '@/section/post/post-detail/scroll-to-bottom-button'
import { TableOfContents } from '@/section/post/post-detail/toc'
import { PostViewTracker } from '@/section/post/post-detail/view-tracker'
import { getPostDetail, getSameCategoryPostList } from '@/shared/api/post.api'
import { formatKoreanDate, stripMarkdown } from '@/shared/lib/format'
import { GetPostDetailParams, GetSameCategoryPostListData } from '@blog/contracts'
import { Badge, Separator } from '@blog/ui'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postSeq: string }>
}): Promise<Metadata> {
  const { postSeq } = await params
  const post = await getPostDetail({ postSeq })

  if (!post || post.archived) {
    return {
      title: '게시글을 찾을 수 없어요',
      robots: { index: false, follow: false },
    }
  }

  const title = post.title
  const plain = stripMarkdown(String(post.content ?? ''))

  const description =
    plain.length > 160
      ? plain.slice(0, 157).replace(/\s+\S*$/, '') + '…'
      : plain || '프론트엔드 기술 블로그입니다. 다양한 기술 스택과 개발 경험을 공유합니다.'

  const url = `/post/${postSeq}`
  const siteName = 'Archive | Ian Blog'

  const image = '/og.png'

  const category = post.category || 'Tech'
  const tags = post.tags ?? []
  const authorName = post.authorName || 'Ian'
  const publishedTime = post.createdAt

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: tags,

    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName,
      images: [{ url: image }],
      publishedTime,
      section: category,
      tags,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },

    authors: [{ name: authorName }],
    category,
  }
}

export default async function PostPage({ params }: { params: Promise<GetPostDetailParams> }) {
  const { postSeq } = await params
  const post = await getPostDetail({ postSeq })

  if (!post || post.archived) notFound()

  // 카테고리 연관글 목록 (에러가 나도 상세 페이지는 그대로 보여주기 위해 안전하게 처리)
  let sameCategoryPosts: GetSameCategoryPostListData = []
  try {
    sameCategoryPosts = await getSameCategoryPostList({ postSeq })
  } catch {
    sameCategoryPosts = []
  }

  const baseUrl = 'https://blog.minjae-dev.com'
  const url = `${baseUrl}/post/${postSeq}`

  const plain = stripMarkdown(String(post.content ?? ''))
  const description =
    plain.length > 160
      ? plain.slice(0, 157).replace(/\s+\S*$/, '') + '…'
      : plain || '프론트엔드 기술 블로그입니다. 다양한 기술 스택과 개발 경험을 공유합니다.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description,
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    author: { '@type': 'Person', name: post.authorName || 'Ian' },
    publisher: {
      '@type': 'Organization',
      name: 'Archive | Ian Blog',
    },
    image: [`${baseUrl}/og.png`],
    keywords: (post.tags ?? []).join(', '),
    articleSection: post.category || 'Tech',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative mx-auto w-full flex">
        {/* 조회수 증가 트래커 (클라이언트에서 쿠키 기반 1시간 중복 방지) */}
        <PostViewTracker postSeq={Number(postSeq)} />
        {/* 헤더에 현재 게시글 제목을 표시하기 위한 트래커 */}
        <PostHeaderTitleTracker postTitle={post.title} />

        {/* 중앙 콘텐츠 */}
        <div className="mx-auto w-full max-w-200" id="post-article">
          <article className="min-w-0 pb-5">
            <Link href={`/post-list/category/${post.category}`}>
              <p className="text-md lg:text-lg font-semibold text-muted-foreground">
                {post.category}
              </p>
            </Link>

            <h1 className="mt-3 text-2xl lg:text-3xl font-semibold tracking-tight">{post.title}</h1>

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

          {/* 카테고리 연관글 섹션 */}
          {sameCategoryPosts.length > 0 && (
            <section className="mb-5 rounded-xl border bg-card px-4 py-5 sm:px-6">
              <h2 className="text-sm font-semibold text-muted-foreground">카테고리 연관글</h2>
              <div className="mt-3">
                {sameCategoryPosts.map((item) => (
                  <Link
                    key={item.postSeq}
                    href={`/post/${item.postSeq}`}
                    className="group relative flex items-center justify-between py-2"
                  >
                    <span className="mr-3 line-clamp-1 text-sm sm:text-base text-muted-foreground">
                      {item.title}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">→</span>
                    <div className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-8 rounded-full bg-point opacity-0 transition-opacity duration-75 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <Comments post={post} />
          <ScrollToBottomButton />
        </div>

        <aside className="hidden 2xl:block">
          <div className="sticky top-24 right-0 w-[320px]">
            <TableOfContents title={post.title} />
          </div>
        </aside>
      </div>
    </>
  )
}
