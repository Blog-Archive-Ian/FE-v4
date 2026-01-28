import { z } from 'zod'

export const UserSchema = z.object({
  name: z.string(),
  id: z.string(),
  email: z.string().pipe(z.email()),
  instagramId: z.string(),
  intro: z.string(),
  personalUrl: z.url(),
  githubId: z.string(),
  profileImage: z.url(),
})
export type User = z.infer<typeof UserSchema>

export const LoginSchema = z.object({
  email: z.string().pipe(z.email()),
  password: z.string().min(1),
})

export const EditUserSchema = z.object({
  name: z.string(),
  intro: z.string(),
  instagramId: z.string(),
  githubId: z.string(),
  personalUrl: z.url(),
})
export type EditUser = z.infer<typeof EditUserSchema>

export const EditUserProfileImageSchema = z.object({
  profileImage: z.url(),
})
export type EditUserProfileImage = z.infer<typeof EditUserProfileImageSchema>

export const CategorySchema = z.object({
  categoryId: z.number(),
  name: z.string(),
  postCount: z.number(),
})
export type Category = z.infer<typeof CategorySchema>
