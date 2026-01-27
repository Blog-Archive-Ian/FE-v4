import {
  type EditUserBody,
  type EditUserProfileImageBody,
  type EditUserProfileImageResponse,
  type EditUserResponse,
  type GetUserAccountData,
  type LoginBody,
  type LoginResponse,
} from '@blog/contracts'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { useCallback } from 'react'
import { authCheck, editUserInfo, editUserProfileImage, getUserInfo, login } from '../api/user.api'

export const authQueryKeys = {
  all: ['auth'] as const,
  authCheck: () => [...authQueryKeys.all, 'auth-check'] as const,
  userInfo: () => [...authQueryKeys.all, 'user-info'] as const,
}

// 사용자 인증
export const authCheckQueryOptions = queryOptions({
  queryKey: authQueryKeys.authCheck(),
  queryFn: async () => {
    const res = await authCheck()
    return res
  },
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 30,
  retry: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
})

export const useAuthCheck = () => useQuery(authCheckQueryOptions)

// 사용자 로그인
export const useLogin = (options?: UseMutationOptions<LoginResponse, Error, LoginBody>) => {
  return useMutation({
    mutationFn: async (body: LoginBody) => {
      const res = await login(body)
      return res
    },
    ...options,
  })
}

// 사용자 정보
export const useUserInfo = (options?: UseQueryOptions<GetUserAccountData, Error>) => {
  return useQuery({
    queryKey: authQueryKeys.userInfo(),
    queryFn: async () => {
      const res = await getUserInfo()
      return res
    },
    select: useCallback((data: GetUserAccountData) => data, []),
    ...options,
  })
}

// 사용자 정보 수정
export const useEditUserInfo = (
  options?: UseMutationOptions<EditUserResponse, Error, EditUserBody>,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: EditUserBody) => {
      const res = await editUserInfo(body)
      return res
    },
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.userInfo() })
    },
  })
}

// 사용자 프로필 이미지 수정
export const useEditUserProfileImage = (
  options?: UseMutationOptions<EditUserProfileImageResponse, Error, EditUserProfileImageBody>,
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: EditUserProfileImageBody) => {
      const res = await editUserProfileImage(body)
      return res
    },
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.userInfo() })
    },
  })
}
