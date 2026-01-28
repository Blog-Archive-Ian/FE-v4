import { PostListPage } from '@/pages/post/post-list-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/posts/list')({
  component: PostListPage,
})
