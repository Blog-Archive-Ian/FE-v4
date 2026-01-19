import { ApiResponse, PaginatedResponse } from '@/shared/api/api.type'
import { API } from '@/shared/api/client'

import { PostListParams } from './post.api.type'
import { Post } from './post.entity'

export async function getRecentPostList({
  page,
  size,
}: PostListParams): Promise<PaginatedResponse<Post>> {
  const res = await API.get<ApiResponse<PaginatedResponse<Post>>>('/post', {
    params: { page, size },
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}
