import { z } from 'zod'
import { CacheTags } from '../cache'
import { ApiResponse, ApiResponseStrict, PaginatedResponse } from '../common'
import {
  CategoryPostSummarySchema,
  CreatePostSchema,
  FilteredPostListQuerySchema,
  PostListQuerySchema,
  PostSchema,
} from './post.schema'

// 글 목록 조회
export const GetPostList = {
  method: 'GET',
  path: '/post',
  Query: PostListQuerySchema,
  Response: ApiResponseStrict(PaginatedResponse(PostSchema)),
}
export type GetPostListResponse = z.infer<typeof GetPostList.Response> // 응답 타입
export type GetPostListQuery = z.infer<typeof GetPostList.Query> // 요청 쿼리 타입
export type GetPostListData = GetPostListResponse['data'] // 실제 데이터 타입

// 고정 글 목록 조회
export const GetPinnedPostList = {
  method: 'GET',
  path: '/post/pinned',
  Query: PostListQuerySchema,
  Response: ApiResponseStrict(PaginatedResponse(PostSchema)),
}
export type GetPinnedPostListResponse = z.infer<typeof GetPinnedPostList.Response> // 응답 타입
export type GetPinnedPostListQuery = z.infer<typeof GetPinnedPostList.Query> // 요청 쿼리 타입
export type GetPinnedPostListData = GetPinnedPostListResponse['data'] // 실제 데이터 타입

// 인기 글 목록 조회
export const GetPopularPostList = {
  method: 'GET',
  path: '/post/popular',
  Response: ApiResponseStrict(z.array(PostSchema)),
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
  Response: ApiResponseStrict(PostSchema),
}
export type GetPostDetailResponse = z.infer<typeof GetPostDetail.Response> // 응답 타입
export type GetPostDetailParams = z.infer<typeof GetPostDetail.Params> // 요청 파라미터 타입
export type GetPostDetailData = GetPostDetailResponse['data'] // 실제 데이터 타입

// 같은 카테고리의 다른 글 5개 조회 (현재 글, 비공개 글 제외)
export const GetSameCategoryPostList = {
  method: 'GET',
  path: (postSeq: number | string) => `/post/${postSeq}/same-category`,
  Params: z.object({
    postSeq: z.union([z.number(), z.string()]),
  }),
  Response: ApiResponseStrict(z.array(CategoryPostSummarySchema)),
} as const
export type GetSameCategoryPostListResponse = z.infer<
  typeof GetSameCategoryPostList.Response
>
export type GetSameCategoryPostListParams = z.infer<
  typeof GetSameCategoryPostList.Params
>
export type GetSameCategoryPostListData =
  GetSameCategoryPostListResponse['data']

// 월별 게시글 목록 조회
export const GetMonthPostList = {
  method: 'GET',
  path: '/post/calendar',
  Query: z.object({
    year: z.number(),
    month: z.number().min(1).max(12),
  }),
  Response: ApiResponseStrict(z.array(z.number())),
}
export type GetMonthPostListResponse = z.infer<typeof GetMonthPostList.Response> // 응답 타입
export type GetMonthPostListQuery = z.infer<typeof GetMonthPostList.Query> // 요청 쿼리 타입
export type GetMonthPostListData = GetMonthPostListResponse['data'] // 실제 데이터 타입

// 글 작성
export const CreatePost = {
  method: 'POST',
  path: '/post',
  Body: CreatePostSchema,
  Response: ApiResponseStrict(
    z.object({
      postSeq: z.number(),
    }),
  ),
  revalidate: () => [
    CacheTags.Post.list,
    CacheTags.Post.popular,
    CacheTags.Post.pinned,
    CacheTags.Post.all,
    CacheTags.User.categories,
    CacheTags.User.tags,
  ],
} as const
export type CreatePostResponse = z.infer<typeof CreatePost.Response> // 응답 타입
export type CreatePostBody = z.infer<typeof CreatePost.Body> // 요청 바디 타입
export type CreatePostData = CreatePostResponse['data'] // 실제 데이터 타입

// 글 삭제
export const DeletePost = {
  method: 'DELETE',
  path: (postSeq: number | string) => `/post/${postSeq}`,
  Params: z.object({
    postSeq: z.number(),
  }),
  Response: ApiResponse(z.never()),
  revalidate: (postSeq: number | string) => [
    CacheTags.Post.byId(postSeq),
    CacheTags.Post.list,
    CacheTags.Post.popular,
    CacheTags.Post.pinned,
    CacheTags.User.categories,
    CacheTags.User.tags,
  ],
} as const
export type DeletePostResponse = z.infer<typeof DeletePost.Response> // 응답 타입
export type DeletePostParams = z.infer<typeof DeletePost.Params> // 요청 파라미터 타입

