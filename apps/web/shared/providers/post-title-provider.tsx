'use client'

import { createContext, useContext, useMemo, useState } from 'react'

type PostTitleContextValue = {
  // 헤더에 표시할 현재 게시글 제목 (없으면 null)
  currentPostTitle: string | null
  // 현재 게시글 제목을 설정/초기화하는 함수
  setCurrentPostTitle: (title: string | null) => void
}

const PostTitleContext = createContext<PostTitleContextValue | undefined>(undefined)

type PostTitleProviderProps = {
  children: React.ReactNode
}

export function PostTitleProvider({ children }: PostTitleProviderProps) {
  const [currentPostTitle, setCurrentPostTitle] = useState<string | null>(null)

  const value = useMemo(
    () => ({
      currentPostTitle,
      setCurrentPostTitle,
    }),
    [currentPostTitle],
  )

  return <PostTitleContext.Provider value={value}>{children}</PostTitleContext.Provider>
}

export function usePostTitleContext() {
  const ctx = useContext(PostTitleContext)

  if (!ctx) {
    throw new Error('usePostTitleContext는 PostTitleProvider 내부에서만 사용할 수 있습니다.')
  }

  return ctx
}

