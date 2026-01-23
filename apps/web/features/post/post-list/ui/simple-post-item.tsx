import type { Post } from '@blog/contracts'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  post: Post
}

export const SimplePostItem = async ({ post }: Props) => {
  return (
    <Link
      href={`/post/${post.postSeq}`}
      className="flex items-center justify-between gap-4 rounded-md py-2 text-muted-foreground"
    >
      <p className="truncate text-md">{post.title}</p>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform" />
    </Link>
  )
}
