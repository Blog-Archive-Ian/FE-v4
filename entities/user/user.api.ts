import { ApiResponse } from '@/shared/api/api.type'
import { API } from '@/shared/api/client'

import { User } from './user.entity'

export async function getUserInfo(): Promise<User> {
  const res = await API.get<ApiResponse<User>>('/user/account')
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}
