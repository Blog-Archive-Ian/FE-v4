import type { LoginBody, LoginResponse } from '@blog/contracts'
import { API } from './client'

// 사용자 로그인
export default async function login(params: LoginBody): Promise<LoginResponse> {
  const res = await API.post<LoginResponse>('/auth/login', params)
  if (res.status !== 200) throw new Error(res.message)
  return res
}
