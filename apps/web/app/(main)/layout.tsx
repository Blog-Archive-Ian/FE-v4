import { MobileUserInfo } from '@/section/user/mobile-user-info'
import { UserInfo } from '@/section/user/user-info'
import { getUserInfo } from '@/shared/api/user.api'
import { PostTitleProvider } from '@/shared/providers/post-title-provider'
import { Footer } from '@/shared/ui/organisms/footer'
import { Header } from '@/shared/ui/organisms/header'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserInfo()

  return (
    <div className="min-h-screen">
      <PostTitleProvider>
        <Header />

        <div className="block lg:hidden my-10">
          <MobileUserInfo user={user} />
        </div>

        <div className="lg:pt-12">
          <div className="mx-auto max-w-500 px-6">
            <div className="flex gap-8 ">
              <aside className="hidden w-80 lg:block shrink-0 ">
                <div className="sticky top-18 pt-8">
                  <UserInfo user={user} />
                </div>
              </aside>

              <main className="min-w-0 flex-1 lg:mt-10">{children}</main>
            </div>
          </div>
        </div>
        <Footer />
      </PostTitleProvider>
    </div>
  )
}
