import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { getPinnedPostList, getPopularPostList, getRecentPostList } from '@/entities/post/post.api'
import { PostItem } from '@/features/post/post-list/ui/post-item'
import { SimplePostItem } from '@/features/post/post-list/ui/simple-post-item'

export default async function Home() {
  const posts = await getRecentPostList({ page: 1, size: 5 })
  const pinnedPosts = await getPinnedPostList({ page: 1, size: 5 })
  const popularPosts = await getPopularPostList()

  return (
    <div className="flex gap-10">
      <section className="flex flex-col gap-10">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">고정글</h1>
          <Link
            href="/post-list?pinned=true"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <span>고정글 전체 보기</span>
            <ChevronRight className="size-4" />
          </Link>
        </div>
        {pinnedPosts.posts.map((post) => (
          <PostItem key={post.postSeq} post={post} />
        ))}

        <div className="flex justify-between">
          <h1 className="text-xl font-bold">최신글</h1>
          <Link
            href="/post-list"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <span>최신글 전체 보기</span>
            <ChevronRight className="size-4" />
          </Link>
        </div>
        {posts.posts.map((post) => (
          <PostItem key={post.postSeq} post={post} />
        ))}
      </section>
      <div className="hidden xl:block xl:w-90 shrink-0">
        <div className="border-l-2 border-border pl-8">
          <h2 className="mb-6 text-lg font-semibold">인기글</h2>
          {popularPosts.map((post) => (
            <SimplePostItem key={post.postSeq} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
