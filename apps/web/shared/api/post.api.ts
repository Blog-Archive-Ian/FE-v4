import { API } from '@/shared/api/client'
import {
  GetPinnedPostList,
  GetPopularPostList,
  GetPostDetail,
  GetRecentPostList,
  type GetPinnedPostListData,
  type GetPinnedPostListParams,
  type GetPinnedPostListResponse,
  type GetPopularPostListData,
  type GetPopularPostListResponse,
  type GetPostDetailData,
  type GetPostDetailParams,
  type GetPostDetailResponse,
  type GetRecentPostListData,
  type GetRecentPostListParams,
  type GetRecentPostListResponse,
} from '@blog/contracts'

export async function getRecentPostList(
  query: GetRecentPostListParams,
): Promise<GetRecentPostListData> {
  const res = await API.get<GetRecentPostListResponse>(GetRecentPostList.path, {
    next: { revalidate: 5 * 60 },
    params: query,
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

export async function getPinnedPostList(
  query: GetPinnedPostListParams,
): Promise<GetPinnedPostListData> {
  const res = await API.get<GetPinnedPostListResponse>(GetPinnedPostList.path, {
    next: { revalidate: 5 * 60 },
    params: query,
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

export async function getPopularPostList(): Promise<GetPopularPostListData> {
  const res = await API.get<GetPopularPostListResponse>(GetPopularPostList.path, {
    next: { revalidate: 5 * 60 },
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

export async function getPostDetail(params: GetPostDetailParams): Promise<GetPostDetailData> {
  const res = await API.get<GetPostDetailResponse>(GetPostDetail.path(params.postSeq), {
    next: { revalidate: 5 * 60 },
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}
