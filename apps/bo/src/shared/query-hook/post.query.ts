import type {
  GetPinnedPostListQuery,
  GetPopularPostListData,
  GetPostDetailData,
  GetPostDetailParams,
  GetPostListData,
  GetPostListQuery,
} from '@blog/contracts'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'
import { getPinnedPostList, getPopularPostList, getPostDetail, getPostList } from '../api/post.api'

export const postQueryKeys = {
  all: ['post'] as const,
  lists: (query: GetPostListQuery) => [...postQueryKeys.all, query, 'list'] as const,
  pinnedLists: (query: GetPinnedPostListQuery) =>
    [...postQueryKeys.all, query, 'pinned-list'] as const,
  popularLists: () => [...postQueryKeys.all, 'popular-list'] as const,
  postDetail: (params: GetPostDetailParams) => [...postQueryKeys.all, params, 'detail'] as const,
}

// 글 목록 조회
export const usePostList = (
  query: GetPostListQuery,
  options?: UseQueryOptions<GetPostListData, Error>,
) => {
  return useQuery({
    queryKey: postQueryKeys.lists(query),
    queryFn: async () => {
      const res = await getPostList(query)
      return res
    },
    select: useCallback((data: GetPostListData) => data, []),
    ...options,
  })
}

// 고정 글 목록 조회
export const usePinnedPostList = (
  query: GetPinnedPostListQuery,
  options?: UseQueryOptions<GetPostListData, Error>,
) => {
  return useQuery({
    queryKey: postQueryKeys.pinnedLists(query),
    queryFn: async () => {
      const res = await getPinnedPostList(query)
      return res
    },
    select: useCallback((data: GetPostListData) => data, []),
    ...options,
  })
}

// 인기 글 목록 조회
export const usePopularPostList = (options?: UseQueryOptions<GetPopularPostListData, Error>) => {
  return useQuery({
    queryKey: postQueryKeys.popularLists(),
    queryFn: async () => {
      const res = await getPopularPostList()
      return res
    },
    select: useCallback((data: GetPopularPostListData) => data, []),
    ...options,
  })
}

// 글 상세 조회
export const usePostDetail = (
  params: GetPostDetailParams,
  options?: UseQueryOptions<GetPostDetailData | null, Error>,
) => {
  return useQuery({
    queryKey: postQueryKeys.postDetail(params),
    queryFn: async () => {
      const res = await getPostDetail(params)
      return res
    },
    select: useCallback((data: GetPostDetailData | null) => data, []),
    ...options,
  })
}
