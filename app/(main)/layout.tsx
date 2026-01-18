import { UserInfo } from '@/features/user-info/ui/user-info'
import { Header } from '@/shared/ui/organisms/header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="flex">
        <aside className="hidden lg:block lg:w-100 lg:shrink-0">
          <div className="fixed top-30.5 flex justify-center">
            <UserInfo />
          </div>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
