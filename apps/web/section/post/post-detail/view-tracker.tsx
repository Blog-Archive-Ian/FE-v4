'use client'

import { useEffect } from 'react'

import { increasePostView } from '@/shared/api/post.api'

type PostViewTrackerProps = {
  // 조회수를 증가시킬 게시글 번호
  postSeq: number
}

export function PostViewTracker({ postSeq }: PostViewTrackerProps) {
  // 클라이언트에서만 한 번 호출해서 쿠키 기반 조회수 증가 처리
  useEffect(() => {
    ;(async () => {
      try {
        await increasePostView({ postSeq })
      } catch {
        // 조회수 증가 실패는 사용자 경험에 큰 영향을 주지 않으므로 조용히 무시
      }
    })()
  }, [postSeq])

  return null
}

