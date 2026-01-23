import { z } from 'zod'
import { ApiResponse, PaginatedResponse } from '../common'
import { PostListQuerySchema, PostSchema } from './post.schema'

// 글 목록 조회
export const GetPostList = {
  method: 'GET',
  path: '/post',
  Query: PostListQuerySchema,
  Response: ApiResponse(PaginatedResponse(PostSchema)),
}
export type GetPostListResponse = z.infer<typeof GetPostList.Response> // 응답 타입
export type GetPostListQuery = z.infer<typeof GetPostList.Query> // 요청 쿼리 타입
export type GetPostListData = GetPostListResponse['data'] // 실제 데이터 타입

// 고정 글 목록 조회
export const GetPinnedPostList = {
  method: 'GET',
  path: '/post/pinned',
  Query: PostListQuerySchema,
  Response: ApiResponse(PaginatedResponse(PostSchema)),
}
export type GetPinnedPostListResponse = z.infer<typeof GetPinnedPostList.Response> // 응답 타입
export type GetPinnedPostListQuery = z.infer<typeof GetPinnedPostList.Query> // 요청 쿼리 타입
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

// 월별 게시글 목록 조회
export const GetMonthPostList = {
  method: 'GET',
  path: '/post/calendar',
  Query: z.object({
    year: z.number(),
    month: z.number().min(1).max(12),
  }),
  Response: ApiResponse(z.array(z.number())),
}
export type GetMonthPostListResponse = z.infer<typeof GetMonthPostList.Response> // 응답 타입
export type GetMonthPostListQuery = z.infer<typeof GetMonthPostList.Query> // 요청 쿼리 타입
export type GetMonthPostListData = GetMonthPostListResponse['data'] // 실제 데이터 타입
