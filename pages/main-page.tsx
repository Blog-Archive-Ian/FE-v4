import { Post } from '@/entities/post/post.entity'
import { PostItem } from '@/features/post/post-list/ui/post-item'

interface MainPageProps {
  posts: Post[]
}

export const MainPage = async ({ posts }: MainPageProps) => {
  return (
    <div className="flex gap-3">
      <section className="flex flex-col gap-10">
        {posts.map((post) => (
          <PostItem key={post.postSeq} post={post} />
        ))}
      </section>
    </div>
  )
}
