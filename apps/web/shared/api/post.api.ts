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
  GetSameCategoryPostList,
  type GetSameCategoryPostListData,
  type GetSameCategoryPostListParams,
  type GetSameCategoryPostListResponse,
  GetPostList,
  type GetPopularPostListData,
  type GetPopularPostListResponse,
  type GetPostDetailData,
  type GetPostDetailParams,
  type GetPostDetailResponse,
  IncreasePostView,
  type IncreasePostViewParams,
  type IncreasePostViewResponse,
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

// 조회수 증가 (쿠키 기반 1시간 중복 방지)
export async function increasePostView(
  params: IncreasePostViewParams,
): Promise<number> {
  const res = await API.post<IncreasePostViewResponse>(
    IncreasePostView.path(params.postSeq),
  )

  if (res.status !== 200) {
    throw new Error(res.message)
  }

  return res.data.views
}

// 같은 카테고리의 다른 글 5개 조회 (현재 글, 비공개 글 제외)
export async function getSameCategoryPostList(
  params: GetSameCategoryPostListParams,
): Promise<GetSameCategoryPostListData> {
  const res = await API.get<GetSameCategoryPostListResponse>(
    GetSameCategoryPostList.path(params.postSeq),
    {
      next: {
        revalidate: 5 * 60,
        // 같은 카테고리 글이 추가/수정/삭제되면 전체 Post 캐시가 무효화되도록 Post.all 태그 사용
        tags: [CacheTags.Post.all],
      },
    },
  )

  if (res.status !== 200) {
    throw new Error(res.message)
  }

  return res.data
}
