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
