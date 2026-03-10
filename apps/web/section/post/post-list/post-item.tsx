import { formatKoreanDate, stripMarkdown } from '@/shared/lib/format'
import type { PostType } from '@blog/contracts'
import Link from 'next/link'

type Props = {
  post: PostType
}

export const PostItem = ({ post }: Props) => {
  return (
    <article className="group border-b border-border pb-10 w-full">
      <Link href={`/post/${post.postSeq}`} className="block space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">{post.category}</p>

        <h2 className="text-lg font-semibold leading-snug tracking-tight underline-offset-4 group-hover:underline md:text-xl decoration-point decoration-4">
          {post.title}
        </h2>

        <p className="text-sm leading-5 text-muted-foreground md:mt-4 md:text-base md:leading-7 line-clamp-3">
          {stripMarkdown(post.content)}
        </p>

        <p className="text-xs text-muted-foreground/60 md:mt-4">
          {formatKoreanDate(post.createdAt)}
        </p>
      </Link>
    </article>
  )
}
