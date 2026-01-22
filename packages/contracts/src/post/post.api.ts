import { z } from 'zod'
import { ApiResponse, PaginatedResponse, PaginationQuerySchema } from '../common'
import { PostSchema } from './post.schema'

// 최신 글 목록 조회
export const GetRecentPostList = {
  method: 'GET',
  path: '/post',
  Query: z.object(PaginationQuerySchema.shape),
  Response: ApiResponse(PaginatedResponse(PostSchema)),
}
export type GetRecentPostListResponse = z.infer<typeof GetRecentPostList.Response> // 응답 타입
export type GetRecentPostListParams = z.infer<typeof GetRecentPostList.Query> // 요청 쿼리 타입
export type GetRecentPostListData = GetRecentPostListResponse['data'] // 실제 데이터 타입

// 고정 글 목록 조회
export const GetPinnedPostList = {
  method: 'GET',
  path: '/post/pinned',
  Query: z.object(PaginationQuerySchema.shape),
  Response: ApiResponse(PaginatedResponse(PostSchema)),
}
export type GetPinnedPostListResponse = z.infer<typeof GetPinnedPostList.Response> // 응답 타입
export type GetPinnedPostListParams = z.infer<typeof GetPinnedPostList.Query> // 요청 쿼리 타입
export type GetPinnedPostListData = GetPinnedPostListResponse['data'] // 실제 데이터 타입

// 인기 글 목록 조회
export const GetPopularPostList = {
  method: 'GET',
  path: '/post/popular',
  Response: ApiResponse(z.array(PostSchema)),
}
export type GetPopularPostListResponse = z.infer<typeof GetPopularPostList.Response> // 응답 타입
export type GetPopularPostListData = GetPopularPostListResponse['data'] // 실제 데이터 타입

// 글 상세 조회
export const GetPostDetail = {
  method: 'GET',
  path: (postSeq: number | string) => `/post/${postSeq}`,
  Params: z.object({
    postSeq: z.union([z.number(), z.string()]),
  }),
  Response: ApiResponse(PostSchema),
}
export type GetPostDetailResponse = z.infer<typeof GetPostDetail.Response> // 응답 타입
export type GetPostDetailParams = z.infer<typeof GetPostDetail.Params> // 요청 파라미터 타입
export type GetPostDetailData = GetPostDetailResponse['data'] // 실제 데이터 타입
