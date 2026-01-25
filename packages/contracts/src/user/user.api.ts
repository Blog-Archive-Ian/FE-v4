import { z } from 'zod'
import { ApiResponse } from '../common'
import { LoginSchema, UserSchema } from '../user'

// 사용자 계정 정보 조회
export const GetUserAccount = {
  method: 'GET',
  path: '/user/account',
  Response: ApiResponse(UserSchema),
}
export type GetUserAccountResponse = z.infer<typeof GetUserAccount.Response> // 응답 타입
export type GetUserAccountData = GetUserAccountResponse['data'] // 실제 데이터 타입

// 사용자 로그인
export const Login = {
  method: 'POST',
  path: '/auth/login',
  Body: LoginSchema,
  Response: ApiResponse(z.never()),
}
