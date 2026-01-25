import { LoginSchema } from '@blog/contracts'
import { Button } from '@blog/ui'
import { useState } from 'react'
import { email, z } from 'zod'

const LoginSchemaWithMessage = LoginSchema.extend({
  email: z.string().pipe(email('이메일 형식이 아닙니다.')),
  password: z.string().min(1, '비밀번호는 필수 입력사항입니다.'),
})
type LoginForm = z.infer<typeof LoginSchemaWithMessage>

export const LoginPage = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: login mutation
  }

  return (
    <div className="max-w-105 m-20 p-5">
      <h1 className="text-[24px] font-extrabold mb-4">BO 로그인</h1>

      <form onSubmit={onSubmit} className="grid gap-4">
        <label className="grid gap-1.5">
          <span>이메일</span>
          <input
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="admin@admin.com"
            className="p-2 border border-gray-300 rounded"
            autoComplete="email"
          />
        </label>

        <label className="grid gap-1.5">
          <span>비밀번호</span>
          <input
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="password123"
            type="password"
            className="p-2 border border-gray-300 rounded"
            autoComplete="current-password"
          />
        </label>

        <Button type="submit">로그인</Button>
      </form>
    </div>
  )
}
