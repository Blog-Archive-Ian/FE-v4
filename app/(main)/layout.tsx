import { MobileUserInfo } from '@/features/user-info/ui/mobile-user-info'
import { UserInfo } from '@/features/user-info/ui/user-info'
import { Header } from '@/shared/ui/organisms/header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="block md:hidden mt-10">
        <MobileUserInfo />
      </div>

      <div className="flex">
        <aside className="hidden md:block md:w-100 md:shrink-0">
          <div className="fixed top-30.5 flex justify-center">
            <UserInfo />
          </div>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
