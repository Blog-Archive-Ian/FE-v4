import { LoginSchema } from '@blog/contracts'
import { email, z } from 'zod'

export const LoginSchemaWithMessage = LoginSchema.extend({
  email: z.string().pipe(email('이메일 형식이 아닙니다.')),
  password: z.string().min(1, '비밀번호는 필수 입력사항입니다.'),
})
export type LoginForm = z.infer<typeof LoginSchemaWithMessage>
