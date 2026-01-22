import { API } from '@/shared/api/client'
import {
  GetUserAccount,
  type GetUserAccountData,
  type GetUserAccountResponse,
} from '@blog/contracts'

export async function getUserInfo(): Promise<GetUserAccountData> {
  const res = await API.get<GetUserAccountResponse>(GetUserAccount.path, {
    next: { revalidate: 60 * 60 }, // 1 hour
  })
  if (res.status !== 200) throw new Error(res.message)
  return res.data
}
