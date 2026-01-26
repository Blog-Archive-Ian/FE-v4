import { type LoginBody, type LoginResponse } from '@blog/contracts'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import login from '../api/user.api'

// 사용자 로그인
export const useLogin = (options?: UseMutationOptions<LoginResponse, Error, LoginBody>) => {
  return useMutation({
    mutationFn: async (body: LoginBody) => {
      const res = await login(body)
      return res
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
    ...options,
  })
}
