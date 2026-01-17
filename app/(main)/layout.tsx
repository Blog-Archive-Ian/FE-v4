import { Header } from '@/shared/ui/organisms/header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="p-8">
      <Header />
      {children}
    </main>
  )
}
