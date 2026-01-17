import type { Metadata } from 'next'

import { LoginPage } from '@/pages/login-page'

export const metadata: Metadata = {
  title: '로그인 | Archive',
}

export default function Page() {
  return <LoginPage />
}
