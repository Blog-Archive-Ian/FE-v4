import { PostListPage } from '@/pages/post/post-list-page'
import type { GetPostListQuery } from '@blog/contracts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/posts/list')({
  component: PostListPage,
  validateSearch: (params: Partial<GetPostListQuery>): Partial<GetPostListQuery> => {
    return {
      page: params.page ? Math.max(1, params.page) : 1,
      size: params.size ? Math.min(Math.max(1, params.size), 100) : 100,
    }
  },
})
