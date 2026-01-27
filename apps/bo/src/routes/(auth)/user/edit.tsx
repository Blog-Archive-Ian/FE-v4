import { EditUserPage } from '@/pages/user/edit-user-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/user/edit')({
  component: EditUserPage,
})
