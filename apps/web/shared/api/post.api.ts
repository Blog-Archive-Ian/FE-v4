import { API } from '@/shared/api/client'
import {
  CacheTags,
  GetFilteredPostListData,
  GetFilteredPostListQuery,
  GetFilteredPostListResponse,
  GetMonthPostList,
  GetMonthPostListData,
  GetMonthPostListQuery,
  GetMonthPostListResponse,
  GetPinnedPostList,
  GetPinnedPostListData,
  GetPinnedPostListQuery,
  GetPinnedPostListResponse,
  GetPopularPostList,
  GetPostDetail,
  GetPostList,
  type GetPopularPostListData,
  type GetPopularPostListResponse,
  type GetPostDetailData,
  type GetPostDetailParams,
  type GetPostDetailResponse,
} from '@blog/contracts'

//  글 목록 조회
export async function getPostList(
  query: GetFilteredPostListQuery,
): Promise<GetFilteredPostListData> {
  const res = await API.get<GetFilteredPostListResponse>(GetPostList.path, {
    next: { revalidate: 5 * 60, tags: [CacheTags.Post.list] },
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
    next: { revalidate: 5 * 60, tags: [CacheTags.Post.pinned] },
    params: query,
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

// 인기 글 목록 조회
export async function getPopularPostList(): Promise<GetPopularPostListData> {
  const res = await API.get<GetPopularPostListResponse>(GetPopularPostList.path, {
    next: { revalidate: 5 * 60, tags: [CacheTags.Post.popular] },
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}

// 글 상세 조회
export async function getPostDetail(
  params: GetPostDetailParams,
): Promise<GetPostDetailData | null> {
  const res = await API.get<GetPostDetailResponse>(GetPostDetail.path(params.postSeq), {
    next: {
      revalidate: 5 * 60,
      tags: [CacheTags.Post.detail, CacheTags.Post.byId(params.postSeq)],
    },
  })
  if (res.status === 404) return null
  if (res.status !== 200) {
    throw new Error(res.message)
  }
  return res.data
}

// 월별 게시글 목록 조회
export async function getMonthPostList(
  query: GetMonthPostListQuery,
): Promise<GetMonthPostListData> {
  const res = await API.get<GetMonthPostListResponse>(GetMonthPostList.path, {
    next: { revalidate: 5 * 60, tags: [CacheTags.Post.calendar(query.year, query.month)] },
    params: query,
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}
