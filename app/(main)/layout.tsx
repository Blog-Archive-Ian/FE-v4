import { UserInfo } from '@/features/user-info/ui/user-info'
import { Header } from '@/shared/ui/organisms/header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="p-8">
      <Header />
      <UserInfo />
      {children}
    </main>
  )
}
