import { UserPage } from '@/pages/user/user-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/user/info')({
  component: UserPage,
})
