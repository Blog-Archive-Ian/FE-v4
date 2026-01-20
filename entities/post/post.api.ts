import { ApiResponse, PaginatedResponse } from '@/shared/api/api.type'
import { API } from '@/shared/api/client'

import { PostDetailParams, PostListParams } from './post.api.type'
import { Post } from './post.entity'

// 최신글 목록 조회
export async function getRecentPostList({
  page,
  size,
}: PostListParams): Promise<PaginatedResponse<Post>> {
  const res = await API.get<ApiResponse<PaginatedResponse<Post>>>('/post', {
    next: { revalidate: 5 * 60 },
    params: { page, size },
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

// 고정글 목록 조회
export async function getPinnedPostList({
  page,
  size,
}: PostListParams): Promise<PaginatedResponse<Post>> {
  const res = await API.get<ApiResponse<PaginatedResponse<Post>>>('/post/pinned', {
    next: { revalidate: 5 * 60 },
    params: { page, size },
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

// 인기글 목록 조회
export async function getPopularPostList(): Promise<Post[]> {
  const res = await API.get<ApiResponse<Post[]>>('/post/popular', {
    next: { revalidate: 5 * 60 },
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

// 게시글 상세 조회
export async function getPostDetail({ postSeq }: PostDetailParams): Promise<Post> {
  const res = await API.get<ApiResponse<Post>>(`/post/${postSeq}`, {
    next: { revalidate: 5 * 60 },
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}
