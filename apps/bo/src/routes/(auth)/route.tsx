import { AppSidebar } from '@/shared/components/organisms/app-sidebar'
import { queryClient } from '@/shared/providers/query-provider'
import { authCheckQueryOptions } from '@/shared/query-hook/user.query'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@blog/ui'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async () => {
    const cached = queryClient.getQueryData(authCheckQueryOptions.queryKey)
    if (cached) return

    const res = await queryClient.ensureQueryData(authCheckQueryOptions)

    if (res.status !== 200) throw redirect({ to: '/', replace: true })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
