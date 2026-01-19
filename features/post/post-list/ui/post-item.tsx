import Link from 'next/link'

import type { Post } from '@/entities/post/post.entity'
import { formatKoreanDate, stripMarkdown } from '@/shared/lib/format'

type Props = {
  post: Post
}

export const PostItem = ({ post }: Props) => {
  return (
    <article key={post.postSeq} className="border-b border-border pb-10">
      <Link href={`/posts/${post.postSeq}`} className="block">
        <p className="mb-2 text-lg font-semibold text-muted-foreground">{post.category}</p>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight">{post.title}</h2>
        <p className="mt-5 text-lg leading-7 text-muted-foreground line-clamp-3">
          {stripMarkdown(post.content)}
        </p>
        <p className="mt-6 text-sm text-muted-foreground/70">{formatKoreanDate(post.createdAt)}</p>
      </Link>
    </article>
  )
}
