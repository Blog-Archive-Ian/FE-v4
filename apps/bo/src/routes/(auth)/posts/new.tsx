import { CreatePostPage } from '@/pages/post/create-post-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/posts/new')({
  component: CreatePostPage,
})