// 글 수정
export const UpdatePost = {
  method: 'PUT',
  path: (postSeq: number | string) => `/post/${postSeq}`,
  Params: z.object({
    postSeq: z.union([z.number(), z.string()]),
  }),
  Body: CreatePostSchema,
  Response: ApiResponse(z.never()),
  revalidate: (postSeq: number | string) => [
    CacheTags.Post.byId(postSeq),
    CacheTags.Post.list,
    CacheTags.Post.popular,
    CacheTags.Post.pinned,
    CacheTags.User.categories,
    CacheTags.User.tags,
  ],
} as const
export type UpdatePostResponse = z.infer<typeof UpdatePost.Response>
export type UpdatePostParams = z.infer<typeof UpdatePost.Params>
export type UpdatePostBody = z.infer<typeof UpdatePost.Body>
export type UpdatePostData = UpdatePostResponse['data']

// 글 필터링 조회
export const GetFilteredPostList = {
  method: 'GET',
  path: '/post',
  Query: FilteredPostListQuerySchema,
  Response: ApiResponseStrict(PaginatedResponse(PostSchema)),
}
export type GetFilteredPostListResponse = z.infer<typeof GetFilteredPostList.Response> // 응답 타입
export type GetFilteredPostListQuery = z.infer<typeof GetFilteredPostList.Query> // 요청 쿼리 타입
export type GetFilteredPostListData = GetFilteredPostListResponse['data'] // 실제 데이터 타입

// 글 고정
export const PinPost = {
  method: 'POST',
  path: (postSeq: number | string) => `/post/${postSeq}/pin`,
  Params: z.object({
    postSeq: z.number(),
  }),
  Response: ApiResponse(z.never()),
  revalidate: (postSeq: number | string) => [
    CacheTags.Post.byId(postSeq),
    CacheTags.Post.pinned,
    CacheTags.Post.list,
  ],
} as const
export type PinPostResponse = z.infer<typeof PinPost.Response>
export type PinPostParams = z.infer<typeof PinPost.Params>

// 글 고정해제
export const UnPinPost = {
  method: 'POST',
  path: (postSeq: number | string) => `/post/${postSeq}/unpin`,
  Params: z.object({
    postSeq: z.number(),
  }),
  Response: ApiResponse(z.never()),
  revalidate: (postSeq: number | string) => [
    CacheTags.Post.byId(postSeq),
    CacheTags.Post.pinned,
    CacheTags.Post.list,
  ],
} as const
export type UnPinPostResponse = z.infer<typeof UnPinPost.Response>
export type UnPinPostParams = z.infer<typeof UnPinPost.Params>

// 글 보관
export const ArchivePost = {
  method: 'POST',
  path: (postSeq: number | string) => `/post/${postSeq}/archive`,
  Params: z.object({
    postSeq: z.number(),
  }),
  Response: ApiResponse(z.never()),
  revalidate: (postSeq: number | string) => [
    CacheTags.Post.byId(postSeq),
    CacheTags.Post.list,
    CacheTags.Post.popular,
    CacheTags.Post.pinned,
  ],
} as const
export type ArchivePostResponse = z.infer<typeof ArchivePost.Response>
export type ArchivePostParams = z.infer<typeof ArchivePost.Params>

// 글 보관 해제
export const UnArchivePost = {
  method: 'POST',
  path: (postSeq: number | string) => `/post/${postSeq}/unarchive`,
  Params: z.object({
    postSeq: z.number(),
  }),
  Response: ApiResponse(z.never()),
  revalidate: (postSeq: number | string) => [
    CacheTags.Post.byId(postSeq),
    CacheTags.Post.list,
    CacheTags.Post.popular,
    CacheTags.Post.pinned,
  ],
} as const
export type UnArchivePostResponse = z.infer<typeof UnArchivePost.Response>
export type UnArchivePostParams = z.infer<typeof UnArchivePost.Params>

// 조회수 증가 (쿠키 기반 중복 방지 전용)
export const IncreasePostView = {
  method: 'POST',
  path: (postSeq: number | string) => `/post/${postSeq}/view`,
  Params: z.object({
    postSeq: z.number(),
  }),
  Response: ApiResponseStrict(
    z.object({
      views: z.number(),
    }),
  ),
  revalidate: (postSeq: number | string) => [
    CacheTags.Post.byId(postSeq),
    CacheTags.Post.popular,
  ],
} as const
export type IncreasePostViewResponse = z.infer<typeof IncreasePostView.Response>
export type IncreasePostViewParams = z.infer<typeof IncreasePostView.Params>
