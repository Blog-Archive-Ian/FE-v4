import { getRecentPostList } from '@/entities/post/post.api'
import { MainPage } from '@/pages/main-page'

export default async function Home() {
  const posts = await getRecentPostList({ page: 1, size: 5 })
  return <MainPage posts={posts.posts} />
}
