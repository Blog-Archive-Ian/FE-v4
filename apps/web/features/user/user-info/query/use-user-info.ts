import { getUserInfo } from '@/shared/api/user.api'
import { User } from '@blog/contracts'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'

export const userInfoKey = {
  all: ['userInfo'] as const,
}

// 유저 정보 조회
export const useUserInfo = (options?: UseQueryOptions<User, Error>) => {
  return useQuery({
    queryKey: userInfoKey.all,
    queryFn: async () => {
      const res = await getUserInfo()
      return res
    },
    select: useCallback((data: User) => data, []),
    ...options,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
