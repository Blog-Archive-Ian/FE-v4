import { ApiResponse } from '@/shared/api/api.type'
import { API } from '@/shared/api/client'

import { User } from './user.entity'

export async function getUserInfo(): Promise<User> {
  const res = await API.get<ApiResponse<User>>('/user/account', {
    next: { revalidate: 60 * 60 }, // 1 hour
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}
