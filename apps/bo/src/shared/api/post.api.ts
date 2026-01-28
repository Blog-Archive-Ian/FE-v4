import { API } from '@/shared/api/client'
import {
  GetPinnedPostList,
  GetPopularPostList,
  GetPostDetail,
  GetPostList,
  type GetPinnedPostListData,
  type GetPinnedPostListQuery,
  type GetPinnedPostListResponse,
  type GetPopularPostListData,
  type GetPopularPostListResponse,
  type GetPostDetailData,
  type GetPostDetailParams,
  type GetPostDetailResponse,
  type GetPostListData,
  type GetPostListQuery,
  type GetPostListResponse,
} from '@blog/contracts'

//  글 목록 조회
export async function getPostList(query: GetPostListQuery): Promise<GetPostListData> {
  const res = await API.get<GetPostListResponse>(GetPostList.path, {
    params: query,
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

// 고정 글 목록 조회
export async function getPinnedPostList(
  query: GetPinnedPostListQuery,
): Promise<GetPinnedPostListData> {
  const res = await API.get<GetPinnedPostListResponse>(GetPinnedPostList.path, {
    params: query,
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

// 인기 글 목록 조회
export async function getPopularPostList(): Promise<GetPopularPostListData> {
  const res = await API.get<GetPopularPostListResponse>(GetPopularPostList.path, {})
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

// 글 상세 조회
export async function getPostDetail(
  params: GetPostDetailParams,
): Promise<GetPostDetailData | null> {
  const res = await API.get<GetPostDetailResponse>(GetPostDetail.path(params.postSeq), {})
  if (res.status === 404) return null
  if (res.status !== 200) {
    throw new Error(res.message)
  }
  return res.data
}
