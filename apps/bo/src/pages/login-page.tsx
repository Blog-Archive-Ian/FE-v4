import { useLogin } from '@/shared/query-hook/user.query'
import { LoginSchema } from '@blog/contracts'
import { Button, cn } from '@blog/ui'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { email, z } from 'zod'

const LoginSchemaWithMessage = LoginSchema.extend({
  email: z.string().pipe(email('이메일 형식이 아닙니다.')),
  password: z.string().min(1, '비밀번호는 필수 입력사항입니다.'),
})

type LoginForm = z.infer<typeof LoginSchemaWithMessage>

export const LoginPage = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync: login } = useLogin({
    onSuccess: () => {
      navigate({ to: '/dashboard', replace: true })
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.email === '' || form.password === '') {
      setError('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }
    setError(null)
    login(form)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight">Archive BO</h1>
            <p className="mt-1 text-sm text-gray-500">관리자 로그인을 진행해주세요.</p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-gray-700">이메일</span>
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="admin@admin.com"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                autoComplete="email"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-gray-700">비밀번호</span>
              <input
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="password123"
                type="password"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                autoComplete="current-password"
              />
            </label>

            <p
              className={cn(
                'min-h-5 text-right text-xs transition-opacity',
                error ? 'text-red-500 opacity-100' : 'opacity-0',
              )}
            >
              {error ?? 'placeholder'}
            </p>

            <Button size="lg" type="submit" className="w-full">
              <span className="text-base font-medium">로그인</span>
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Archive
        </p>
      </div>
    </div>
  )
}
