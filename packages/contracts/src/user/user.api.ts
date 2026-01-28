import { z } from 'zod'
import { ApiResponse, ApiResponseStrict } from '../common'
import {
  CategorySchema,
  EditUserProfileImageSchema,
  EditUserSchema,
  LoginSchema,
  UserSchema,
} from './user.schema'

// 사용자 계정 정보 조회
export const GetUserAccount = {
  method: 'GET',
  path: '/user/account',
  Response: ApiResponseStrict(UserSchema),
}
export type GetUserAccountResponse = z.infer<typeof GetUserAccount.Response> // 응답 타입
export type GetUserAccountData = GetUserAccountResponse['data'] // 실제 데이터 타입

// 사용자 로그인
export const Login = {
  method: 'POST',
  path: '/auth/login',
  Body: LoginSchema,
  Response: ApiResponse(z.never()), // 로그인 응답에는 데이터가 없음
}
export type LoginResponse = z.infer<typeof Login.Response> // 응답 타입
export type LoginBody = z.infer<typeof Login.Body> // 요청 바디 타입

// 인증 상태 확인
export const AuthCheck = {
  method: 'GET',
  path: '/auth/check',
  Response: ApiResponse(z.never()),
}
export type AuthCheckResponse = z.infer<typeof AuthCheck.Response> // 응답 타입

// 사용자 정보 수정
export const EditUser = {
  method: 'PATCH',
  path: '/user/update',
  Body: EditUserSchema,
  Response: ApiResponse(z.never()),
}
export type EditUserBody = z.infer<typeof EditUser.Body> // 요청 바디 타입
export type EditUserResponse = z.infer<typeof EditUser.Response> // 응답 타입

// 사용자 프로필 이미지 수정
export const EditUserProfileImage = {
  method: 'PATCH',
  path: '/user/update/profileimage',
  Body: EditUserProfileImageSchema,
  Response: ApiResponse(z.never()),
}
export type EditUserProfileImageBody = z.infer<typeof EditUserProfileImage.Body> // 요청 바디 타입
export type EditUserProfileImageResponse = z.infer<typeof EditUserProfileImage.Response> // 응답 타입

// 카테고리 조회
export const getUserCategories = {
  method: 'GET',
  path: '/user/categories',
  Response: ApiResponseStrict(CategorySchema.array()),
}
export type GetUserCategoriesResponse = z.infer<typeof getUserCategories.Response> // 응답 타입
export type GetUserCategoriesData = GetUserCategoriesResponse['data'] // 실제 데이터 타입
