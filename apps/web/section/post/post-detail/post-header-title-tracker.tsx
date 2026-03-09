'use client'

import { useEffect } from 'react'

import { usePostTitleContext } from '@/shared/providers/post-title-provider'

type PostHeaderTitleTrackerProps = {
  // 헤더에 표시할 게시글 제목
  postTitle: string
}

export function PostHeaderTitleTracker({ postTitle }: PostHeaderTitleTrackerProps) {
  const { setCurrentPostTitle } = usePostTitleContext()

  useEffect(() => {
    if (!postTitle) return

    // 화면에 진입하면 헤더 제목을 현재 게시글 제목으로 설정
    setCurrentPostTitle(postTitle)

    // 페이지를 떠날 때 헤더 제목을 초기화
    return () => {
      setCurrentPostTitle(null)
    }
  }, [postTitle, setCurrentPostTitle])

  return null
}

